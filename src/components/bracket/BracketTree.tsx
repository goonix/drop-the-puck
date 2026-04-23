import type { PlayoffSeries } from '../../types/bracket';
import { BracketTreeCard } from './BracketTreeCard';

// Layout constants (px)
const SLOT = 88; // height of one R1 slot
const TOTAL_H = SLOT * 4; // 352 — total bracket height
const COL_W = 160; // width of a series card column
const GAP_W = 36; // width of a connector SVG column
const STROKE = '#6b7280';

function sortedBy(arr: PlayoffSeries[]) {
  return [...arr].sort((a, b) => a.seriesLetter.localeCompare(b.seriesLetter));
}

// NHL assigns Eastern series letters before Western ones within each round (e.g. A-D East, E-H West).
// Splitting sorted letters in half is more reliable than parsing seriesTitle, which the API no longer
// includes conference names in (returns "1st Round" rather than "Eastern First Round").
function detectConf(s: PlayoffSeries, allSeries: PlayoffSeries[]): 'E' | 'W' | null {
  if (s.seriesAbbrev === 'SCF') return null;
  const roundSeries = sortedBy(allSeries.filter((x) => x.seriesAbbrev === s.seriesAbbrev));
  const idx = roundSeries.findIndex((x) => x.seriesLetter === s.seriesLetter);
  return idx < roundSeries.length / 2 ? 'E' : 'W';
}

function structureBracket(series: PlayoffSeries[]) {
  const by = (round: string, conf: 'E' | 'W' | null) =>
    sortedBy(series.filter((s) => s.seriesAbbrev === round && detectConf(s, series) === conf));
  return {
    westR1: by('R1', 'W'),
    westR2: by('R2', 'W'),
    westCF: by('CF', 'W'),
    scf: series.filter((s) => s.seriesAbbrev === 'SCF'),
    eastCF: by('CF', 'E'),
    eastR2: by('R2', 'E'),
    eastR1: by('R1', 'E'),
  };
}

// A column of series cards, each occupying `slotSpan` slots vertically
function SeriesColumn({ series, slotSpan }: { series: PlayoffSeries[]; slotSpan: number }) {
  const slotH = SLOT * slotSpan;
  return (
    <div style={{ width: COL_W, height: TOTAL_H, position: 'relative', flexShrink: 0 }}>
      {series.map((s, i) => (
        <div
          key={s.seriesLetter}
          style={{
            position: 'absolute',
            top: i * slotH,
            height: slotH,
            width: COL_W,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <BracketTreeCard series={s} />
        </div>
      ))}
    </div>
  );
}

type ConnType = 'w-r1r2' | 'w-r2cf' | 'w-cfscf' | 'e-r1r2' | 'e-r2cf' | 'e-cfscf';

// SVG connector drawn in the gap between two columns
function Connector({ type }: { type: ConnType }) {
  const isEast = type.startsWith('e-');
  // West: spine on left (x=0), arms go right. East: spine on right (x=GAP_W), arms go left.
  const spineX = isEast ? GAP_W : 0;
  const armEnd = isEast ? 0 : GAP_W;

  type Line = { x1: number; y1: number; x2: number; y2: number };
  let lines: Line[] = [];

  if (type === 'w-r1r2' || type === 'e-r1r2') {
    // Two bracket forks: R1[0+1]→R2[0], R1[2+3]→R2[1]
    lines = [
      { x1: spineX, y1: SLOT * 0.5, x2: spineX, y2: SLOT * 1.5 },
      { x1: spineX, y1: SLOT * 1.0, x2: armEnd, y2: SLOT * 1.0 },
      { x1: spineX, y1: SLOT * 2.5, x2: spineX, y2: SLOT * 3.5 },
      { x1: spineX, y1: SLOT * 3.0, x2: armEnd, y2: SLOT * 3.0 },
    ];
  } else if (type === 'w-r2cf' || type === 'e-r2cf') {
    // R2[0] + R2[1] → CF[0]
    lines = [
      { x1: spineX, y1: SLOT * 1.0, x2: spineX, y2: SLOT * 3.0 },
      { x1: spineX, y1: SLOT * 2.0, x2: armEnd, y2: SLOT * 2.0 },
    ];
  } else {
    // CF → SCF: single horizontal at vertical center
    lines = [{ x1: 0, y1: SLOT * 2.0, x2: GAP_W, y2: SLOT * 2.0 }];
  }

  return (
    <svg width={GAP_W} height={TOTAL_H} style={{ flexShrink: 0, display: 'block' }}>
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={STROKE} strokeWidth={1} />
      ))}
    </svg>
  );
}

// Column header labels
function ColumnHeaders() {
  const col = (label: string, w: number, muted = false) => (
    <div
      key={label + w}
      style={{ width: w, flexShrink: 0 }}
      className={`text-center text-xs font-semibold uppercase tracking-wider truncate ${muted ? 'invisible' : 'text-gray-500 dark:text-gray-400'}`}
    >
      {label}
    </div>
  );

  return (
    <div className="flex mb-3">
      {col('1st Round', COL_W)}
      {col('', GAP_W, true)}
      {col('2nd Round', COL_W)}
      {col('', GAP_W, true)}
      {col('Conf. Finals', COL_W)}
      {col('', GAP_W, true)}
      {col('Stanley Cup Final', COL_W)}
      {col('', GAP_W, true)}
      {col('Conf. Finals', COL_W)}
      {col('', GAP_W, true)}
      {col('2nd Round', COL_W)}
      {col('', GAP_W, true)}
      {col('1st Round', COL_W)}
    </div>
  );
}

// Conference banners spanning columns
function ConferenceBanners() {
  const confW = COL_W * 3 + GAP_W * 2;
  const scfW = COL_W;
  const gap = GAP_W;

  return (
    <div className="flex mb-1">
      <div
        style={{ width: confW }}
        className="text-center text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest"
      >
        Western Conference
      </div>
      <div style={{ width: gap }} />
      <div style={{ width: scfW }} />
      <div style={{ width: gap }} />
      <div
        style={{ width: confW }}
        className="text-center text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest"
      >
        Eastern Conference
      </div>
    </div>
  );
}

interface Props {
  series: PlayoffSeries[];
}

export function BracketTree({ series }: Props) {
  const b = structureBracket(series);

  // If no data is structured yet, show a placeholder
  const hasData = b.westR1.length > 0 || b.eastR1.length > 0;

  if (!hasData) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400 dark:text-gray-600 text-sm">
        Bracket data unavailable
      </div>
    );
  }

  return (
    <div>
      <ConferenceBanners />
      <ColumnHeaders />
      <div className="flex" style={{ height: TOTAL_H }}>
        <SeriesColumn series={b.westR1} slotSpan={1} />
        <Connector type="w-r1r2" />
        <SeriesColumn series={b.westR2} slotSpan={2} />
        <Connector type="w-r2cf" />
        <SeriesColumn series={b.westCF} slotSpan={4} />
        <Connector type="w-cfscf" />
        <SeriesColumn series={b.scf} slotSpan={4} />
        <Connector type="e-cfscf" />
        <SeriesColumn series={b.eastCF} slotSpan={4} />
        <Connector type="e-r2cf" />
        <SeriesColumn series={b.eastR2} slotSpan={2} />
        <Connector type="e-r1r2" />
        <SeriesColumn series={b.eastR1} slotSpan={1} />
      </div>
    </div>
  );
}
