# Testing Guide for TermRooms

## Quick Start - Local Testing

### 1. Start the Development Server
```bash
npm run dev
```
Then open `http://localhost:5173/p204` in your browser.

### 2. Build for Production Testing
```bash
npm run build
npm run preview
```
This builds the site exactly as it will appear on GitHub Pages.

---

## Accessibility Testing

### 1. Keyboard Navigation Testing ⚡

**Test without using your mouse!** Use only keyboard.

#### Navigation Checklist:
- [ ] **Tab Key**: Navigate through all interactive elements
  - Can you reach all links in the navigation?
  - Can you access all buttons?
  - Can you fill out all forms?
  - Focus indicators should be visible (outline/ring around focused elements)

- [ ] **Skip Link**: 
  - Press Tab when page loads - skip link should appear at top
  - Press Enter on skip link - should jump to main content
  - Skip link should be visible when focused

- [ ] **Forms**:
  - Tab through all form fields
  - Press Enter to submit forms
  - Press Escape to clear terminal input

- [ ] **Modals**:
  - Open MailPage compose modal
  - Tab should stay within modal (focus trap)
  - Press Escape - modal should close
  - Focus should return to trigger button

- [ ] **Room Actions**:
  - Navigate to RoomsPage
  - Tab to "Edit room" buttons
  - Tab through edit form fields
  - Tab to Save/Cancel/Delete buttons

#### Keyboard Shortcuts to Test:
- `Tab` - Move forward through elements
- `Shift + Tab` - Move backward through elements
- `Enter` - Activate buttons/links
- `Escape` - Close modals, clear terminal input
- `Space` - Scroll page (if needed)

### 2. Screen Reader Testing 🗣️

#### On Mac (VoiceOver):
1. **Enable VoiceOver**: `Cmd + F5` or System Settings → Accessibility → VoiceOver
2. **Navigate**: Use `Control + Option + Arrow Keys`
3. **Test Pages**:
   - Navigate to each page and verify headings are announced
   - Check that ARIA labels are read correctly
   - Verify button purposes are clear
   - Test that live regions announce updates

#### On Windows (NVDA - Free):
1. **Download NVDA**: https://www.nvaccess.org/download/
2. **Start NVDA**: Press `Insert + N` to start
3. **Navigate**: Use arrow keys, Tab, and NVDA shortcuts
4. **Test**: Same as VoiceOver above

#### Screen Reader Checklist:
- [ ] **Headings**: 
  - Each page announces its main heading (h1)
  - Subheadings (h2, h3) are announced in order
  - No skipped heading levels

- [ ] **Navigation**:
  - "Main navigation" landmark is announced
  - All links have clear purposes
  - Current page link is identified

- [ ] **Forms**:
  - All inputs have labels announced
  - Required fields are identified
  - Error messages are announced

- [ ] **Buttons**:
  - Icon-only buttons have descriptive labels
  - "Open room [room name]" is clear
  - "Edit room [room name]" is clear
  - "Compose new invite" is clear

- [ ] **Live Regions**:
  - Alert messages are announced when they appear
  - Status updates are announced
  - New messages in chat are announced

- [ ] **Modals**:
  - Modal title is announced when opened
  - Focus moves into modal
  - "Close compose dialog" button is clear

### 3. Color Contrast Testing 🎨

#### Manual Testing Tool:
1. **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
2. **Test These Combinations**:
   - Main text (`#e6edf3`) on background (`#04060b`)
   - Light text (`#f5faff`) on dark backgrounds
   - Button text on button backgrounds
   - Link colors on backgrounds
   - Alert text on alert backgrounds

#### Browser Extension (Easiest):
1. **Install WAVE Extension**: 
   - Chrome: https://chrome.google.com/webstore/detail/wave-evaluation-tool
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/wave-accessibility-tool/
2. **Run WAVE**:
   - Click WAVE icon in browser
   - Review contrast errors
   - Fix any failing ratios

#### Target Ratios:
- **Normal Text**: 4.5:1 minimum (WCAG AA)
- **Large Text** (18pt+): 3:1 minimum (WCAG AA)
- **UI Components**: 3:1 minimum

### 4. Automated Testing Tools 🤖

#### Browser Extensions:

**1. axe DevTools (Recommended)**
```bash
# Install Chrome extension:
https://chrome.google.com/webstore/detail/axe-devtools
```
- Click axe icon → "Scan all of my page"
- Review violations
- Fix issues reported

**2. Lighthouse (Built into Chrome)**
1. Open Chrome DevTools (`F12`)
2. Go to "Lighthouse" tab
3. Check "Accessibility" checkbox
4. Click "Generate report"
5. Review accessibility score (aim for 90+)

**3. WAVE (Web Accessibility Evaluation Tool)**
- Browser extension (see above)
- Or use online: https://wave.webaim.org/
- Enter your URL and test

#### Command Line Tools:

**1. Pa11y (Node.js)**
```bash
npm install -g pa11y
pa11y http://localhost:5173/p204
```

**2. axe CLI**
```bash
npm install -g @axe-core/cli
axe http://localhost:5173/p204
```

### 5. Manual Testing Checklist 📋

#### Page-by-Page Testing:

**HomePage (`/`):**
- [ ] Skip link works
- [ ] Heading hierarchy: h1 → h2
- [ ] All links keyboard accessible
- [ ] Focus indicators visible
- [ ] Color contrast acceptable

**RoomsPage (`/rooms`):**
- [ ] Heading: h1 "Rooms" → h2 sections
- [ ] Create room form keyboard accessible
- [ ] Join room form keyboard accessible
- [ ] Edit buttons have aria-labels
- [ ] Alert messages announced
- [ ] All buttons keyboard accessible

**RoomPage (`/room/:roomId`):**
- [ ] Heading: h1 with room name
- [ ] Terminal input keyboard accessible
- [ ] Message list has aria-live
- [ ] Sidebar has aria-label
- [ ] User list has aria-label
- [ ] Error messages announced (aria-live="assertive")
- [ ] Feedback messages announced (aria-live="polite")

**MailPage (`/mail`):**
- [ ] Heading: h1 "Your invites"
- [ ] Compose button has aria-label
- [ ] Modal has proper aria-labelledby
- [ ] Modal focus trap works
- [ ] Accept/Decline buttons have aria-labels
- [ ] Alert messages announced

**GuidePage (`/guides`):**
- [ ] Heading: h1 → h2 → h3 hierarchy
- [ ] All content keyboard accessible
- [ ] Command reference clear

**AuthPage (`/auth`):**
- [ ] Heading: h1 → h2
- [ ] Form keyboard accessible
- [ ] Logout button has aria-label
- [ ] Status messages announced

### 6. Cross-Browser Testing 🌐

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

**What to check:**
- Skip link works
- Focus indicators visible
- Keyboard navigation works
- ARIA attributes respected
- Modals work correctly

### 7. Mobile Testing 📱

**Test on actual device or browser DevTools:**

1. **Enable Mobile View**:
   - Chrome DevTools: `Cmd/Ctrl + Shift + M`
   - Select device (iPhone, iPad, etc.)

2. **Test**:
   - [ ] Touch targets are large enough (44x44px minimum)
   - [ ] Navigation is usable
   - [ ] Forms are fillable
   - [ ] Modals work correctly
   - [ ] Text is readable

### 8. Testing Specific Features 🎯

#### Terminal Input:
- [ ] Can type commands
- [ ] Tab key doesn't break input
- [ ] Escape clears input
- [ ] Enter submits command
- [ ] Label is announced by screen reader

#### Message List:
- [ ] New messages announced
- [ ] "Load more" button accessible
- [ ] "Jump to latest" button accessible
- [ ] Scrollable area has proper role

#### Room Management:
- [ ] Create room form accessible
- [ ] Join room form accessible
- [ ] Edit room buttons accessible
- [ ] Delete confirmation accessible

#### Invite System:
- [ ] Compose modal accessible
- [ ] Form fields labeled
- [ ] Accept/Decline buttons accessible
- [ ] Status updates announced

---

## Quick Test Script

Run through this in 5 minutes:

1. **Start dev server**: `npm run dev`
2. **Open browser**: Go to `http://localhost:5173/p204`
3. **Press Tab**: Verify skip link appears
4. **Press Tab again**: Navigate through navigation
5. **Go to Rooms page**: Tab through create/join forms
6. **Open a room**: Tab through terminal, verify focus
7. **Go to Mail page**: Open compose modal, verify focus trap
8. **Run Lighthouse**: Check accessibility score (should be 90+)

---

## Common Issues to Watch For

### ❌ Problems:
- **No focus indicators**: Add `:focus-visible` styles
- **Skipped heading levels**: Fix heading hierarchy
- **Missing labels**: Add `aria-label` or `<label>`
- **Low contrast**: Adjust colors to meet 4.5:1 ratio
- **Modal focus escape**: Add focus trap
- **Live regions not announcing**: Check `aria-live` attributes

### ✅ Success Indicators:
- All interactive elements keyboard accessible
- Screen reader announces everything clearly
- Color contrast meets WCAG AA
- Focus indicators visible
- Skip link works
- Modals trap focus correctly

---

## Testing Resources

- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **WAVE**: https://wave.webaim.org/
- **axe DevTools**: https://www.deque.com/axe/devtools/
- **Lighthouse**: Built into Chrome DevTools
- **NVDA Screen Reader**: https://www.nvaccess.org/
- **VoiceOver Guide**: https://www.apple.com/accessibility/vision/

---

## Pre-Deployment Checklist

Before pushing to GitHub Pages:

- [ ] Run `npm run build` successfully
- [ ] Test built version with `npm run preview`
- [ ] Run Lighthouse accessibility audit (90+ score)
- [ ] Test keyboard navigation on all pages
- [ ] Test with screen reader (at least one)
- [ ] Verify color contrast
- [ ] Test in multiple browsers
- [ ] Test on mobile device/browser
- [ ] Verify skip link works
- [ ] Verify all ARIA labels are correct

---

**Happy Testing! 🎉**

