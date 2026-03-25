"""Dashboard-specific data models for module types."""

from pydantic import BaseModel
from typing import Any


# Chart Data Models

class ChartData(BaseModel):
    """Base chart data structure."""
    title: str
    subtitle: str | None = None


class SingleSeriesChartData(ChartData):
    """Data for single-series charts (bar, line, area, hbar)."""
    labels: list[str]
    series: list[float]


class MultiSeriesChartData(ChartData):
    """Data for multi-series charts (grouped)."""
    labels: list[str]
    series_list: list[dict[str, Any]]  # [{name: str, values: list[float]}]


class PieChartSegment(BaseModel):
    """Segment for pie/donut charts."""
    label: str
    value: float
    color_key: str


class PieChartData(ChartData):
    """Data for pie/donut charts."""
    segments: list[PieChartSegment]


# KPI Data Models

class KPIData(BaseModel):
    """Data for single KPI module."""
    title: str
    value: str | float
    delta: str | None = None
    direction: str | None = None  # "up", "down", "neutral"
    sparkline: list[float] | None = None


class DualKPIData(BaseModel):
    """Data for dual KPI module."""
    title: str
    kpis: list[KPIData]  # Must have exactly 2 items


# Table Data Models

class TableColumn(BaseModel):
    """Table column definition."""
    key: str
    label: str
    sortable: bool = False
    type: str | None = None  # "delta_badge", "currency", "percent"


class TableData(BaseModel):
    """Data for table module."""
    title: str
    subtitle: str | None = None
    columns: list[TableColumn]
    rows: list[dict[str, Any]]  # Keys must match column keys


# Feed Data Models

class FeedData(BaseModel):
    """Data for feed module (same structure as table)."""
    title: str
    subtitle: str | None = None
    columns: list[TableColumn]
    rows: list[dict[str, Any]]


# Freeform Data Models

class FreeformData(BaseModel):
    """Data for freeform module."""
    html: str


# Decorative Data Models

class StatsMetric(BaseModel):
    """Single metric for stats bar."""
    label: str
    value: str | float


class StatsData(BaseModel):
    """Data for stats decorative module."""
    title: str
    metrics: list[StatsMetric]
