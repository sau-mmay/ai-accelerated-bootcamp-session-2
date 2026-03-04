# UI Guidelines — TODO App

This document defines the core UI guidelines for the TODO application.

## 1. Design System and Component Library

1.1 The app **must** use Material Design components via **MUI (Material UI)** as the primary component library.

1.2 The implementation should target the latest stable MUI release at build time.

1.3 Custom components are allowed only when no suitable Material component exists.

1.4 All forms, dialogs, menus, inputs, chips, and navigation patterns should follow Material behavior and accessibility defaults unless explicitly overridden in this document.

## 2. Visual Theme

2.1 The core color palette must be **cyan + black** with neutral support tones.

2.2 Palette guidance:
- Primary accent: cyan shades for interactive and focus states
- Background base: near-black and black surfaces
- Text: high-contrast light text on dark surfaces
- Semantic states: success/warning/error/info colors must remain distinct and accessible

2.3 The theme must be centralized in a single theme configuration and consumed consistently across the app.

2.4 Avoid one-off inline color values in components; use theme tokens.

## 3. Liquid Glass Button Style

3.1 Primary action buttons must use a **liquid glass** style treatment.

3.2 Required characteristics for liquid glass buttons:
- Semi-translucent background with cyan-tinted glow
- Soft internal highlight and subtle border
- Backdrop blur / frosted effect where supported
- Smooth hover and press transitions
- Preserved readability and contrast for button labels

3.3 Liquid glass styling should be implemented as a reusable variant or shared style primitive.

3.4 Non-primary buttons may use standard Material variants (`text`, `outlined`, `contained`) while staying visually consistent with the theme.

## 4. Layout and Spacing

4.1 Use Material layout primitives and an 8px spacing system.

4.2 Primary app layout should include:
- A clear top app bar or header
- A task input/quick-add region
- Task list content area
- Utility controls (filter/sort) grouped consistently

4.3 Maintain generous spacing to reduce visual clutter and improve scanability.

## 5. Typography and Iconography

5.1 Use Material typography scale and system font stack (or the default typography stack from the selected MUI theme).

5.2 Text hierarchy must clearly distinguish page titles, section headers, task titles, and metadata.

5.3 Use Material Symbols / MUI-compatible icon sets for consistent iconography.

## 6. Interaction and States

6.1 All interactive controls must provide clear `default`, `hover`, `focus`, `active`, `disabled`, and `loading` states.

6.2 Focus indicators must be visible and high contrast (especially on dark backgrounds).

6.3 Animations should be subtle and functional (100–250ms preferred for micro-interactions).

6.4 Destructive actions (delete/clear) require clear affordances and confirmation or undo support.

## 7. Accessibility Requirements

7.1 Meet WCAG 2.1 AA color contrast requirements for text and interactive elements.

7.2 Ensure full keyboard navigation for core flows (add, edit, complete, delete, filter, sort).

7.3 Every form element must include accessible labels and assistive text when needed.

7.4 Status updates and validation feedback should be announced via accessible patterns.

## 8. Responsive Behavior

8.1 The UI must work across mobile, tablet, and desktop breakpoints.

8.2 On smaller screens, prioritize:
- Fast task capture
- Readable task cards/rows
- Reachable primary actions

8.3 Navigation and action density should adapt by breakpoint without hiding core functionality.

## 9. Consistency Rules

9.1 Reuse established UI patterns before introducing new variants.

9.2 Do not mix unrelated visual styles (e.g., skeuomorphic controls with flat Material components) except the intentional liquid glass treatment.

9.3 Keep component behavior predictable across all screens.

## 10. MVP UI Baseline

At minimum, the MVP UI must include:
- Material-based task input and task list UI
- Cyan/black themed surfaces and controls
- Liquid glass styling for primary call-to-action buttons
- Accessible form and task interactions
- Responsive layout for mobile and desktop
