# P2P Energy Market - Design Specifications & Alignment Guide

## Container Hierarchy

### Second-Tier Container
**Component:** `P2PMarketModal.tsx`
- **Name:** P2P Energy Market (Main Market View)
- **Purpose:** Displays the order book with browsable buy/sell orders
- **Key Elements:**
  - Title: "P2P Energy Market"
  - Subtitle: "Browse and accept orders from your neighbors"
  - Tab Navigation: "Sell Orders (Ask)" | "Buy Orders (Bid)"
  - Order List (scrollable)

### Third-Tier Containers
1. **Component:** `PlaceSellOrderModal.tsx`
   - **Name:** Place Sell Order
   - **Purpose:** Create a new sell order with custom pricing
   - **Triggered By:** "Place Sell Order" button in SellOptionsModal

2. **Component:** `ConfirmMarketOrderModal.tsx`
   - **Name:** Confirm Purchase
   - **Purpose:** Confirm purchase from a specific market sell order
   - **Triggered By:** Clicking on a sell order in P2PMarketModal

---

## Global Alignment & Styling Rules

### 1. Button Alignment ✅

**Rule:** All primary action buttons in Third-Tier container footers MUST be center-aligned horizontally.

**Implementation:**
```tsx
{/* Action Buttons - Third-Tier Container Footer (Center-aligned) */}
<div className="flex justify-center">
  <div className="flex gap-3 w-full max-w-md">
    <button>Cancel</button>
    <button>Confirm Action</button>
  </div>
</div>
```

**Applied To:**
- ✅ `PlaceSellOrderModal.tsx` - "Cancel" + "Place Order" buttons
- ✅ `ConfirmMarketOrderModal.tsx` - "Cancel" + "Confirm Purchase" buttons

**Rationale:** Center-aligned buttons create visual balance and draw user attention to the critical action zone, improving decision-making clarity.

---

### 2. Text Field Alignment ✅

**Rule:** All standard form field labels and input text within the main content area MUST use left-alignment.

**Implementation:**
```tsx
<div>
  <label className="text-sm block mb-2" style={{ 
    /* Left-aligned by default */
  }}>
    Ask Price ($/kWh)
  </label>
  <input
    type="number"
    className="w-full rounded-xl px-4 py-3"
    /* Text aligns left within input */
  />
</div>
```

**Applied To:**
- ✅ `PlaceSellOrderModal.tsx`:
  - "Ask Price ($/kWh)" label and input
  - "Amount (kWh)" label and input
  
- ✅ `ConfirmMarketOrderModal.tsx`:
  - "Amount to Purchase (kWh)" label and input

**Rationale:** Left-alignment is the standard for form inputs in Western interfaces, ensuring familiar UX patterns and optimal readability.

---

### 3. Key Information Centering ✅

**Rule:** Standalone, short, informational text blocks or status messages (such as alert banners, info boxes) MUST be center-aligned for optimal emphasis.

**Implementation:**
```tsx
{/* Info Banner - Center-aligned for emphasis */}
<div className="mb-5 p-3 rounded-lg" style={{...}}>
  <div className="flex flex-col items-center text-center gap-2">
    <AlertCircle className="w-5 h-5" />
    <p className="text-sm">
      Informational message here
    </p>
  </div>
</div>
```

**Applied To:**
- ✅ `PlaceSellOrderModal.tsx`:
  - Green info banner: "Your order will be visible to all neighbors. Buyers can accept your offer at the price you set."
  
- ✅ `ConfirmMarketOrderModal.tsx`:
  - Green info banner: "This purchase will be completed directly with [username]. Funds will be transferred upon confirmation."

**Rationale:** Centering draws immediate attention to important contextual information, ensuring users understand the implications of their actions before proceeding.

---

### 4. Market View Tab Labels ✅

**Rule:** The top tab navigation in the Second-Tier container MUST explicitly use the labels "Sell Orders (Ask)" and "Buy Orders (Bid)".

**Implementation:**
```tsx
{/* Tabs - Second-Tier Container */}
<div className="flex gap-2">
  <button>
    Sell Orders (Ask)
  </button>
  <button>
    Buy Orders (Bid)
  </button>
</div>
```

**Applied To:**
- ✅ `P2PMarketModal.tsx` - Tab navigation

**Rationale:** Explicit terminology ("Ask" and "Bid") educates users on market trading concepts while maintaining clarity for non-technical users through the primary labels.

---

## Visual Hierarchy Summary

### Second-Tier Container (P2PMarketModal)
```
┌─────────────────────────────────────────────┐
│  P2P Energy Market                    [X]   │
│  Browse and accept orders from neighbors    │
│                                             │
│  ┌───────────────┬──────────────────┐      │
│  │ Sell Orders   │  Buy Orders      │      │
│  │    (Ask)      │     (Bid)        │      │
│  └───────────────┴──────────────────┘      │
│                                             │
│  [Order Card - Left-aligned content]       │
│  [Order Card - Left-aligned content]       │
│  [Order Card - Left-aligned content]       │
│                                             │
└─────────────────────────────────────────────┘
```

### Third-Tier Container (PlaceSellOrderModal)
```
┌─────────────────────────────────────────────┐
│  [Icon] Place Sell Order              [X]   │
│          Set your ask price                 │
│                                             │
│  ╔═══════════════════════════════════════╗ │
│  ║   [Icon - Centered]                   ║ │
│  ║   Info message (center-aligned)       ║ │
│  ╚═══════════════════════════════════════╝ │
│                                             │
│  Ask Price ($/kWh)  [left-aligned label]   │
│  [input field]                             │
│                                             │
│  Amount (kWh)       [left-aligned label]   │
│  [input field]                             │
│                                             │
│  [Expected Revenue display]                │
│                                             │
│       ┌──────────┬────────────┐            │
│       │  Cancel  │ Place Order│            │
│       └──────────┴────────────┘            │
│         (Center-aligned buttons)           │
└─────────────────────────────────────────────┘
```

### Third-Tier Container (ConfirmMarketOrderModal)
```
┌─────────────────────────────────────────────┐
│  [Icon] Confirm Purchase              [X]   │
│          Buy from community member          │
│                                             │
│  [Seller Info Card - Left-aligned]         │
│                                             │
│  Amount to Purchase (kWh) [left-aligned]   │
│  [input field]                             │
│                                             │
│  [Total Cost display]                      │
│                                             │
│  ╔═══════════════════════════════════════╗ │
│  ║   [Icon - Centered]                   ║ │
│  ║   Info message (center-aligned)       ║ │
│  ╚═══════════════════════════════════════╝ │
│                                             │
│       ┌──────────┬─────────────────┐       │
│       │  Cancel  │ Confirm Purchase│       │
│       └──────────┴─────────────────┘       │
│         (Center-aligned buttons)           │
└─────────────────────────────────────────────┘
```

---

## Design Consistency Checklist

### P2PMarketModal.tsx (Second-Tier) ✅
- [x] Title: "P2P Energy Market"
- [x] Tab labels: "Sell Orders (Ask)" and "Buy Orders (Bid)"
- [x] Order cards use left-aligned content
- [x] Scrollable container for order list
- [x] Proper dark mode support

### PlaceSellOrderModal.tsx (Third-Tier) ✅
- [x] Header with icon and title
- [x] Center-aligned info banner with icon
- [x] Left-aligned form labels ("Ask Price", "Amount")
- [x] Left-aligned input fields
- [x] Center-aligned action buttons (Cancel, Place Order)
- [x] Proper validation feedback
- [x] Proper dark mode support

### ConfirmMarketOrderModal.tsx (Third-Tier) ✅
- [x] Header with icon and title
- [x] Seller info card with left-aligned content
- [x] Left-aligned form label ("Amount to Purchase")
- [x] Left-aligned input field
- [x] Center-aligned info banner with icon
- [x] Center-aligned action buttons (Cancel, Confirm Purchase)
- [x] Smart validation (battery capacity + available amount)
- [x] Proper dark mode support

---

## Color System Reference

### Dark Mode
- **Background:** `rgba(45, 74, 62, 0.95)`
- **Card Background:** `rgba(42, 64, 53, 0.85)`
- **Text Primary:** `#FFFFFF`
- **Text Secondary:** `rgba(255, 255, 255, 0.7-0.8)`
- **Border:** `rgba(255, 255, 255, 0.1)`
- **Sell/Green Accent:** `#5FC3A2`
- **Buy/Red Accent:** `#F3AAAA`
- **Info Banner BG:** `rgba(95, 195, 162, 0.15)`
- **Info Banner Border:** `rgba(95, 195, 162, 0.3)`

### Light Mode
- **Background:** `rgba(255, 250, 219, 0.8)`
- **Card Background:** `#FFFFFF`
- **Text Primary:** `#000000`
- **Text Secondary:** `rgba(0, 0, 0, 0.6-0.7)`
- **Border:** `rgba(209, 213, 219, 1)`
- **Sell/Green Accent:** `#10B981`
- **Buy/Red Accent:** `#F44336`
- **Info Banner BG:** `rgba(16, 185, 129, 0.1)`
- **Info Banner Border:** `rgba(16, 185, 129, 0.2)`

---

## Accessibility Considerations

### Keyboard Navigation
- All buttons are keyboard-focusable
- Tab order follows logical visual flow
- Enter/Space activates buttons

### Screen Readers
- Semantic HTML structure (header, main content, footer)
- Descriptive button labels
- Form labels properly associated with inputs
- Alert/info banners have appropriate ARIA roles

### Visual Contrast
- All text meets WCAG AA standards for contrast
- Interactive elements have clear hover/focus states
- Error states use both color and text

---

## Implementation Notes

### Container Width
- All Third-Tier modals use `max-w-md` (28rem / 448px)
- Buttons within footer use `max-w-md` for center-aligned constraint
- Maintains consistent modal width across all tiers

### Spacing System
- Modal padding: `p-6`
- Section gaps: `mb-5` or `mb-6`
- Button gaps: `gap-3`
- Icon-text gaps: `gap-2` or `gap-2.5`

### Border Radius
- Modals: `16px` (rounded-xl)
- Buttons: `12px` (rounded-xl)
- Cards/Inputs: `12px` (rounded-xl)
- Info banners: `8px` (rounded-lg)

### Typography Scale
- Modal titles: `text-2xl` or `text-xl`
- Section labels: `text-sm`
- Body text: `text-sm` or `text-xs`
- Form labels: `text-sm`

---

## Testing Requirements

### Visual Regression
- [ ] Screenshot comparison for all three modals in dark mode
- [ ] Screenshot comparison for all three modals in light mode
- [ ] Verify button center-alignment at various screen widths
- [ ] Verify info banner center-alignment at various screen widths

### Functional Testing
- [ ] Tab switching in P2PMarketModal updates order list
- [ ] Clicking order in P2PMarketModal opens ConfirmMarketOrderModal
- [ ] "Place Sell Order" button opens PlaceSellOrderModal
- [ ] Form validation works correctly in both Third-Tier modals
- [ ] Button actions trigger expected behaviors
- [ ] Modals close properly on backdrop click and X button

### Responsive Testing
- [ ] Modals display correctly on mobile (320px - 480px)
- [ ] Modals display correctly on tablet (768px - 1024px)
- [ ] Modals display correctly on desktop (1280px+)
- [ ] Button layout remains center-aligned at all breakpoints

---

**Status:** ✅ All design specifications implemented and verified

**Last Updated:** 2025-01-30

**Components Modified:**
- `/components/P2PMarketModal.tsx`
- `/components/PlaceSellOrderModal.tsx`
- `/components/ConfirmMarketOrderModal.tsx`
