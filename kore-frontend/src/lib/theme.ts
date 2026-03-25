// ─── Mutable Theme Registry ─────────────────────────────────────────────────
// This is the SINGLE SOURCE OF TRUTH for all accent colors in the application.
// When a new JSON payload arrives (from AI or dummyData), AppShell calls
// setTheme({ primary, secondary, tertiary, quaternary }) which instantly
// updates all modules on the next render cycle — no hardcoding needed.

let _theme = {
  primary:    '#5865F2',   // Discord Blurple (default fallback)
  secondary:  '#EB459E',   // Fuchsia
  tertiary:   '#FEE75C',   // Yellow
  quaternary: '#57F287',   // Green
}

let _lightTheme = {
  primary:    '#EEF0FD',
  secondary:  '#FDECF5',
  tertiary:   '#FFFDCF',
  quaternary: '#EEFDF2',
}

export type ThemeAccent = 'primary' | 'secondary' | 'tertiary' | 'quaternary'

/** Called by AppShell as soon as the payload is loaded */
export function setTheme(colors: {
  primary: string
  secondary: string
  tertiary: string
  quaternary: string
}) {
  _theme = { ...colors }

  // Auto-compute light bg variants (10% opacity version of each color)
  function toLight(hex: string) {
    // Append 1A (10% alpha) to hex and return
    return hex + '1A'
  }
  _lightTheme = {
    primary:    toLight(colors.primary),
    secondary:  toLight(colors.secondary),
    tertiary:   toLight(colors.tertiary),
    quaternary: toLight(colors.quaternary),
  }
}

export function getTheme() {
  return _theme
}

// ─── Backwards-compatibility alias map ──────────────────────────────────────
// Module accents can be named 'primary'|'secondary'|'tertiary'|'quaternary'
// OR legacy names: 'brand','blue','purple','amber','green','teal'
// Both resolve correctly through getAccentColor.

const LEGACY_MAP: Record<string, ThemeAccent> = {
  brand:      'primary',
  blue:       'primary',
  purple:     'secondary',
  amber:      'tertiary',
  green:      'quaternary',
  teal:       'quaternary',
}

export function getAccentColor(accent?: string): string {
  if (!accent) return _theme.primary
  if (_theme[accent as ThemeAccent]) return _theme[accent as ThemeAccent]
  const mapped = LEGACY_MAP[accent]
  if (mapped) return _theme[mapped]
  return _theme.primary
}

export function getLightAccentColor(accent?: string): string {
  if (!accent) return _lightTheme.primary
  if (_lightTheme[accent as ThemeAccent]) return _lightTheme[accent as ThemeAccent]
  const mapped = LEGACY_MAP[accent]
  if (mapped) return _lightTheme[mapped]
  return _lightTheme.primary
}

// ─── Chart Palette ───────────────────────────────────────────────────────────
// For multi-series charts that need a full sequential color array.
// Always reads the live _theme so it refreshes dynamically.
export function getChartPalette(): string[] {
  return [
    _theme.primary,
    _theme.secondary,
    _theme.tertiary,
    _theme.quaternary,
    _theme.primary + 'AA',    // semi-transparent primary
    _theme.secondary + 'AA',  // semi-transparent secondary
    '#99AAB5',                // Neutral grey
    '#C0C0BC',                // Light neutral
  ]
}

// Legacy export kept for any direct imports
export const THEME = _theme
export const THEME_LIGHT = _lightTheme
export const CHART_PALETTE = getChartPalette()
