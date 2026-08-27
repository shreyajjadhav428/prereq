import { useState, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';

// ─── LAYOUT CONSTANTS ────────────────────────────────────────────────────────
const W = 2200;      // SVG viewBox width
const NW = 300;      // default node width
const NH = 96;       // default node height
const GAP_Y = 120;   // vertical gap between zone rows

// ─── ZONE Y POSITIONS ────────────────────────────────────────────────────────
const ZY = {
  found:   40,
  mech1:  260,
  mech2:  400,
  mech3:  540,
  mech4:  680,
  mech5:  820,
  mech6:  960,
  wave1: 1100,
  wave2: 1240,
  mod1:  1380,
  mod2:  1520,
  therm1:1660,
  therm2:1800,
};

// Helper to center-place a node given center-x
const X_OFFSET = 80;
const nx = (cx) => cx - NW / 2 + X_OFFSET;

// ─── GRAPH DATA ───────────────────────────────────────────────────────────────
// x/y = top-left corner of node; w/h = dimensions
const GRAPH_DATA = [
  // ── FOUNDATION ROW: 6 nodes centered across W=2200, spacing=340, start=170 ────
  // Centers: 170, 510, 850, 1190(f4 hub), 1530, 1870. Span: 170..1990 → padded ✓
  { id: 'f1', title: 'Physical Quantities & Units', color: 'purple', x: nx(170),  y: ZY.found, w: NW, h: NH, prereqs: [] },
  { id: 'f2', title: 'Measurement & Errors',        color: 'purple', x: nx(510),  y: ZY.found, w: NW, h: NH, prereqs: ['f1'] },
  { id: 'f3', title: 'Vectors',                     color: 'purple', x: nx(850),  y: ZY.found, w: NW, h: NH, prereqs: ['f1'] },
  { id: 'f4', title: 'Mathematical Tools (Algebra, Trig, Calculus)', color: 'purple', x: nx(1190),y: ZY.found-16, w: 320, h: NH+32, prereqs: [] },
  { id: 'f5', title: 'Functions & Graphs',          color: 'purple', x: nx(1530), y: ZY.found, w: NW, h: NH, prereqs: ['f4'] },
  { id: 'f6', title: 'Differentiation',             color: 'purple', x: nx(1870), y: ZY.found, w: NW, h: NH, prereqs: ['f4'] },

  // ── MECHANICS ROW 1: 5 nodes, spacing=380, start=190 ────────────────────────
  // Centers: 190, 570, 950, 1330(thermal), 1710(em). Span: 190..1860 ✓
  { id: 'm1', title: 'Kinematics in One Dimension',  color: 'blue',  x: nx(190),  y: ZY.mech1, w: NW, h: NH, prereqs: ['f4', 'f6'] },
  { id: 'm2', title: 'Kinematics in Two Dimensions', color: 'blue',  x: nx(570),  y: ZY.mech1, w: NW, h: NH, prereqs: ['m1', 'f3'] },
  { id: 'm3', title: 'Laws of Motion',               color: 'blue',  x: nx(950),  y: ZY.mech1, w: NW, h: NH, prereqs: ['m2'] },
  { id: 't1', title: 'Thermal Expansion',            color: 'amber', x: nx(1330), y: ZY.mech1, w: NW, h: NH, prereqs: ['f4'] },
  { id: 'e1', title: 'Electric Charges & Fields',    color: 'rose',  x: nx(1710), y: ZY.mech1, w: NW, h: NH, prereqs: ['f5'] },

  // ── MECHANICS ROW 2: side node + 3 column nodes ──────────────────────────────
  { id: 'f7', title: 'Basic Mathematics for Physics', color: 'purple', x: nx(125),  y: ZY.mech2, w: 185, h: NH, prereqs: ['f4'] },
  { id: 'm4', title: 'Work, Energy & Power',           color: 'blue',  x: nx(700),  y: ZY.mech2, w: NW, h: NH, prereqs: ['m2', 'm3'] },
  { id: 't2', title: 'Calorimetry',                    color: 'amber', x: nx(1330), y: ZY.mech2, w: NW, h: NH, prereqs: ['t1'] },
  { id: 'e2', title: "Gauss's Law",                    color: 'rose',  x: nx(1710), y: ZY.mech2, w: NW, h: NH, prereqs: ['e1'] },

  // ── MECHANICS ROW 3 ──────────────────────────────────────────────────────────
  { id: 'm5', title: 'System of Particles & Rotational Motion', color: 'blue',  x: nx(700),  y: ZY.mech3, w: NW, h: NH, prereqs: ['m4'] },
  { id: 't3', title: 'Heat Transfer',                           color: 'amber', x: nx(1330), y: ZY.mech3, w: NW, h: NH, prereqs: ['t2'] },
  { id: 'e3', title: 'Electric Potential & Capacitance',        color: 'rose',  x: nx(1710), y: ZY.mech3, w: NW, h: NH, prereqs: ['e2'] },

  // ── MECHANICS ROW 4 ──────────────────────────────────────────────────────────
  { id: 'm6', title: 'Gravitation',              color: 'blue',  x: nx(700),  y: ZY.mech4, w: NW, h: NH, prereqs: ['m5'] },
  { id: 't4', title: 'Kinetic Theory of Gases', color: 'amber', x: nx(1330), y: ZY.mech4, w: NW, h: NH, prereqs: ['t3'] },
  { id: 'e4', title: 'Current Electricity',     color: 'rose',  x: nx(1710), y: ZY.mech4, w: NW, h: NH, prereqs: ['e3'] },

  // ── MECHANICS ROW 5 ──────────────────────────────────────────────────────────
  { id: 'm7', title: 'Properties of Solids & Liquids', color: 'blue',   x: nx(700),  y: ZY.mech5, w: NW, h: NH, prereqs: ['m3'] },
  { id: 't5', title: 'Thermodynamics (Laws)',           color: 'amber',  x: nx(1330), y: ZY.mech5, w: NW, h: NH, prereqs: ['t4'] },
  { id: 'e5', title: 'Magnetic Effects of Current',     color: 'rose',   x: nx(1710), y: ZY.mech5, w: NW, h: NH, prereqs: ['e4'] },
  { id: 'vc', title: 'Vector Calculus',                 color: 'purple', x: nx(2020), y: ZY.mech5, w: 180, h: NH, prereqs: ['f3', 'f6'] },

  // ── MECHANICS ROW 6 ──────────────────────────────────────────────────────────
  { id: 'm8', title: 'Mechanical Properties of Fluids', color: 'blue',  x: nx(700),  y: ZY.mech6, w: NW, h: NH, prereqs: ['m7'] },
  { id: 't6', title: 'Entropy',                         color: 'amber', x: nx(1330), y: ZY.mech6, w: NW, h: NH, prereqs: ['t5'] },
  { id: 'e6', title: 'Magnetism & Matter',               color: 'rose',  x: nx(1710), y: ZY.mech6, w: NW, h: NH, prereqs: ['e5'] },

  // ── WAVES ROW 1 ──────────────────────────────────────────────────────────────
  { id: 'm9', title: 'Oscillations',              color: 'blue', x: nx(700),  y: ZY.wave1, w: NW, h: NH, prereqs: ['m4', 'm8'] },
  { id: 'e7', title: 'Electromagnetic Induction', color: 'rose', x: nx(1710), y: ZY.wave1, w: NW, h: NH, prereqs: ['e6'] },

  // ── WAVES ROW 2 ──────────────────────────────────────────────────────────────
  { id: 'w1', title: 'Waves',               color: 'green', x: nx(700),  y: ZY.wave2, w: NW, h: NH, prereqs: ['m9'] },
  { id: 'e8', title: 'Alternating Current', color: 'rose',  x: nx(1710), y: ZY.wave2, w: NW, h: NH, prereqs: ['e7'] },

  // ── OPTICS ROW 1 ─────────────────────────────────────────────────────────────
  { id: 'w2', title: 'Sound Waves',           color: 'green', x: nx(380),  y: ZY.mod1, w: NW, h: NH, prereqs: ['w1'] },
  { id: 'w3', title: 'Wave Optics',           color: 'green', x: nx(760),  y: ZY.mod1, w: NW, h: NH, prereqs: ['w1'] },
  { id: 'e9', title: 'Electromagnetic Waves', color: 'rose',  x: nx(1710), y: ZY.mod1, w: NW, h: NH, prereqs: ['e8'] },

  // ── OPTICS ROW 2 ─────────────────────────────────────────────────────────────
  { id: 'w4', title: 'Ray Optics', color: 'green', x: nx(700), y: ZY.mod2, w: NW, h: NH, prereqs: ['w3'] },

  // ── MODERN PHYSICS ROW 1: 6 nodes, spacing=310, start=155 ───────────────────
  // Centers: 155, 465, 775, 1085, 1395, 1705. Span: 155..1855 ✓ centered ✓
  { id: 'p1', title: 'Dual Nature of Radiation & Matter', color: 'pink', x: nx(185),  y: ZY.therm1, w: NW, h: NH, prereqs: ['e9'] },
  { id: 'p2', title: 'Photoelectric Effect',               color: 'pink', x: nx(535),  y: ZY.therm1, w: NW, h: NH, prereqs: ['p1'] },
  { id: 'p3', title: 'Atomic Structure',                   color: 'pink', x: nx(885),  y: ZY.therm1, w: NW, h: NH, prereqs: ['p2'] },
  { id: 'p4', title: 'Nuclei',                             color: 'pink', x: nx(1220), y: ZY.therm1, w: NW, h: NH, prereqs: ['p3'] },
  { id: 'p5', title: 'Semiconductor Electronics',          color: 'pink', x: nx(1555), y: ZY.therm1, w: NW, h: NH, prereqs: ['e4'] },
  { id: 'p6', title: 'Communication Systems',              color: 'pink', x: nx(1840), y: ZY.therm1, w: NW, h: NH, prereqs: ['p5', 'e9'] },

  // ── MODERN PHYSICS ROW 2 ─────────────────────────────────────────────────────
  { id: 'q1', title: 'Quantum Mechanics', color: 'pink', x: nx(535), y: ZY.therm2, w: NW, h: NH, prereqs: ['p2', 'p3'] },
  { id: 'q2', title: 'Radioactivity',     color: 'pink', x: nx(885), y: ZY.therm2, w: NW, h: NH, prereqs: ['p4'] },
];

// ─── CATEGORIES LEGEND ───────────────────────────────────────────────────────
const LEGEND = [
  { label: 'Mathematics & Tools', color: 'purple' },
  { label: 'Mechanics',           color: 'blue' },
  { label: 'Waves & Oscillations',color: 'green' },
  { label: 'Thermal & Statistical',color: 'amber' },
  { label: 'Electromagnetism',    color: 'rose' },
  { label: 'Modern Physics',      color: 'pink' },
];

// ─── COLOR PALETTES ───────────────────────────────────────────────────────────
const COLOR = {
  purple: { bg: '#f3e8ff', border: '#c084fc', text: '#581c87' },
  blue:   { bg: '#e0f2fe', border: '#38bdf8', text: '#0369a1' },
  amber:  { bg: '#ffedd5', border: '#fb923c', text: '#9a3412' },
  rose:   { bg: '#ffe4e6', border: '#fb7185', text: '#9f1239' },
  green:  { bg: '#dcfce7', border: '#4ade80', text: '#166534' },
  pink:   { bg: '#fce7f3', border: '#f472b6', text: '#831843' },
};

// ─── ZONE BAND DEFINITIONS ───────────────────────────────────────────────────
const BANDS = [
  { label: 'FOUNDATION\n(Must Build First)', y1: ZY.found - 16,   y2: ZY.mech1 - 20,       fill: '#f3e8ff', stroke: '#d8b4fe' },
  { label: 'CORE MECHANICS',                 y1: ZY.mech1 - 16,   y2: ZY.wave1 - 20,        fill: '#e0f2fe', stroke: '#7dd3fc' },
  { label: 'WAVES, OPTICS &\nOSCILLATIONS', y1: ZY.wave1 - 16,   y2: ZY.therm1 - 20,       fill: '#dcfce7', stroke: '#86efac' },
  { label: 'MODERN PHYSICS',                 y1: ZY.therm1 - 16,  y2: ZY.therm2 + NH + 20,  fill: '#fce7f3', stroke: '#f9a8d4' },
];

export default function GraphPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const activeId = hoveredId || selectedId;

  const nodeMap = useMemo(() => {
    const m = new Map();
    GRAPH_DATA.forEach(n => m.set(n.id, n));
    return m;
  }, []);

  const directPrereqs = useMemo(() => (activeId ? (nodeMap.get(activeId)?.prereqs ?? []) : []), [activeId, nodeMap]);
  const directDownstream = useMemo(() => (activeId ? GRAPH_DATA.filter(n => n.prereqs.includes(activeId)).map(n => n.id) : []), [activeId]);

  /* Helper: shortest cardinal-axis path, connects BOTTOM of source to TOP of target (when target is below) */
  const edgePath = (src, tgt) => {
    const sx = src.x + src.w / 2;
    const sy = src.y + src.h;          // bottom center of source
    const ty = tgt.y;                  // top of target
    const tx = tgt.x + tgt.w / 2;

    // same horizontal center? pure vertical line
    if (Math.abs(sx - tx) < 4) {
      return `M ${sx} ${sy} L ${tx} ${ty}`;
    }
    // Otherwise: step down halfway, then across, then down to target top
    const my = (sy + ty) / 2;
    return `M ${sx} ${sy} L ${sx} ${my} L ${tx} ${my} L ${tx} ${ty}`;
  };

  const totalH = ZY.therm2 + NH + 30;

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] flex flex-col">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <Link to="/graph" className="group">
          <span className="font-cursive text-4xl sm:text-5xl font-bold text-slate-900 tracking-wide hover:scale-105 transition-transform duration-200 block">
            Prereq
          </span>
        </Link>

        <nav className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80 shadow-2xs sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          {[['🗺️ Dependency Graph','/graph'],['🚨 Recovery Plan','/recover'],['⚙️ Profile & Check-in','/profile']].map(([label, to]) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold transition-all ${isActive ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'}`
            }>{label}</NavLink>
          ))}
        </nav>

        <Link to="/login" className="text-xs sm:text-sm font-extrabold text-slate-600 hover:text-rose-600 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-rose-300 hover:bg-rose-50/80 shadow-2xs transition-all flex items-center gap-1.5">
          <span>Logout</span><span>🚪</span>
        </Link>
      </header>

      {/* ── MAIN ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 w-full mx-auto px-2 sm:px-4 py-6 pb-12" style={{ maxWidth: '95vw' }}>

        {/* Poster Shell */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 overflow-hidden">

          {/* Title Banner */}
          <div className="px-6 pt-6 pb-4 border-b-2 border-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">JEE Physics</h1>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">Complete Chapter Dependency Graph (11th + 12th)</p>
              </div>
              <div className="italic font-serif text-slate-600 text-xs sm:text-sm bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-right max-w-xs">
                "Physics is not a list of formulas,<br/>it's a web of ideas."
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 mt-4">
              {LEGEND.map(({ label, color }) => (
                <span key={label} style={{ background: COLOR[color].bg, border: `1.5px solid ${COLOR[color].border}`, color: COLOR[color].text }}
                  className="px-3 py-1 rounded-lg text-[11px] font-extrabold">
                  {label}
                </span>
              ))}
            </div>

            {/* Arrow Legend */}
            <div className="flex items-center gap-6 mt-3 text-[11px] font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <svg width="28" height="10"><line x1="0" y1="5" x2="20" y2="5" stroke="#334155" strokeWidth="1.5" markerEnd="url(#leg-arrow)" /><defs><marker id="leg-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L6 3 L0 6z" fill="#334155"/></marker></defs></svg>
                A is required before studying B
              </span>
            </div>
          </div>

          {/* SVG Graph (full viewBox, non-scrollable: scales to container) */}
          <div className="w-full px-3 sm:px-6 py-4 overflow-hidden">
            <svg
              viewBox={`0 0 ${W} ${totalH}`}
              className="w-full block"
              style={{ height: 'auto', overflow: 'hidden' }}
            >
              <defs>
                <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M 0 0 L 8 4 L 0 8 z" fill="#94a3b8"/>
                </marker>
                <marker id="arr-prereq" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M 0 0 L 8 4 L 0 8 z" fill="#f59e0b"/>
                </marker>
                <marker id="arr-unlock" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M 0 0 L 8 4 L 0 8 z" fill="#22c55e"/>
                </marker>
              </defs>

              {/* Zone Background Bands – rect only, no labels */}
              {BANDS.map((band) => (
                <rect
                  key={band.label}
                  x="4" y={band.y1}
                  width={W - 8} height={band.y2 - band.y1}
                  rx="14"
                  fill={band.fill} fillOpacity="0.28"
                  stroke={band.stroke} strokeWidth="1.5" strokeDasharray="6 4"
                />
              ))}



              {/* ── EDGES ────────────────────────────────────────────────── */}
              {GRAPH_DATA.flatMap(tgt =>
                tgt.prereqs.map(pid => {
                  const src = nodeMap.get(pid);
                  if (!src) return null;

                  const isPrereq   = activeId && tgt.id === activeId; // incoming arrow TO active
                  const isUnlock   = activeId && src.id === activeId; // outgoing arrow FROM active
                  const isRelated  = activeId && (directPrereqs.includes(pid) || directDownstream.includes(tgt.id));

                  let stroke = '#cbd5e1';
                  let sw = 1.2;
                  let opacity = 0.5;
                  let marker = 'url(#arr)';

                  if (isPrereq) { stroke = '#f59e0b'; sw = 2.5; opacity = 1; marker = 'url(#arr-prereq)'; }
                  else if (isUnlock) { stroke = '#22c55e'; sw = 2.5; opacity = 1; marker = 'url(#arr-unlock)'; }
                  else if (activeId && !isRelated) { opacity = 0.10; }

                  return (
                    <path
                      key={`${pid}->${tgt.id}`}
                      d={edgePath(src, tgt)}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={sw}
                      strokeOpacity={opacity}
                      markerEnd={marker}
                      strokeLinejoin="round"
                    />
                  );
                })
              )}

              {/* ── NODES ─────────────────────────────────────────────────── */}
              {GRAPH_DATA.map(node => {
                const pal = COLOR[node.color] ?? COLOR.purple;
                const isActive   = node.id === activeId;
                const isPrereq   = directPrereqs.includes(node.id);
                const isUnlock   = directDownstream.includes(node.id);
                const isDimmed   = activeId && !isActive && !isPrereq && !isUnlock;

                const bg     = isActive ? '#fef3c7' : isPrereq ? '#fef3c7' : isUnlock ? '#dcfce7' : pal.bg;
                const border = isActive ? '#f59e0b' : isPrereq ? '#f59e0b' : isUnlock ? '#22c55e' : pal.border;
                const textC  = isActive ? '#78350f' : isPrereq ? '#78350f' : isUnlock ? '#14532d' : pal.text;
                const sw     = (isActive || isPrereq || isUnlock) ? 2.5 : 1.5;

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedId(prev => prev === node.id ? null : node.id)}
                    onMouseEnter={() => setHoveredId(node.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{ cursor: 'pointer', opacity: isDimmed ? 0.22 : 1, transition: 'opacity 0.2s' }}
                  >
                    {/* Shadow */}
                    {(isActive || isPrereq || isUnlock) && (
                      <rect x={node.x + 3} y={node.y + 4} width={node.w} height={node.h} rx="8" fill={border} fillOpacity="0.25"/>
                    )}
                    {/* Box */}
                    <rect
                      x={node.x} y={node.y} width={node.w} height={node.h} rx="8"
                      fill={bg} stroke={border} strokeWidth={sw}
                    />
                    {/* Title — smart word-wrap, bigger font */}
                    {(() => {
                      const words = node.title.split(' ');
                      const lines = [];
                      let line = '';
                      const MAX_CHARS = node.w < 220 ? 13 : 21;
                      words.forEach(w => {
                        if ((line + ' ' + w).trim().length <= MAX_CHARS) line = (line + ' ' + w).trim();
                        else { lines.push(line); line = w; }
                      });
                      lines.push(line);
                      const lineH = 23;
                      const startY = node.y + node.h / 2 - ((lines.length - 1) * lineH / 2) + 7;
                      return lines.map((l, i) => (
                        <text key={i} x={node.x + node.w / 2} y={startY + i * lineH}
                          textAnchor="middle" fontSize="19" fontWeight="800" fill={textC}>
                          {l}
                        </text>
                      ));
                    })()}
                  </g>
                );
              })}



            </svg>
          </div>

        </div>



      </main>
    </div>
  );
}
