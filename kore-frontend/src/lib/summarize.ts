import { DashboardPayload, CompactState } from './types'

/**
 * Produces a compact ~2KB summary of the dashboard suitable for
 * sending as chat context. Pure function — no AI, no API calls.
 */
export function summarizeDashboard(dashboard: DashboardPayload): CompactState {
  const { meta, tabs, modules } = dashboard

  // Build a map of tab id → { label, modules[] }
  const byTab: Record<string, { label: string; modules: CompactState['tabs'][0]['modules'] }> = {}
  for (const tab of tabs) {
    byTab[tab.id] = { label: tab.label, modules: [] }
  }

  for (const mod of modules) {
    if (!mod.tab || !byTab[mod.tab]) continue

    const entry: CompactState['tabs'][0]['modules'][0] = {
      id: mod.id,
      type: mod.type,
      size: mod.size,
      title: mod.data?.title ?? null,
      accent: mod.accent,
      value: null,
    }

    // Pull the single most meaningful value per module type
    if (mod.data?.value !== undefined) {
      entry.value = mod.data.value
    } else if (mod.data?.kpis) {
      entry.value = (mod.data.kpis as Array<{ title: string; value: unknown }>)
        .map(k => `${k.title}:${k.value}`).join(', ')
    } else if (mod.data?.segments) {
      entry.value = (mod.data.segments as Array<{ label: string; value: unknown }>)
        .map(s => `${s.label}:${s.value}`).join(', ')
    } else if (mod.data?.metrics) {
      entry.value = (mod.data.metrics as Array<{ label: string; value: unknown }>)
        .map(m => `${m.label}:${m.value}`).join(', ')
    } else if (mod.data?.series) {
      entry.value = `series[${(mod.data.series as unknown[]).length}pts]`
    } else if (mod.data?.rows) {
      entry.value = `table[${(mod.data.rows as unknown[]).length}rows]`
    }

    byTab[mod.tab].modules.push(entry)
  }

  return {
    subject: meta.subject,
    mode: meta.mode,
    tabs: Object.entries(byTab).map(([id, t]) => ({
      id,
      label: t.label,
      module_count: t.modules.length,
      modules: t.modules,
    })),
  }
}
