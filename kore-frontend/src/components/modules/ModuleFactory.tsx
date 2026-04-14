import { Module } from '@/lib/types'
import KpiModule    from '@/components/modules/types/KpiModule'
import ChartModule  from '@/components/modules/types/ChartModule'
import GaugeModule  from '@/components/modules/types/GaugeModule'
import DualKpiModule from '@/components/modules/types/DualKpiModule'
import TableModule  from '@/components/modules/types/TableModule'
import FeedModule   from '@/components/modules/types/FeedModule'
import BmcModule    from '@/components/modules/types/BmcModule'
import LeanCanvasModule from '@/components/modules/types/LeanCanvasModule'
import SwotModule   from '@/components/modules/types/SwotModule'
import TamSamSomModule from '@/components/modules/types/TamSamSomModule'
import CompetitiveMatrixModule from '@/components/modules/types/CompetitiveMatrixModule'
import GtmStrategyModule from '@/components/modules/types/GtmStrategyModule'
import DecoModule   from '@/components/modules/types/DecoModule'
import FreeformModule from '@/components/modules/types/FreeformModule'

export default function ModuleFactory({ module }: { module: Module }) {
  const [category, variant] = module.type.split('.')

  switch (category) {
    case 'kpi':
    case 'metric':
      if (variant === 'dual') return <DualKpiModule module={module} />
      return <KpiModule module={module} />
    case 'chart':
      return <ChartModule module={module} variant={variant} />
    case 'gauge':
      return <GaugeModule module={module} />
    case 'table':
      return <TableModule module={module} />
    case 'feed':
      return <FeedModule module={module} />
    case 'canvas':
      if (variant === 'bmc') return <BmcModule module={module} />
      if (variant === 'lean') return <LeanCanvasModule module={module} />
      return <PlaceholderModule type={module.type} />
    case 'market':
      if (variant === 'tamsamsom') return <TamSamSomModule module={module} />
      return <PlaceholderModule type={module.type} />
    case 'matrix':
      if (variant === 'swot') return <SwotModule module={module} />
      if (variant === 'competitive') return <CompetitiveMatrixModule module={module} />
      return <PlaceholderModule type={module.type} />
    case 'strategy':
      if (variant === 'gtm') return <GtmStrategyModule module={module} />
      return <PlaceholderModule type={module.type} />
    case 'deco':
      return <DecoModule module={module} variant={variant} />
    case 'freeform':
      return <FreeformModule module={module} />
    default:
      return <PlaceholderModule type={module.type} />
  }
}

function PlaceholderModule({ type }: { type: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ fontSize: 10, color: 'var(--t-hint)', fontFamily: 'monospace' }}>{type}</div>
      <div style={{ fontSize: 10, color: 'var(--t-hint)' }}>Module type not yet implemented</div>
    </div>
  )
}
