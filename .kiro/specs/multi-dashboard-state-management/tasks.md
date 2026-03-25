# Temporary Tabs System
## Implementation Tasks

**Feature**: Temporary tabs within a single dashboard  
**Version**: 3.0 (Corrected)  
**Date**: 2025-01-24

---

## Overview

This implementation plan adds temporary tabs to the existing dashboard tab bar. The chat AI can create NEW tabs that appear alongside permanent tabs (Overview, Financials, Market, Business Model, Competitors). These temporary tabs contain modules in a 5x5 grid and clear on page refresh.

---

## Tasks

- [x] 1. Extend type definitions in `src/lib/types.ts`
  - Add `isTemporary?: boolean` flag to Tab interface
  - Extend ChatResponse to include TEMPORARY_TAB action type
  - Add `tab?: { id: string, label: string, isTemporary: true }` field to ChatResponse
  - Add `modules?: Module[]` field to ChatResponse for temporary tab modules
  - _Requirements: FR-1, FR-2, FR-3_

- [x] 2. Extend useDashboard hook for temporary tabs
  - [x] 2.1 Implement `addTemporaryTab(tab: Tab, modules: Module[])` function
    - Append tab to dashboard.tabs array
    - Append modules to dashboard.modules array
    - Update dashboardState with summarizeDashboard()
    - Set activeTab to new tab's id
    - Persist to localStorage
    - _Requirements: FR-4_
  
  - [x] 2.2 Implement `removeTemporaryTab(tabId: string)` function
    - Remove tab from dashboard.tabs array
    - Remove all modules with matching tab field from dashboard.modules array
    - Update dashboardState with summarizeDashboard()
    - Switch to first permanent tab if on removed tab
    - Persist to localStorage
    - _Requirements: FR-5_
  
  - [x] 2.3 Modify `sendChat()` to handle TEMPORARY_TAB action
    - Check for `action === 'TEMPORARY_TAB'` in chat response
    - Extract tab and modules from response
    - Add assistant message: "Created temporary tab: [label]"
    - Call addTemporaryTab(tab, modules)
    - _Requirements: FR-3, FR-4_
  
  - [x] 2.4 Modify localStorage restore to filter temporary tabs
    - Filter out tabs with `isTemporary === true` from dashboard.tabs
    - Get set of permanent tab IDs
    - Filter out modules belonging to temporary tabs
    - Update dashboard with cleaned tabs and modules
    - _Requirements: FR-7_

- [x] 3. Update Topbar component for temporary tab UI
  - [x] 3.1 Add `onRemoveTab?: (id: string) => void` prop to Topbar
    - _Requirements: FR-5_
  
  - [x] 3.2 Add temporary tab visual indicator
    - Render colored dot (6px circle) before label if `tab.isTemporary === true`
    - Use brandColor for dot color
    - Add 6px margin-right after dot
    - _Requirements: FR-6_
  
  - [x] 3.3 Add close button for temporary tabs
    - Render close button (×) if `tab.isTemporary === true` and `onRemoveTab` exists
    - Position absolutely at right: 6px
    - Size: 16x16px, border-radius: 4px
    - Show on hover with background transition
    - Call `onRemoveTab(tab.id)` on click with stopPropagation
    - Add extra padding-right (28px) to tab button for close button space
    - _Requirements: FR-5, FR-6_
  
  - [x] 3.4 Add hover effects for close button
    - Default: transparent background, muted color
    - Hover: border-hover background, primary color
    - Active tab: border background, muted color
    - _Requirements: FR-6, NFR-2_

- [x] 4. Wire up temporary tab removal in page.tsx
  - [x] 4.1 Import `removeTemporaryTab` from useDashboard hook
    - _Requirements: FR-5_
  
  - [x] 4.2 Pass `onRemoveTab={removeTemporaryTab}` to AppShell/Topbar
    - _Requirements: FR-5_

- [x] 5. Update chat system prompt for TEMPORARY_TAB action
  - [x] 5.1 Update `N8N_CHAT_SYSTEM_PROMPT.md` or equivalent
    - Add TEMPORARY_TAB action documentation
    - Add decision guide: when to use CHAT vs REFRESH vs TEMPORARY_TAB
    - Add JSON output format for TEMPORARY_TAB with tab and modules fields
    - Add critical rules: generate 15-25 modules, all modules must have tab field set
    - _Requirements: FR-2, FR-3_
  
  - [x] 5.2 Add examples for TEMPORARY_TAB triggers
    - "Compare [Company] with [Competitors]" → TEMPORARY_TAB
    - "Deep dive into [aspect]" → TEMPORARY_TAB
    - "Show me [focused analysis]" → TEMPORARY_TAB
    - _Requirements: FR-2_
  
  - [x] 5.3 Paste updated prompt into n8n Chat node
    - Test with sample inputs
    - _Requirements: FR-3_

- [x] 6. Test temporary tab addition flow
  - Generate main dashboard for a company
  - Ask "Compare [Company] with competitors" in chat
  - Verify TEMPORARY_TAB action triggers
  - Verify new tab appears in tab bar with colored dot
  - Verify tab contains 15-25 modules
  - Verify automatic switch to new tab
  - Verify permanent tabs are preserved
  - _Requirements: US-2, FR-4_

- [x] 7. Test temporary tab removal flow
  - Create one or more temporary tabs
  - Hover over temporary tab to see close button
  - Click close button
  - Verify tab is removed from tab bar
  - Verify modules are removed from grid
  - Verify switch to first permanent tab if on removed tab
  - _Requirements: US-4, FR-5_

- [x] 8. Test temporary tab filtering on page refresh
  - Create one or more temporary tabs
  - Refresh the page
  - Verify only permanent tabs remain
  - Verify temporary tabs and their modules are gone
  - _Requirements: US-5, FR-7_

- [x] 9. Test chat AI decision making
  - Test "What does this chart mean?" → CHAT response
  - Test "Why did revenue drop?" → CHAT response
  - Test "Compare with competitors" → TEMPORARY_TAB created
  - Test "Deep dive into revenue" → TEMPORARY_TAB created
  - Test "Analyze [Different Company] instead" → REFRESH (full regeneration)
  - _Requirements: US-6, FR-2_

- [x] 10. Test chat context with temporary tabs
  - Create temporary tab and switch to it
  - Send chat message
  - Verify chat context includes temporary tab's modules in visible_modules
  - Verify active_tab is set to temporary tab's id
  - _Requirements: FR-8_

- [x] 11. Test edge cases and error handling
  - Test with 5+ temporary tabs (verify no performance issues)
  - Test removing last temporary tab
  - Test switching tabs while temporary tab is loading
  - Test invalid module generation from AI (add frontend validation if needed)
  - _Requirements: NFR-1, NFR-3_

- [x] 12. Polish and accessibility
  - Add tooltip to temporary tab indicator explaining "Temporary (clears on refresh)"
  - Ensure keyboard navigation works for close button
  - Test on mobile viewport
  - Verify ARIA labels for accessibility
  - _Requirements: NFR-2_

- [x] 13. Final checkpoint
  - Ensure all tests pass
  - Verify all requirements are met
  - Ask user if questions arise

---

**Total Tasks**: 13 top-level tasks (with sub-tasks)  
**Estimated Timeline**: 1 week  
**Priority**: P0 (Critical for improved UX)

---

**Notes**:
- This is a MUCH simpler implementation than the original multi-dashboard approach
- We're extending the existing Tab interface, not creating a new dashboard array
- Temporary tabs appear in the SAME tab bar as permanent tabs
- No dropdown selector needed
- No complex dashboard switching logic needed
- Just add/remove tabs from existing dashboard.tabs[] array

---

**End of Tasks Document**
