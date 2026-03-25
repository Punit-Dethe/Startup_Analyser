# Temporary Tabs System
## Requirements Document

**Feature**: Temporary tabs within a single dashboard  
**Version**: 3.0 (Corrected)  
**Date**: 2025-01-24  
**Status**: Draft

---

## 1. Executive Summary

### Problem Statement
The current KORE dashboard system has two response modes:
1. **CHAT** - Answer questions in chat (text only)
2. **REFRESH** - Regenerate the entire 5-tab dashboard

This creates a gap: when users want focused analysis (competitor comparison, revenue deep dive, market analysis), the system either:
- Provides text-only response (too limited for complex data)
- Regenerates the entire dashboard (too heavy, loses context)

### Proposed Solution
Add a third response mode: **TEMPORARY_TAB**

The chat AI can create NEW tabs that appear in the existing tab navigation bar alongside permanent tabs (Overview, Financials, Market, Business Model, Competitors). These temporary tabs:
- Contain modules in 5x5 grid (just like permanent tabs)
- Appear in the SAME tab bar as permanent tabs
- Have a visual indicator (colored dot)
- Can be closed/removed individually
- Clear on page refresh (no persistence)

### Success Criteria
- Chat AI correctly decides between CHAT / REFRESH / TEMPORARY_TAB
- Temporary tabs render correctly with 5x5 module grid
- Users can close temporary tabs
- Temporary tabs clear on page refresh
- No performance degradation

---

## 2. User Stories

### US-1: Generate Main Dashboard
**As a** business analyst  
**I want to** generate a comprehensive dashboard for a company  
**So that** I can get a complete overview of their business

**Acceptance Criteria:**
- User enters company name
- System generates 5 permanent tabs (Overview, Financials, Market, Business Model, Competitors)
- All tabs follow 5x5 grid rule
- Tabs appear in tab bar

---

### US-2: Create Temporary Tab for Competitor Comparison
**As a** business analyst  
**I want to** compare a company with its competitors  
**So that** I can understand relative market position

**Acceptance Criteria:**
- User asks "Compare [Company] with [Competitors]" in chat
- Chat AI responds with TEMPORARY_TAB action
- NEW tab appears in tab bar with label "Competitor Comparison"
- Tab has colored dot indicator (temporary)
- Tab contains 15-25 modules in 5x5 grid
- System automatically switches to new tab
- Permanent tabs are preserved

---

### US-3: Create Temporary Tab for Deep Dive
**As a** business analyst  
**I want to** explore a specific aspect in detail (e.g., revenue model)  
**So that** I can gain deeper insights

**Acceptance Criteria:**
- User asks "Deep dive into [Company]'s revenue model" in chat
- Chat AI responds with TEMPORARY_TAB action
- NEW tab appears in tab bar with label "Revenue Deep Dive"
- Tab has colored dot indicator (temporary)
- Tab contains revenue-focused modules
- System automatically switches to new tab
- Permanent tabs are preserved

---

### US-4: Remove Temporary Tab
**As a** business analyst  
**I want to** close temporary tabs I no longer need  
**So that** I can keep my workspace clean

**Acceptance Criteria:**
- Temporary tabs have close button (X)
- Clicking close button removes the tab
- All modules for that tab are removed
- System switches to first permanent tab if on removed tab
- No confirmation dialog (fast UX)

---

### US-5: Temporary Tabs Clear on Refresh
**As a** business analyst  
**I understand** that temporary tabs are session-only  
**So that** I know refreshing the page will clear them

**Acceptance Criteria:**
- Refreshing page clears all temporary tabs
- Only permanent tabs remain
- No localStorage persistence for temporary tabs
- Clear visual indicator that tabs are temporary

---

### US-6: Chat AI Decision Making
**As a** business analyst  
**I want** the chat AI to intelligently decide response mode  
**So that** I get the right type of response

**Acceptance Criteria:**
- "What does this chart mean?" → CHAT (text response)
- "Why did revenue drop?" → CHAT (text response with search)
- "Compare with competitors" → TEMPORARY_TAB (new tab)
- "Deep dive into revenue" → TEMPORARY_TAB (new tab)
- "Analyze Microsoft instead" → REFRESH (full regeneration)

---

## 3. Functional Requirements

### FR-1: Temporary Tab Data Structure
**Priority**: P0 (Critical)

The system shall extend the Tab interface to include:
- `isTemporary?: boolean` flag

Temporary tabs shall be stored in the same `dashboard.tabs[]` array as permanent tabs.

---

### FR-2: Chat AI Response Modes
**Priority**: P0 (Critical)

The chat AI shall support three response modes:
1. **CHAT**: Text-only response (no dashboard changes)
2. **REFRESH**: Regenerate entire dashboard (5 permanent tabs)
3. **TEMPORARY_TAB**: Create new temporary tab (15-25 modules)

---

### FR-3: Temporary Tab Generation
**Priority**: P0 (Critical)

When the chat AI responds with TEMPORARY_TAB action, it shall provide:
- Tab object with: id, label, isTemporary: true
- Array of 15-25 modules (5x5 grid)
- All modules with `tab` field set to new tab's id

---

### FR-4: Temporary Tab Addition
**Priority**: P0 (Critical)

The system shall add temporary tabs by:
- Appending tab to `dashboard.tabs[]`
- Appending modules to `dashboard.modules[]`
- Switching to the new tab
- Persisting to localStorage (will be filtered on restore)

---

### FR-5: Temporary Tab Removal
**Priority**: P0 (Critical)

The system shall remove temporary tabs by:
- Removing tab from `dashboard.tabs[]`
- Removing all modules with matching `tab` field
- Switching to first permanent tab if on removed tab
- Updating localStorage

---

### FR-6: Temporary Tab Visual Indicator
**Priority**: P1 (High)

Temporary tabs shall have:
- Colored dot indicator (brand color)
- Close button (X) on hover
- Extra padding for close button

---

### FR-7: Temporary Tab Filtering on Restore
**Priority**: P0 (Critical)

When restoring from localStorage, the system shall:
- Filter out all tabs with `isTemporary: true`
- Filter out all modules belonging to temporary tabs
- Only restore permanent tabs and their modules

---

### FR-8: Chat Context for Temporary Tabs
**Priority**: P1 (High)

When user is on a temporary tab, the chat context shall:
- Include temporary tab's modules in `visible_modules`
- Set `active_tab` to temporary tab's id
- Treat temporary tabs same as permanent tabs for context

---

## 4. Non-Functional Requirements

### NFR-1: Performance
**Priority**: P0 (Critical)

- Adding temporary tab shall be instant (<100ms)
- Removing temporary tab shall be instant (<50ms)
- No performance degradation with 5+ temporary tabs
- Module rendering shall be same speed as permanent tabs

---

### NFR-2: Usability
**Priority**: P1 (High)

- Temporary tab indicator shall be clear and intuitive
- Close button shall be discoverable
- No confusion between permanent and temporary tabs
- Fast UX (no confirmation dialogs)

---

### NFR-3: Reliability
**Priority**: P0 (Critical)

- Temporary tab addition shall never corrupt dashboard state
- Temporary tab removal shall never leave orphaned modules
- localStorage restore shall always filter temporary tabs
- No race conditions in state updates

---

### NFR-4: Scalability
**Priority**: P2 (Medium)

- System shall handle up to 10 temporary tabs without issues
- Memory usage shall be reasonable
- Optional: Automatic cleanup if too many tabs

---

## 5. Technical Constraints

### TC-1: Browser Compatibility
- Must work in Chrome, Firefox, Safari, Edge (latest 2 versions)
- React 18+ required
- localStorage available

### TC-2: Backend Compatibility
- n8n workflow must support TEMPORARY_TAB action
- Gemini API must generate valid module structures
- No breaking changes to existing /chat endpoint

### TC-3: Module Generation
- Chat AI must generate 15-25 modules per temporary tab
- All modules must follow existing module type schemas
- All modules must have valid sizing (1x1, 2x2, 3x3, etc.)

---

## 6. Dependencies

### External Dependencies
- React 18+
- Next.js 14+
- n8n (self-hosted)
- Gemini API

### Internal Dependencies
- Existing dashboard rendering system
- Chat system
- Module grid layout
- useDashboard hook
- Module types and schemas

---

## 7. Assumptions

1. Chat AI can generate valid module structures
2. Users will create 1-3 temporary tabs per session on average
3. Temporary tabs will have 15-25 modules (5x5 grid)
4. Users understand temporary tabs clear on refresh
5. No need for persistence in v1

---

## 8. Out of Scope

The following are explicitly out of scope for v1:

- ❌ Persistence of temporary tabs across page refreshes
- ❌ Renaming temporary tabs
- ❌ Converting temporary tabs to permanent
- ❌ Drag-and-drop tab reordering
- ❌ Tab groups/categories
- ❌ Tab search/filter
- ❌ Export temporary tab data
- ❌ Multiple dashboards (this is about tabs within ONE dashboard)

These may be considered for future versions if users request them.

---

## 9. Acceptance Testing Scenarios

### Scenario 1: Basic Temporary Tab Flow
1. User generates main dashboard for "Apple Inc"
2. User asks "Compare Apple with Samsung"
3. Chat AI responds with TEMPORARY_TAB action
4. New tab "Competitor Comparison" appears in tab bar
5. Tab has colored dot indicator
6. Tab contains 15-25 modules
7. User can switch between tabs
8. User clicks close button on temporary tab
9. Tab is removed
10. User refreshes page
11. Temporary tab is gone

**Expected Result**: ✅ All steps complete successfully

---

### Scenario 2: Multiple Temporary Tabs
1. User has main dashboard for "Apple Inc"
2. User asks "Compare with competitors"
3. Temporary tab "Competitor Comparison" is created
4. User asks "Deep dive into revenue model"
5. Temporary tab "Revenue Deep Dive" is created
6. User has 7 tabs total (5 permanent + 2 temporary)
7. User can switch between all tabs
8. User closes one temporary tab
9. Other tabs remain

**Expected Result**: ✅ All temporary tabs work independently

---

### Scenario 3: Chat AI Decision Making
1. User asks "What does this chart mean?" → CHAT response
2. User asks "Why did revenue drop?" → CHAT response
3. User asks "Compare with Samsung" → TEMPORARY_TAB created
4. User asks "Analyze Microsoft instead" → REFRESH (full regeneration)

**Expected Result**: ✅ Chat AI makes correct decisions

---

## 10. Open Questions

1. **Q**: Should we limit the number of temporary tabs?  
   **A**: Optional - could add max limit (e.g., 5) with warning

2. **Q**: Should we show a confirmation before removing a temporary tab?  
   **A**: No - keep UX fast, tabs can be regenerated

3. **Q**: Should we add keyboard shortcuts for switching tabs?  
   **A**: Nice to have - Cmd+1, Cmd+2, etc. Not critical for v1

4. **Q**: How do we handle invalid module generation from AI?  
   **A**: Add frontend validation, fallback to CHAT with error message

---

## 11. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| AI generates invalid modules | High | Medium | Add frontend validation, fallback to CHAT |
| Too many temporary tabs clutter UI | Medium | Low | Add max limit (5 tabs) |
| User confusion about temporary nature | Medium | Medium | Clear visual indicator + tooltip |
| Performance with many tabs | Low | Low | Lazy rendering if needed |
| Chat context becomes too large | Medium | Low | Limit context to active tab only |

---

## 12. Success Metrics

### Quantitative Metrics
- **Temporary Tab Usage**: 30%+ of chat sessions create at least one temporary tab
- **Tab Switching**: Average 3-5 tab switches per session
- **Generation Accuracy**: 90%+ of TEMPORARY_TAB actions generate valid modules
- **Performance**: <100ms to add temporary tab, <50ms to remove

### Qualitative Metrics
- User feedback on temporary tabs feature
- Reduction in "regenerate everything" requests
- Increased analytical depth per session
- Improved user satisfaction with focused analysis

---

**End of Requirements Document**
