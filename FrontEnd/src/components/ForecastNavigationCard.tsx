import { useState, useEffect } from 'react';
import { CloudSun, Sun, CloudRain, Cloud } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from './ui/carousel';

interface ForecastNavigationCardProps {
  darkMode?: boolean;
}

export function ForecastNavigationCard({ darkMode = false }: ForecastNavigationCardProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get current day for dynamic weather display
  const currentDayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Weather data - all 7 days with their properties (temperatures in Celsius)
  const allWeatherData = [
    { day: 'Sun', temp: 26, condition: 'partly-cloudy', icon: CloudSun },
    { day: 'Mon', temp: 22, condition: 'sunny', icon: Sun },
    { day: 'Tue', temp: 24, condition: 'sunny', icon: Sun },
    { day: 'Wed', temp: 26, condition: 'partly-cloudy', icon: CloudSun },
    { day: 'Thu', temp: 24, condition: 'rainy', icon: CloudRain },
    { day: 'Fri', temp: 23, condition: 'cloudy', icon: Cloud },
    { day: 'Sat', temp: 25, condition: 'sunny', icon: Sun },
  ];

  // Get all 7 days starting from current day
  const getNext7Days = () => {
    const next7Days = [];
    for (let i = 0; i < 7; i++) {
      const dayIndex = (currentDayIndex + i) % 7;
      next7Days.push(allWeatherData[dayIndex]);
    }
    return next7Days;
  };

  const weatherData = getNext7Days();

  // Solar generation forecast - All 7 days (Mon-Sun) - Backend controlled
  const solarGenerationData = [
    { day: 'Mon', value: 28 },
    { day: 'Tue', value: 30 },
    { day: 'Wed', value: 32 },
    { day: 'Thu', value: 22 },
    { day: 'Fri', value: 25 },
    { day: 'Sat', value: 31 },
    { day: 'Sun', value: 33 },
  ];

  // Consumption forecast - Full 7 consecutive days (Mon-Sun) - Backend controlled
  const consumptionData = [
    { day: 'Mon', value: 25 },
    { day: 'Tue', value: 27 },
    { day: 'Wed', value: 26 },
    { day: 'Thu', value: 24 },
    { day: 'Fri', value: 23 },
    { day: 'Sat', value: 28 },
    { day: 'Sun', value: 29 },
  ];

  // Update current slide when carousel changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    onSelect();

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="px-3 py-2 rounded-lg shadow-lg"
          style={{
            background: darkMode ? 'rgba(42, 64, 53, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <p
            className="text-sm"
            style={{
              color: darkMode ? '#FFFFFF' : '#000000',
              fontWeight: 'var(--font-weight-semibold)',
            }}
          >
            {payload[0].value} kWh
          </p>
        </div>
      );
    }
    return null;
  };

  const scrollToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  // Uniform card height (matches taller card)
  const CARD_HEIGHT = '520px';

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent>
          {/* Slide 1: Weather & Solar Forecast */}
          <CarouselItem>
            <div
              className="rounded-xl overflow-hidden mx-auto"
              style={{
                background: darkMode
                  ? 'linear-gradient(90deg, rgba(98, 191, 212, 0.4) 0%, rgba(241, 221, 118, 0.4) 100%)'
                  : 'linear-gradient(90deg, rgba(98, 191, 212, 0.4) 0%, rgba(241, 221, 118, 0.4) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                height: CARD_HEIGHT,
              }}
            >
              <div className="px-6 py-8 h-full">
                <div className="flex flex-col items-center h-full justify-between">
                  {/* Title - Centered */}
                  <div className="text-center w-full">
                    <h3
                      className="text-xl mb-2"
                      style={{
                        color: darkMode ? '#FFFFFF' : '#000000',
                        fontWeight: 'var(--font-weight-bold)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      Weather & Solar Forecast
                    </h3>
                    <p
                      className="text-sm"
                      style={{
                        color: darkMode ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.65)',
                        fontWeight: 'var(--font-weight-light)',
                        letterSpacing: '0.01em',
                      }}
                    >
                      7-day weather & solar outlook
                    </p>
                  </div>

                  {/* 7-Day Weather Grid - Row 1: 3 boxes, Row 2: 4 boxes */}
                  <div className="w-full flex flex-col items-center gap-2.5">
                    {/* Row 1: First 3 days - Celsius */}
                    <div className="flex justify-center items-center gap-3">
                      {weatherData.slice(0, 3).map((day, index) => {
                        const IconComponent = day.icon;
                        return (
                          <div
                            key={`${day.day}-${index}`}
                            className="flex flex-col items-center gap-1.5"
                            style={{
                              minWidth: '68px',
                              padding: '8px 8px',
                              background: darkMode
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'rgba(255, 255, 255, 0.6)',
                              borderRadius: '10px',
                            }}
                          >
                            <p
                              className="text-xs"
                              style={{
                                color: darkMode
                                  ? 'rgba(255, 255, 255, 0.85)'
                                  : 'rgba(0, 0, 0, 0.75)',
                                fontWeight: 'var(--font-weight-semibold)',
                                letterSpacing: '0.01em',
                              }}
                            >
                              {day.day}
                            </p>
                            <div
                              className="p-1.5 rounded-lg"
                              style={{
                                background: darkMode
                                  ? 'rgba(255, 255, 255, 0.12)'
                                  : 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              <IconComponent
                                className="w-5 h-5"
                                style={{ color: darkMode ? '#FCFFA9' : '#F59E0B' }}
                              />
                            </div>
                            <p
                              className="text-sm"
                              style={{
                                color: darkMode ? '#FFFFFF' : '#000000',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: '-0.01em',
                              }}
                            >
                              {day.temp}°C
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Row 2: Next 4 days */}
                    <div className="flex justify-center items-center gap-3">
                      {weatherData.slice(3, 7).map((day, index) => {
                        const IconComponent = day.icon;
                        return (
                          <div
                            key={`${day.day}-${index + 3}`}
                            className="flex flex-col items-center gap-1.5"
                            style={{
                              minWidth: '68px',
                              padding: '8px 8px',
                              background: darkMode
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'rgba(255, 255, 255, 0.6)',
                              borderRadius: '10px',
                            }}
                          >
                            <p
                              className="text-xs"
                              style={{
                                color: darkMode
                                  ? 'rgba(255, 255, 255, 0.85)'
                                  : 'rgba(0, 0, 0, 0.75)',
                                fontWeight: 'var(--font-weight-semibold)',
                                letterSpacing: '0.01em',
                              }}
                            >
                              {day.day}
                            </p>
                            <div
                              className="p-1.5 rounded-lg"
                              style={{
                                background: darkMode
                                  ? 'rgba(255, 255, 255, 0.12)'
                                  : 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              <IconComponent
                                className="w-5 h-5"
                                style={{ color: darkMode ? '#FCFFA9' : '#F59E0B' }}
                              />
                            </div>
                            <p
                              className="text-sm"
                              style={{
                                color: darkMode ? '#FFFFFF' : '#000000',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: '-0.01em',
                              }}
                            >
                              {day.temp}°C
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Solar Generation Chart - 7 Days - PERFECTLY CENTERED */}
                  <div className="w-full flex flex-col items-center">
                    <div className="text-center mb-3">
                      <h4
                        className="text-sm mb-1"
                        style={{
                          color: darkMode ? '#FFFFFF' : '#000000',
                          fontWeight: 'var(--font-weight-semibold)',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        Solar Generation Forecast
                      </h4>
                      <p
                        className="text-xs"
                        style={{
                          color: darkMode
                            ? 'rgba(255, 255, 255, 0.65)'
                            : 'rgba(0, 0, 0, 0.55)',
                          fontWeight: 'var(--font-weight-light)',
                        }}
                      >
                        7-day expected output (kWh)
                      </p>
                    </div>
                    {/* Chart Container - Centered with mx-auto */}
                    <div style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }}>
                      <ResponsiveContainer width="100%" height={130}>
                        <BarChart data={solarGenerationData} margin={{ left: -10, right: 10 }}>
                          <XAxis
                            dataKey="day"
                            stroke={darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}
                            style={{
                              fontSize: '11px',
                              fontWeight: 'var(--font-weight-medium)',
                            }}
                            tickLine={false}
                          />
                          <YAxis
                            stroke={darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}
                            style={{
                              fontSize: '11px',
                              fontWeight: 'var(--font-weight-light)',
                            }}
                            tickLine={false}
                            axisLine={false}
                            width={35}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar
                            dataKey="value"
                            fill={darkMode ? '#5FC3A2' : '#10B981'}
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* Slide 2: Your Energy Usage Forecast */}
          <CarouselItem>
            <div
              className="rounded-xl overflow-hidden mx-auto"
              style={{
                background: darkMode
                  ? 'linear-gradient(90deg, rgba(98, 191, 212, 0.4) 0%, rgba(241, 221, 118, 0.4) 100%)'
                  : 'linear-gradient(90deg, rgba(98, 191, 212, 0.4) 0%, rgba(241, 221, 118, 0.4) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                height: CARD_HEIGHT,
              }}
            >
              <div className="px-6 py-8 h-full">
                <div className="flex flex-col items-center h-full justify-between">
                  {/* Title - Centered */}
                  <div className="text-center w-full">
                    <h3
                      className="text-xl mb-2"
                      style={{
                        color: darkMode ? '#FFFFFF' : '#000000',
                        fontWeight: 'var(--font-weight-bold)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      Your Energy Usage Forecast
                    </h3>
                    <p
                      className="text-sm"
                      style={{
                        color: darkMode ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.65)',
                        fontWeight: 'var(--font-weight-light)',
                        letterSpacing: '0.01em',
                      }}
                    >
                      Full 7-day consumption outlook
                    </p>
                  </div>

                  {/* Consumption Chart - 7 Days - PERFECTLY CENTERED */}
                  <div className="w-full flex flex-col items-center">
                    <div className="text-center mb-4">
                      <h4
                        className="text-sm mb-1"
                        style={{
                          color: darkMode ? '#FFFFFF' : '#000000',
                          fontWeight: 'var(--font-weight-semibold)',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        Daily Consumption Forecast
                      </h4>
                      <p
                        className="text-xs"
                        style={{
                          color: darkMode
                            ? 'rgba(255, 255, 255, 0.65)'
                            : 'rgba(0, 0, 0, 0.55)',
                          fontWeight: 'var(--font-weight-light)',
                        }}
                      >
                        Complete weekly usage pattern (kWh)
                      </p>
                    </div>
                    {/* Chart Container - Centered with mx-auto */}
                    <div style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }}>
                      <ResponsiveContainer width="100%" height={160}>
                        <LineChart data={consumptionData} margin={{ left: -10, right: 10 }}>
                          <XAxis
                            dataKey="day"
                            stroke={darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}
                            style={{
                              fontSize: '11px',
                              fontWeight: 'var(--font-weight-medium)',
                            }}
                            tickLine={false}
                          />
                          <YAxis
                            stroke={darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}
                            style={{
                              fontSize: '11px',
                              fontWeight: 'var(--font-weight-light)',
                            }}
                            tickLine={false}
                            axisLine={false}
                            width={35}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={darkMode ? '#6BA3E8' : '#3B82F6'}
                            strokeWidth={3}
                            dot={{
                              fill: darkMode ? '#6BA3E8' : '#3B82F6',
                              strokeWidth: 2,
                              r: 4,
                            }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Insightful Breakdown - Centered */}
                  <div
                    className="rounded-lg w-full mx-auto"
                    style={{
                      background: darkMode
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(255, 255, 255, 0.7)',
                      padding: '20px 24px',
                      maxWidth: '340px',
                    }}
                  >
                    <h4
                      className="text-sm mb-4 text-center"
                      style={{
                        color: darkMode ? '#FFFFFF' : '#000000',
                        fontWeight: 'var(--font-weight-semibold)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      Usage Insights
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center space-y-1">
                        <p
                          className="text-xs"
                          style={{
                            color: darkMode
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'rgba(0, 0, 0, 0.6)',
                            fontWeight: 'var(--font-weight-light)',
                          }}
                        >
                          Avg. Peak Usage
                        </p>
                        <p
                          style={{
                            color: darkMode ? '#FFFFFF' : '#000000',
                            fontWeight: 'var(--font-weight-bold)',
                            fontSize: '15px',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          10 kWh
                        </p>
                      </div>
                      <div className="text-center space-y-1">
                        <p
                          className="text-xs"
                          style={{
                            color: darkMode
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'rgba(0, 0, 0, 0.6)',
                            fontWeight: 'var(--font-weight-light)',
                          }}
                        >
                          Avg. Night Usage
                        </p>
                        <p
                          style={{
                            color: darkMode ? '#FFFFFF' : '#000000',
                            fontWeight: 'var(--font-weight-bold)',
                            fontSize: '15px',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          8 kWh
                        </p>
                      </div>
                      <div className="text-center space-y-1">
                        <p
                          className="text-xs"
                          style={{
                            color: darkMode
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'rgba(0, 0, 0, 0.6)',
                            fontWeight: 'var(--font-weight-light)',
                          }}
                        >
                          Weekly Total
                        </p>
                        <p
                          style={{
                            color: darkMode ? '#FFFFFF' : '#000000',
                            fontWeight: 'var(--font-weight-bold)',
                            fontSize: '15px',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          182 kWh
                        </p>
                      </div>
                      <div className="text-center space-y-1">
                        <p
                          className="text-xs"
                          style={{
                            color: darkMode
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'rgba(0, 0, 0, 0.6)',
                            fontWeight: 'var(--font-weight-light)',
                          }}
                        >
                          Est. Cost
                        </p>
                        <p
                          style={{
                            color: darkMode ? '#5FC3A2' : '#10B981',
                            fontWeight: 'var(--font-weight-bold)',
                            fontSize: '15px',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          145 CO₂
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      {/* Page Dot Indicators - Centered */}
      <div className="flex justify-center gap-2.5 mt-5">
        <button
          onClick={() => scrollToSlide(0)}
          className="rounded-full transition-all duration-300 cursor-pointer"
          style={{
            width: currentSlide === 0 ? '28px' : '8px',
            height: '8px',
            background:
              currentSlide === 0
                ? darkMode
                  ? '#5FC3A2'
                  : '#10B981'
                : darkMode
                ? 'rgba(255, 255, 255, 0.3)'
                : 'rgba(0, 0, 0, 0.2)',
          }}
          aria-label="View weather forecast"
        />
        <button
          onClick={() => scrollToSlide(1)}
          className="rounded-full transition-all duration-300 cursor-pointer"
          style={{
            width: currentSlide === 1 ? '28px' : '8px',
            height: '8px',
            background:
              currentSlide === 1
                ? darkMode
                  ? '#5FC3A2'
                  : '#10B981'
                : darkMode
                ? 'rgba(255, 255, 255, 0.3)'
                : 'rgba(0, 0, 0, 0.2)',
          }}
          aria-label="View consumption forecast"
        />
      </div>
    </div>
  );
}
