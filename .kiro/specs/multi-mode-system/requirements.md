# Multi-Mode Analysis System - Requirements

## Executive Summary

Transform KORE from a single-mode analyzer into a multi-mode intelligence platform with three distinct analysis modes, each with specialized modules and prompts. Additionally, implement a card-based chat interface for progressive information disclosure.

---

## Current State Analysis

### What We Have Now
1. **Single Mode System**
   - One `generate.md` prompt for all analysis types
   - One `chat.md` prompt for all conversations
   - Generic modules (charts, tables, KPIs, etc.)
   - 5x5 grid system
   - Long-form chat responses (800-1500 words)

2. **Existing Modules (18 types)**
   - Charts: bar, line, area, hbar, grouped, pie, donut, radar, waterfall
   - Metrics: metric.kpi, metric.dual, gauge
   - Data: table, feed
   - Decorative: deco.stats, deco.timeline
   - Special: canvas.bmc, freeform

3. **Architecture**
   - Frontend: Next.js (React)
   - Backend: FastAPI (Python)
   - Prompts: Markdown files loaded at runtime
   - Module system: Component-based with ModuleFactory

---

## Business Requirements

### BR-1: Three Analysis Modes

**Mode 1: General Analysis**
- Purpose: Analyze any company, market, or topic
- Use case: "Analyze Apple's business strategy"
- Modules: All existing modules
- Focus: Comprehensive business intelligence

**Mode 2: Startup Analysis**
- Purpose: Analyze startup ideas and early-stage companies
- Use case: "Food delivery startup in India with ₹50L budget"
- Modules: Existing + new startup-specific modules
- Focus: Validation, feasibility, go-to-market

**Mode 3: Company Analysis**
- Purpose: Deep-dive into established companies
- Use case: "Deep dive into Netflix's competitive position"
- Modules: Existing + company-specific modules
- Focus: Financial performance, competitive analysis, strategic positioning

### BR-2: Mode-Specific Prompts

Each mode needs:
1. **Base Rules Prompt** (shared across all modes)
   - 5x5 grid rules
   - JSON structure
   - Data scale rules
   - Common module types

2. **Mode-Specific Prompt** (unique per mode)
   - Mode-specific modules
   - Analysis frameworks
   - Output structure
   - Thinking process

3. **Chat Prompt** (mode-aware)
   - Mode-specific response format
   - Relevant frameworks
   - Card-based output structure

### BR-3: New Startup-Specific Modules

**Required Modules:**
1. `canvas.lean` - Lean Canvas (9 blocks)
2. `canvas.swot` - SWOT Analysis (4 quadrants)
3. `canvas.pestel` - PESTEL Analysis (6 factors)
4. `canvas.porter` - Porter's Five Forces (5 forces)
5. `canvas.vrio` - VRIO Framework (4 criteria)
6. `startup.validation` - Idea validation scorecard
7. `startup.runway` - Burn rate & runway calculator
8. `startup.tam` - TAM/SAM/SOM market sizing
9. `startup.unit_economics` - Unit economics breakdown
10. `startup.milestones` - Startup milestone tracker

### BR-4: Card-Based Chat Interface

**Requirements:**
1. **Summary Section** (always visible)
   - 3-4 sentences
   - Key metrics inline
   - No scrolling needed

2. **Card Grid** (interactive)
   - 2-4 cards per response
   - Each card = one topic
   - Click to expand full content
   - Visual icons/indicators

3. **Card Structure**
   - Title
   - Summary (2-3 sentences)
   - Icon/visual indicator
   - "Read more" interaction
   - Expanded content (full analysis)

4. **Progressive Disclosure**
   - Show summary first
   - Details on demand
   - Reduce initial scroll length
   - Maintain full information access

---

## Functional Requirements

### FR-1: Mode Selection

**User Flow:**
1. User enters prompt
2. System detects mode from prompt OR user selects mode
3. System loads appropriate prompts
4. System generates dashboard with mode-specific modules

**Mode Detection Logic:**
```
Keywords for Startup Mode:
- "startup", "startup idea", "new business", "launch", "founder"
- "seed funding", "MVP", "product-market fit"
- Budget indicators: "₹50L", "$100k", "limited budget"

Keywords for Company Mode:
- "company analysis", "deep dive", "competitive analysis"
- Established company names (Apple, Google, Netflix, etc.)
- "market leader", "incumbent", "publicly traded"

Default: General Analysis
```

### FR-2: Prompt Architecture

**File Structure:**
```
fastapi-backend/prompts/
├── base/
│   ├── grid_rules.md          # 5x5 grid rules (shared)
│   ├── data_rules.md          # Data scale rules (shared)
│   └── common_modules.md      # Common module types (shared)
├── modes/
│   ├── general/
│   │   ├── generate.md        # General analysis generation
│   │   ├── chat.md            # General chat responses
│   │   └── modules.md         # Mode-specific modules
│   ├── startup/
│   │   ├── generate.md        # Startup analysis generation
│   │   ├── chat.md            # Startup chat responses
│   │   └── modules.md         # Startup-specific modules
│   └── company/
│       ├── generate.md        # Company analysis generation
│       ├── chat.md            # Company chat responses
│       └── modules.md         # Company-specific modules
└── templates/
    └── card_format.md         # Card-based response template
```

**Prompt Composition:**
```
Final Prompt = base/grid_rules.md 
             + base/data_rules.md 
             + base/common_modules.md 
             + modes/{mode}/modules.md 
             + modes/{mode}/generate.md
```

### FR-3: New Module Components

**Frontend Components Needed:**
```
kore-frontend/src/components/modules/types/
├── LeanCanvasModule.tsx       # Lean Canvas (9 blocks)
├── SwotModule.tsx             # SWOT Analysis (4 quadrants)
├── PestelModule.tsx           # PESTEL Analysis (6 factors)
├── PorterModule.tsx           # Porter's Five Forces
├── VrioModule.tsx             # VRIO Framework
├── ValidationModule.tsx       # Validation scorecard
├── RunwayModule.tsx           # Burn rate calculator
├── TamModule.tsx              # Market sizing (TAM/SAM/SOM)
├── UnitEconomicsModule.tsx    # Unit economics
└── MilestonesModule.tsx       # Milestone tracker
```

### FR-4: Card-Based Chat Response

**Response Structure:**
```json
{
  "action": "CHAT",
  "message": {
    "summary": "3-4 sentence executive summary",
    "metrics": [
      {"label": "Revenue", "value": "$383B", "change": "+6.7%"}
    ],
    "cards": [
      {
        "id": "financial-performance",
        "title": "Financial Performance",
        "icon": "💰",
        "summary": "2-3 sentence summary",
        "content": "Full markdown content with tables, charts, etc."
      },
      {
        "id": "strategic-position",
        "title": "Strategic Position",
        "icon": "🎯",
        "summary": "2-3 sentence summary",
        "content": "Full markdown content"
      }
    ]
  }
}
```

**Frontend Implementation:**
- New `ChatCard` component
- Expandable/collapsible cards
- Grid layout (2 columns on desktop, 1 on mobile)
- Smooth animations

---

## Non-Functional Requirements

### NFR-1: Performance
- Mode detection: < 100ms
- Prompt loading: < 200ms
- No impact on generation time
- Card expansion: < 50ms animation

### NFR-2: Maintainability
- Shared base rules (DRY principle)
- Mode-specific prompts isolated
- Easy to add new modes
- Clear separation of concerns

### NFR-3: Backward Compatibility
- Existing dashboards still work
- Default to General mode if unclear
- No breaking changes to API
- Gradual migration path

### NFR-4: Extensibility
- Easy to add new modes
- Easy to add new modules per mode
- Plugin-like architecture
- Configuration-driven

---

## User Stories

### US-1: Startup Founder
**As a** startup founder  
**I want to** analyze my startup idea with startup-specific frameworks  
**So that** I can validate feasibility and plan my go-to-market

**Acceptance Criteria:**
- System detects "startup" mode from my prompt
- Dashboard includes Lean Canvas, SWOT, market sizing
- Chat provides startup-specific advice
- Modules show validation scores and runway calculations

### US-2: Business Analyst
**As a** business analyst  
**I want to** deep-dive into established companies  
**So that** I can understand their competitive position

**Acceptance Criteria:**
- System detects "company" mode from my prompt
- Dashboard includes financial analysis, competitive positioning
- Chat provides detailed strategic analysis
- Modules show Porter's Five Forces, VRIO analysis

### US-3: General User
**As a** general user  
**I want to** analyze any topic without mode-specific constraints  
**So that** I can get flexible, comprehensive analysis

**Acceptance Criteria:**
- System defaults to "general" mode
- Dashboard uses standard modules
- Chat provides balanced analysis
- Works for any topic (markets, products, trends)

### US-4: Information Consumer
**As a** user reading chat responses  
**I want to** see a summary first and expand details on demand  
**So that** I can quickly scan and dive deep only where interested

**Acceptance Criteria:**
- Chat shows 3-4 sentence summary
- Key metrics visible inline
- Cards show topic summaries
- Clicking card expands full content
- Total visible content < 500 words initially

---

## Technical Constraints

### TC-1: Module Grid Compatibility
- All new modules MUST work with 5x5 grid
- Valid sizes only (1x1 to 5x5)
- Total cells per tab = 25
- Row-by-row flow maintained

### TC-2: Data Structure Consistency
- All modules follow same data pattern: `{type, size, accent, data}`
- JSON serializable
- Validated on backend
- Type-safe on frontend

### TC-3: Prompt Size Limits
- Individual prompt files < 500 lines
- Combined prompt < 2000 lines
- Efficient composition
- No redundancy

### TC-4: Frontend Component Standards
- TypeScript strict mode
- Props interface defined
- Responsive design
- Accessible (WCAG AA)

---

## Success Criteria

### SC-1: Mode System
- ✅ Three modes implemented and working
- ✅ Mode detection accuracy > 90%
- ✅ Each mode has unique modules
- ✅ Prompts properly composed

### SC-2: Startup Modules
- ✅ All 10 startup modules implemented
- ✅ Modules render correctly in grid
- ✅ Data structures documented
- ✅ Examples in prompts

### SC-3: Card-Based Chat
- ✅ Summary always visible
- ✅ Cards expandable/collapsible
- ✅ Initial content < 500 words
- ✅ Full content accessible

### SC-4: Quality
- ✅ No breaking changes
- ✅ All existing features work
- ✅ Tests pass
- ✅ Documentation updated

---

## Out of Scope (Future Phases)

1. User-selectable mode (auto-detection only for now)
2. Custom mode creation
3. Mode-specific color themes
4. Advanced card interactions (drag, reorder)
5. Card sharing/export
6. Mode switching mid-session
7. Hybrid modes (combining multiple modes)

---

## Dependencies

### External Dependencies
- None (all internal changes)

### Internal Dependencies
- Existing module system
- Prompt loading system
- Dashboard generation pipeline
- Chat response system

---

## Risks & Mitigation

### Risk 1: Prompt Complexity
**Risk:** Combined prompts become too large for AI context  
**Mitigation:** Modular composition, shared base rules, efficient formatting  
**Severity:** Medium

### Risk 2: Mode Detection Accuracy
**Risk:** System picks wrong mode for ambiguous prompts  
**Mitigation:** Clear keyword patterns, default to General mode, user feedback loop  
**Severity:** Low

### Risk 3: Module Development Time
**Risk:** 10 new modules take longer than expected  
**Mitigation:** Prioritize core modules (Lean Canvas, SWOT), iterate on others  
**Severity:** Medium

### Risk 4: Card UI Complexity
**Risk:** Card-based interface confuses users  
**Mitigation:** Clear visual design, smooth animations, user testing  
**Severity:** Low

---

## Next Steps

1. **Review & Approve** - Stakeholder review of requirements
2. **Design Phase** - Create detailed designs for new modules
3. **Task Breakdown** - Break into implementable tasks
4. **Implementation** - Execute in phases
5. **Testing** - Validate each mode and module
6. **Documentation** - Update all docs
7. **Deployment** - Gradual rollout

---

## Questions for Clarification

1. Should users be able to manually select mode, or auto-detection only?
2. Priority order for the 10 startup modules?
3. Should existing dashboards be migrated to new system?
4. Card design preferences (visual style, animations)?
5. Should modes have different color schemes?
6. Analytics/tracking for mode usage?
