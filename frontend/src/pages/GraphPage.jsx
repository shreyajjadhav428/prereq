import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Complete Predefined JEE Physics Dependency Graph Data with Larger Boxes & Perfect Spacing
const GRAPH_DATA = [
  // 1. Mathematics & Tools (Purple) - Top Horizontal Row (y = 60)
  {
    id: 'math-1',
    title: 'Physical Quantities & Units',
    category: 'Mathematics & Tools',
    catKey: 'math',
    color: 'purple',
    x: 40, y: 60,
    prereqs: [],
    hours: 6, weightage: '3%',
    description: 'SI units, dimensions, dimensional analysis, and error propagation fundamentals.',
  },
  {
    id: 'math-2',
    title: 'Measurement & Errors',
    category: 'Mathematics & Tools',
    catKey: 'math',
    color: 'purple',
    x: 240, y: 60,
    prereqs: ['math-1'],
    hours: 8, weightage: '3%',
    description: 'Vernier calipers, screw gauge, least count, absolute/relative error calculation.',
  },
  {
    id: 'math-3',
    title: 'Vectors',
    category: 'Mathematics & Tools',
    catKey: 'math',
    color: 'purple',
    x: 440, y: 60,
    prereqs: ['math-4'],
    hours: 10, weightage: '4%',
    description: 'Vector addition, dot product, cross product, resolution of vectors in 2D & 3D.',
  },
  {
    id: 'math-4',
    title: 'Mathematical Tools (Algebra, Trig, Calculus)',
    category: 'Mathematics & Tools',
    catKey: 'math',
    color: 'purple',
    x: 640, y: 50, w: 210, h: 95, // Hub node slightly larger
    prereqs: [],
    hours: 14, weightage: '5%',
    description: 'Essential algebra, trigonometry identities, graphs, limits, and derivative concepts.',
  },
  {
    id: 'math-5',
    title: 'Functions & Graphs',
    category: 'Mathematics & Tools',
    catKey: 'math',
    color: 'purple',
    x: 880, y: 60,
    prereqs: ['math-4'],
    hours: 8, weightage: '2%',
    description: 'Polynomial, trigonometric, exponential & logarithmic graphs and slope analysis.',
  },
  {
    id: 'math-6',
    title: 'Differentiation',
    category: 'Mathematics & Tools',
    catKey: 'math',
    color: 'purple',
    x: 1080, y: 60,
    prereqs: ['math-4', 'math-5'],
    hours: 10, weightage: '4%',
    description: 'Rate of change, maxima/minima applications, chain rule, and physics applications.',
  },
  {
    id: 'math-7',
    title: 'Integration',
    category: 'Mathematics & Tools',
    catKey: 'math',
    color: 'purple',
    x: 1280, y: 60,
    prereqs: ['math-6'],
    hours: 12, weightage: '4%',
    description: 'Indefinite & definite integrals, area under curves, continuous summation in physics.',
  },
  {
    id: 'math-8',
    title: 'Basic Mathematics for Physics',
    category: 'Mathematics & Tools',
    catKey: 'math',
    color: 'purple',
    x: 40, y: 370,
    prereqs: ['math-4'],
    hours: 6, weightage: '2%',
    description: 'Binomial approximation, series expansion, and coordinate geometry basics.',
  },
  {
    id: 'math-9',
    title: 'Vector Calculus',
    category: 'Mathematics & Tools',
    catKey: 'math',
    color: 'purple',
    x: 1370, y: 520,
    prereqs: ['math-3', 'math-7'],
    hours: 12, weightage: '4%',
    description: 'Gradient, divergence, line/surface integrals used in field theory & electromagnetism.',
  },

  // 2. Mechanics (Blue) - Left-Center Block
  {
    id: 'mech-1',
    title: 'Kinematics in One Dimension',
    category: 'Mechanics',
    catKey: 'mechanics',
    color: 'blue',
    x: 200, y: 210,
    prereqs: ['math-4', 'math-6'],
    hours: 12, weightage: '5%',
    description: 'Position, velocity, acceleration, motion graphs, and equations of motion.',
  },
  {
    id: 'mech-2',
    title: 'Kinematics in Two Dimensions',
    category: 'Mechanics',
    catKey: 'mechanics',
    color: 'blue',
    x: 400, y: 210,
    prereqs: ['mech-1', 'math-3'],
    hours: 14, weightage: '5%',
    description: 'Projectile motion, circular motion, relative velocity in 2D.',
  },
  {
    id: 'mech-3',
    title: 'Laws of Motion',
    category: 'Mechanics',
    catKey: 'mechanics',
    color: 'blue',
    x: 600, y: 210,
    prereqs: ['mech-2', 'math-3'],
    hours: 16, weightage: '6%',
    description: "Newton's 3 laws, free body diagrams, friction (static/kinetic), pulley systems.",
  },
  {
    id: 'mech-4',
    title: 'Work, Energy & Power',
    category: 'Mechanics',
    catKey: 'mechanics',
    color: 'blue',
    x: 500, y: 310,
    prereqs: ['mech-2', 'mech-3', 'math-7'],
    hours: 14, weightage: '6%',
    description: 'Work-energy theorem, conservative forces, potential energy curves, collisions.',
  },
  {
    id: 'mech-5',
    title: 'System of Particles & Rotational Motion',
    category: 'Mechanics',
    catKey: 'mechanics',
    color: 'blue',
    x: 500, y: 400,
    prereqs: ['mech-4', 'math-3'],
    hours: 20, weightage: '8%',
    description: 'Center of mass, torque, moment of inertia, angular momentum, rolling motion.',
  },
  {
    id: 'mech-6',
    title: 'Gravitation',
    category: 'Mechanics',
    catKey: 'mechanics',
    color: 'blue',
    x: 500, y: 490,
    prereqs: ['mech-5', 'mech-4'],
    hours: 12, weightage: '4%',
    description: "Kepler's laws, gravitational potential & field, escape & orbital velocity.",
  },
  {
    id: 'mech-7',
    title: 'Properties of Solids & Liquids',
    category: 'Mechanics',
    catKey: 'mechanics',
    color: 'blue',
    x: 500, y: 580,
    prereqs: ['mech-3'],
    hours: 10, weightage: '4%',
    description: "Elasticity, Young's modulus, stress-strain curve, surface tension, viscosity.",
  },
  {
    id: 'mech-8',
    title: 'Mechanical Properties of Fluids',
    category: 'Mechanics',
    catKey: 'mechanics',
    color: 'blue',
    x: 500, y: 670,
    prereqs: ['mech-7'],
    hours: 12, weightage: '5%',
    description: "Pascal's law, Archimedes' principle, fluid dynamics, Bernoulli's equation.",
  },
  {
    id: 'mech-9',
    title: 'Oscillations',
    category: 'Mechanics',
    catKey: 'mechanics',
    color: 'blue',
    x: 500, y: 760,
    prereqs: ['mech-4', 'mech-8'],
    hours: 14, weightage: '5%',
    description: 'Simple Harmonic Motion (SHM), spring-mass system, pendulum, damped oscillations.',
  },

  // 3. Thermal & Statistical (Orange/Amber) - Center Column
  {
    id: 'therm-1',
    title: 'Thermal Expansion',
    category: 'Thermal & Statistical',
    catKey: 'thermal',
    color: 'amber',
    x: 770, y: 210,
    prereqs: ['math-4'],
    hours: 8, weightage: '3%',
    description: 'Linear, superficial, and volumetric expansion of solids, liquids, and anomalous water expansion.',
  },
  {
    id: 'therm-2',
    title: 'Calorimetry',
    category: 'Thermal & Statistical',
    catKey: 'thermal',
    color: 'amber',
    x: 770, y: 300,
    prereqs: ['therm-1'],
    hours: 8, weightage: '3%',
    description: 'Specific heat capacity, principle of calorimetry, phase change, latent heat of fusion & vaporization.',
  },
  {
    id: 'therm-3',
    title: 'Heat Transfer',
    category: 'Thermal & Statistical',
    catKey: 'thermal',
    color: 'amber',
    x: 770, y: 390,
    prereqs: ['therm-2'],
    hours: 12, weightage: '4%',
    description: "Conduction, thermal resistance, convection, radiation, Stefan's law & Newton's law of cooling.",
  },
  {
    id: 'therm-4',
    title: 'Kinetic Theory of Gases',
    category: 'Thermal & Statistical',
    catKey: 'thermal',
    color: 'amber',
    x: 770, y: 480,
    prereqs: ['therm-3'],
    hours: 10, weightage: '4%',
    description: 'Ideal gas laws, rms speed, degrees of freedom, law of equipartition of energy, mean free path.',
  },
  {
    id: 'therm-5',
    title: 'Thermodynamics (Laws)',
    category: 'Thermal & Statistical',
    catKey: 'thermal',
    color: 'amber',
    x: 770, y: 570,
    prereqs: ['therm-4'],
    hours: 14, weightage: '6%',
    description: 'Zeroth, 1st & 2nd laws of thermodynamics, isothermal, adiabatic, isobaric processes, heat engines.',
  },
  {
    id: 'therm-6',
    title: 'Entropy',
    category: 'Thermal & Statistical',
    catKey: 'thermal',
    color: 'amber',
    x: 770, y: 660,
    prereqs: ['therm-5'],
    hours: 6, weightage: '2%',
    description: 'Reversible/irreversible processes, Carnot cycle efficiency, entropy changes in thermodynamic systems.',
  },

  // 4. Electromagnetism (Red/Rose) - Right-Center Column
  {
    id: 'em-1',
    title: 'Electric Charges & Fields',
    category: 'Electromagnetism',
    catKey: 'em',
    color: 'rose',
    x: 1040, y: 210,
    prereqs: ['math-7', 'math-9'],
    hours: 16, weightage: '6%',
    description: "Coulomb's law, electric field lines, electric dipole, torque in uniform field, electric flux.",
  },
  {
    id: 'em-2',
    title: "Gauss's Law",
    category: 'Electromagnetism',
    catKey: 'em',
    color: 'rose',
    x: 1040, y: 300,
    prereqs: ['em-1'],
    hours: 10, weightage: '4%',
    description: "Applications of Gauss's Law to spheres, infinite wires, planar sheets, conductor field properties.",
  },
  {
    id: 'em-3',
    title: 'Electric Potential & Capacitance',
    category: 'Electromagnetism',
    catKey: 'em',
    color: 'rose',
    x: 1040, y: 390,
    prereqs: ['em-2', 'mech-4'],
    hours: 16, weightage: '6%',
    description: 'Electrostatic potential, equipotential surfaces, parallel plate capacitor, dielectrics, energy storage.',
  },
  {
    id: 'em-4',
    title: 'Current Electricity',
    category: 'Electromagnetism',
    catKey: 'em',
    color: 'rose',
    x: 1040, y: 480,
    prereqs: ['em-3'],
    hours: 18, weightage: '7%',
    description: "Ohm's law, drift velocity, Kirchhoff's rules, Wheatstone bridge, potentiometer, meter bridge.",
  },
  {
    id: 'em-5',
    title: 'Magnetic Effects of Current',
    category: 'Electromagnetism',
    catKey: 'em',
    color: 'rose',
    x: 1040, y: 570,
    prereqs: ['em-4', 'math-9'],
    hours: 18, weightage: '7%',
    description: 'Biot-Savart law, Ampere circuital law, Lorentz force, cyclotron, magnetic force on current wire.',
  },
  {
    id: 'em-6',
    title: 'Magnetism & Matter',
    category: 'Electromagnetism',
    catKey: 'em',
    color: 'rose',
    x: 1040, y: 660,
    prereqs: ['em-5'],
    hours: 10, weightage: '3%',
    description: 'Bar magnet, Earth magnetism, magnetic dipole moment, dia-, para-, and ferromagnetic materials.',
  },
  {
    id: 'em-7',
    title: 'Electromagnetic Induction',
    category: 'Electromagnetism',
    catKey: 'em',
    color: 'rose',
    x: 1040, y: 750,
    prereqs: ['em-6', 'math-9'],
    hours: 16, weightage: '6%',
    description: "Faraday's laws, Lenz's law, motional EMF, self & mutual inductance, eddy currents.",
  },
  {
    id: 'em-8',
    title: 'Alternating Current',
    category: 'Electromagnetism',
    catKey: 'em',
    color: 'rose',
    x: 1040, y: 840,
    prereqs: ['em-7'],
    hours: 12, weightage: '5%',
    description: 'AC voltage across R, L, C, series LCR resonant circuit, power factor, transformer principle.',
  },
  {
    id: 'em-9',
    title: 'Electromagnetic Waves',
    category: 'Electromagnetism',
    catKey: 'em',
    color: 'rose',
    x: 1040, y: 930,
    prereqs: ['em-8'],
    hours: 8, weightage: '3%',
    description: 'Displacement current, Maxwell equations summary, EM spectrum properties and momentum transfer.',
  },

  // 5. Waves & Optics (Green) - Lower Middle
  {
    id: 'waves-1',
    title: 'Waves',
    category: 'Waves & Oscillations',
    catKey: 'waves',
    color: 'green',
    x: 500, y: 865,
    prereqs: ['mech-9'],
    hours: 14, weightage: '5%',
    description: 'Transverse & longitudinal wave equation, wave speed, principle of superposition, standing waves.',
  },
  {
    id: 'waves-2',
    title: 'Sound Waves',
    category: 'Waves & Oscillations',
    catKey: 'waves',
    color: 'green',
    x: 370, y: 955,
    prereqs: ['waves-1'],
    hours: 12, weightage: '4%',
    description: 'Speed of sound in gases/solids, organ pipes, resonance tube, beats, Doppler effect.',
  },
  {
    id: 'waves-3',
    title: 'Wave Optics',
    category: 'Waves & Oscillations',
    catKey: 'waves',
    color: 'green',
    x: 620, y: 955,
    prereqs: ['waves-1'],
    hours: 14, weightage: '5%',
    description: "Huygens principle, Young's double slit interference, diffraction at single slit, polarization.",
  },
  {
    id: 'waves-4',
    title: 'Ray Optics',
    category: 'Waves & Oscillations',
    catKey: 'waves',
    color: 'green',
    x: 620, y: 1045,
    prereqs: ['waves-3'],
    hours: 18, weightage: '7%',
    description: 'Reflection, refraction, total internal reflection, spherical mirrors/lenses, prisms, optical instruments.',
  },

  // 6. Modern Physics & Experimental (Teal/Cyan) - Bottom Block
  {
    id: 'mod-1',
    title: 'Dual Nature of Radiation & Matter',
    category: 'Modern Physics',
    catKey: 'modern',
    color: 'teal',
    x: 40, y: 1170,
    prereqs: ['waves-3', 'em-9'],
    hours: 10, weightage: '4%',
    description: 'Photon theory, de Broglie wavelength of matter waves, Davisson-Germer experiment.',
  },
  {
    id: 'mod-2',
    title: 'Photoelectric Effect',
    category: 'Modern Physics',
    catKey: 'modern',
    color: 'teal',
    x: 250, y: 1170,
    prereqs: ['mod-1'],
    hours: 8, weightage: '4%',
    description: "Einstein's photoelectric equation, stopping potential, work function, intensity vs frequency graphs.",
  },
  {
    id: 'mod-3',
    title: 'Atomic Structure',
    category: 'Modern Physics',
    catKey: 'modern',
    color: 'teal',
    x: 460, y: 1170,
    prereqs: ['mod-1', 'mech-6'],
    hours: 12, weightage: '5%',
    description: 'Rutherford alpha scattering, Bohr model of hydrogen atom, energy levels, Rydberg formula, X-rays.',
  },
  {
    id: 'mod-4',
    title: 'Nuclei',
    category: 'Modern Physics',
    catKey: 'modern',
    color: 'teal',
    x: 670, y: 1170,
    prereqs: ['mod-3'],
    hours: 10, weightage: '4%',
    description: 'Nuclear size/density, mass defect, binding energy per nucleon, nuclear fission and fusion.',
  },
  {
    id: 'mod-5',
    title: 'Semiconductor Electronics',
    category: 'Modern Physics',
    catKey: 'modern',
    color: 'teal',
    x: 880, y: 1170,
    prereqs: ['em-4', 'mod-1'],
    hours: 16, weightage: '6%',
    description: 'Energy bands, intrinsic/extrinsic p-n junction diode, rectifiers, Zener diode, logic gates.',
  },
  {
    id: 'mod-6',
    title: 'Communication Systems',
    category: 'Modern Physics',
    catKey: 'modern',
    color: 'teal',
    x: 1090, y: 1170,
    prereqs: ['mod-5', 'em-9'],
    hours: 8, weightage: '3%',
    description: 'Bandwidth, signal transmission modes, amplitude modulation (AM) index, transmitter/receiver layout.',
  },
  {
    id: 'mod-7',
    title: 'Quantum Mechanics',
    category: 'Modern Physics',
    catKey: 'modern',
    color: 'teal',
    x: 460, y: 1270,
    prereqs: ['mod-3'],
    hours: 8, weightage: '3%',
    description: 'Wavefunctions, Heisenberg uncertainty principle, 1D potential well introductory principles.',
  },
  {
    id: 'mod-8',
    title: 'Radioactivity',
    category: 'Modern Physics',
    catKey: 'modern',
    color: 'teal',
    x: 670, y: 1270,
    prereqs: ['mod-4'],
    hours: 8, weightage: '3%',
    description: 'Alpha, beta, gamma decay laws, half-life & mean life equations, radioactive equilibrium.',
  },
  {
    id: 'mod-9',
    title: 'Experimental Skills & Data Analysis',
    category: 'Modern Physics',
    catKey: 'modern',
    color: 'teal',
    x: 540, y: 1375, w: 220, h: 85, // Bottom center synthesis node
    prereqs: ['mod-7', 'mod-8', 'math-2'],
    hours: 10, weightage: '4%',
    description: 'JEE practical skills, error propagation analysis, graphs interpretation & laboratory instruments.',
  },
];

const CATEGORIES_LEGEND = [
  { label: 'Mathematics & Tools', colorBg: 'bg-[#e9d5ff]', borderBg: 'border-[#c084fc]', textBg: 'text-[#6b21a8]' },
  { label: 'Mechanics', colorBg: 'bg-[#dbeafe]', borderBg: 'border-[#60a5fa]', textBg: 'text-[#1e40af]' },
  { label: 'Waves & Oscillations', colorBg: 'bg-[#dcfce7]', borderBg: 'border-[#4ade80]', textBg: 'text-[#166534]' },
  { label: 'Thermal & Statistical', colorBg: 'bg-[#ffedd5]', borderBg: 'border-[#fb923c]', textBg: 'text-[#9a3412]' },
  { label: 'Electromagnetism', colorBg: 'bg-[#ffe4e6]', borderBg: 'border-[#fb7185]', textBg: 'text-[#9f1239]' },
  { label: 'Modern Physics', colorBg: 'bg-[#ccfbf1]', borderBg: 'border-[#2dd4bf]', textBg: 'text-[#115e59]' },
];

export default function GraphPage() {
  const [selectedNodeId, setSelectedNodeId] = useState('math-4');
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  // Chapter map for quick lookup
  const chapterMap = useMemo(() => {
    const map = new Map();
    GRAPH_DATA.forEach((item) => map.set(item.id, item));
    return map;
  }, []);

  // Compute downstream chapters
  const downstreamMap = useMemo(() => {
    const map = new Map();
    GRAPH_DATA.forEach((item) => map.set(item.id, []));
    GRAPH_DATA.forEach((item) => {
      item.prereqs.forEach((prereqId) => {
        if (map.has(prereqId)) {
          map.get(prereqId).push(item.id);
        }
      });
    });
    return map;
  }, []);

  // Compute all directed edges (Source -> Target)
  const allEdges = useMemo(() => {
    const edges = [];
    GRAPH_DATA.forEach((targetNode) => {
      targetNode.prereqs.forEach((prereqId) => {
        const sourceNode = chapterMap.get(prereqId);
        if (sourceNode) {
          edges.push({
            id: `${sourceNode.id}->${targetNode.id}`,
            source: sourceNode,
            target: targetNode,
          });
        }
      });
    });
    return edges;
  }, [chapterMap]);

  const activeNodeId = hoveredNodeId || selectedNodeId;
  const selectedNode = chapterMap.get(selectedNodeId) || GRAPH_DATA[0];

  const directPrereqIds = selectedNode ? selectedNode.prereqs : [];
  const downstreamIds = selectedNode ? downstreamMap.get(selectedNode.id) || [] : [];

  // Enhanced larger box dimensions
  const defaultNodeW = 180;
  const defaultNodeH = 75;

  const getNodeBounds = (node) => {
    const w = node.w || defaultNodeW;
    const h = node.h || defaultNodeH;
    return { x: node.x, y: node.y, w, h };
  };

  const getStyleForNode = (node) => {
    const isSelected = selectedNodeId === node.id;
    const isPrereq = directPrereqIds.includes(node.id);
    const isDownstream = downstreamIds.includes(node.id);

    if (isSelected) {
      return 'bg-white border-2 border-slate-900 shadow-2xl ring-4 ring-slate-900/10 scale-105 z-30 font-extrabold';
    }
    if (isPrereq) {
      return 'bg-amber-100 border-2 border-amber-500 shadow-lg ring-2 ring-amber-500/30 scale-102 z-20 font-bold';
    }
    if (isDownstream) {
      return 'bg-emerald-100 border-2 border-emerald-500 shadow-lg ring-2 ring-emerald-500/30 scale-102 z-20 font-bold';
    }

    switch (node.color) {
      case 'purple':
        return 'bg-[#f3e8ff] border border-[#d8b4fe] text-[#581c87] hover:border-[#a855f7] hover:shadow-md';
      case 'blue':
        return 'bg-[#eff6ff] border border-[#bfdbfe] text-[#1e3a8a] hover:border-[#3b82f6] hover:shadow-md';
      case 'amber':
        return 'bg-[#fff7ed] border border-[#fed7aa] text-[#7c2d12] hover:border-[#f97316] hover:shadow-md';
      case 'rose':
        return 'bg-[#fff1f2] border border-[#fecdd3] text-[#881337] hover:border-[#f43f5e] hover:shadow-md';
      case 'green':
        return 'bg-[#f0fdf4] border border-[#bbf7d0] text-[#14532d] hover:border-[#22c55e] hover:shadow-md';
      case 'teal':
        return 'bg-[#f0fdfa] border border-[#99f6e4] text-[#134e4a] hover:border-[#14b8a6] hover:shadow-md';
      default:
        return 'bg-slate-50 border border-slate-200 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800 font-['Inter'] pb-24">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center">
          <Link to="/" className="group flex items-center">
            <span className="font-cursive text-4xl sm:text-5xl font-bold text-slate-900 tracking-wide hover:scale-105 transition-transform duration-200">
              Prereq
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="text-sm font-extrabold text-slate-700 hover:text-slate-900 px-5 py-2.5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 shadow-xs hover:shadow-md transition-all flex items-center gap-2"
          >
            ⚙️ Profile & Schedule
          </Link>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main className="max-w-[1650px] mx-auto px-2 sm:px-4 pt-6">
        
        {/* Main Poster Container matching the Image */}
        <div className="bg-[#fef7d8]/65 rounded-3xl p-4 sm:p-8 shadow-2xl shadow-amber-950/10 border-2 border-amber-300/70 overflow-x-auto text-center relative">
          
          {/* Poster Main Banner Title */}
          <div className="mb-6 space-y-3 min-w-[1550px]">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
              JEE PHYSICS – COMPLETE CHAPTER DEPENDENCY GRAPH (11<sup>th</sup> + 12<sup>th</sup>)
            </h1>

            {/* Category Color Legend (Matching Top Legend in Image) */}
            <div className="flex items-center justify-center gap-3 flex-wrap pt-1 pb-4 border-b-2 border-amber-300/70">
              {CATEGORIES_LEGEND.map((cat) => (
                <div
                  key={cat.label}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold shadow-xs ${cat.colorBg} ${cat.borderBg} ${cat.textBg}`}
                >
                  {cat.label}
                </div>
              ))}
            </div>
          </div>

          {/* CANVAS GRAPH AREA (Spacious 1550x1500 layout) */}
          <div className="relative min-w-[1550px] h-[1500px] mx-auto bg-[#dcfce7]/70 rounded-2xl border-2 border-emerald-300/70 p-2 overflow-hidden shadow-inner">
            
            {/* SVG ARROW OVERLAY */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                {/* Arrowhead Markers */}
                <marker id="arrow-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                </marker>
                <marker id="arrow-prereq" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                </marker>
                <marker id="arrow-unlock" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
              </defs>

              {/* Render Directed Edges */}
              {allEdges.map((edge) => {
                const sB = getNodeBounds(edge.source);
                const tB = getNodeBounds(edge.target);

                const isIncomingPrereq = edge.target.id === activeNodeId;
                const isOutgoingUnlock = edge.source.id === activeNodeId;

                let strokeColor = '#94a3b8'; // Slate 400
                let strokeWidth = 1.5;
                let opacity = 0.45;
                let markerEnd = 'url(#arrow-default)';

                if (isIncomingPrereq) {
                  strokeColor = '#f59e0b'; // Amber
                  strokeWidth = 3.5;
                  opacity = 1;
                  markerEnd = 'url(#arrow-prereq)';
                } else if (isOutgoingUnlock) {
                  strokeColor = '#10b981'; // Emerald
                  strokeWidth = 3.5;
                  opacity = 1;
                  markerEnd = 'url(#arrow-unlock)';
                }

                // Compute exact connection anchors based on node relative positioning
                let sx, sy, tx, ty;
                const deltaX = tB.x - sB.x;
                const deltaY = tB.y - sB.y;

                if (Math.abs(deltaY) > Math.abs(deltaX)) {
                  // Mostly Vertical Flow
                  if (deltaY > 0) {
                    sx = sB.x + sB.w / 2;
                    sy = sB.y + sB.h;
                    tx = tB.x + tB.w / 2;
                    ty = tB.y;
                  } else {
                    sx = sB.x + sB.w / 2;
                    sy = sB.y;
                    tx = tB.x + tB.w / 2;
                    ty = tB.y + tB.h;
                  }
                } else {
                  // Mostly Horizontal Flow
                  if (deltaX > 0) {
                    sx = sB.x + sB.w;
                    sy = sB.y + sB.h / 2;
                    tx = tB.x;
                    ty = tB.y + tB.h / 2;
                  } else {
                    sx = sB.x;
                    sy = sB.y + sB.h / 2;
                    tx = tB.x + tB.w;
                    ty = tB.y + tB.h / 2;
                  }
                }

                // Smooth Orthogonal / Curved Path
                const dx = Math.abs(tx - sx);
                const dy = Math.abs(ty - sy);
                const cOffset = Math.min(dx * 0.5, dy * 0.5, 50);

                const pathD = `M ${sx} ${sy} C ${sx + (deltaX > 0 ? cOffset : -cOffset)} ${sy + (deltaY > 0 ? cOffset : -cOffset)}, ${tx - (deltaX > 0 ? cOffset : -cOffset)} ${ty - (deltaY > 0 ? cOffset : -cOffset)}, ${tx} ${ty}`;

                return (
                  <path
                    key={edge.id}
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeOpacity={opacity}
                    strokeDasharray={isIncomingPrereq || isOutgoingUnlock ? '6 4' : 'none'}
                    className={isIncomingPrereq || isOutgoingUnlock ? 'animate-pulse' : ''}
                    markerEnd={markerEnd}
                  />
                );
              })}
            </svg>

            {/* INTERACTIVE CHAPTER NODES */}
            <div className="relative z-10 w-full h-full">
              {GRAPH_DATA.map((node) => {
                const bounds = getNodeBounds(node);
                const isSelected = selectedNodeId === node.id;
                const isPrereq = directPrereqIds.includes(node.id);
                const isDownstream = downstreamIds.includes(node.id);

                return (
                  <div
                    key={node.id}
                    style={{
                      left: `${bounds.x}px`,
                      top: `${bounds.y}px`,
                      width: `${bounds.w}px`,
                      height: `${bounds.h}px`,
                    }}
                    onClick={() => setSelectedNodeId(node.id)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className={`absolute p-2.5 rounded-2xl transition-all cursor-pointer shadow-sm flex flex-col items-center justify-center text-center select-none ${getStyleForNode(
                      node
                    )}`}
                  >
                    <span className="text-xs sm:text-[13px] font-bold leading-snug px-1 line-clamp-2">
                      {node.title}
                    </span>
                    {(isSelected || isPrereq || isDownstream) && (
                      <span className="text-[10px] font-extrabold mt-1 opacity-90">
                        {isSelected ? '🎯 Active' : isPrereq ? '⬆️ Prereq' : '⬇️ Unlocks'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Left Note Box (Matching Image "How to Read") */}
            <div className="absolute bottom-5 left-5 z-20 w-72 bg-[#f3e8ff] p-4 rounded-2xl border-2 border-purple-300/80 shadow-xl text-left text-xs space-y-1.5">
              <span className="font-bold text-slate-900 block text-sm">How to Read</span>
              <p className="text-xs text-purple-950 font-semibold leading-relaxed">
                Arrow from A to B means A is required before studying B.
              </p>
              <div className="flex items-center gap-2 pt-1 font-bold text-xs text-purple-900">
                <span>A</span>
                <span>➔</span>
                <span>B</span>
              </div>
            </div>



          </div>

        </div>

      </main>
    </div>
  );
}
