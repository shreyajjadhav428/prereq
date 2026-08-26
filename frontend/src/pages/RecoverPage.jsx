import { useState, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';

// Comprehensive JEE Physics Chapter Dataset with Dependencies & Meta
const PHYSICS_CHAPTERS = [
  {
    id: 'math-3',
    title: 'Vectors',
    category: 'Mathematics & Tools',
    catKey: 'math',
    color: 'purple',
    prereqs: ['math-4'],
    hours: 10,
    weightage: '4%',
    description: 'Vector addition, dot product, cross product, resolution in 2D & 3D.',
    downstreamIds: ['mech-2', 'mech-3', 'mech-5', 'em-5', 'math-9'],
    initialStatus: 'backlog', // 'backlog' | 'at_risk' | 'completed'
    lastCheckInNote: 'Missed 3 vector resolution practice sheets due to coaching test prep.',
  },
  {
    id: 'math-6',
    title: 'Differentiation',
    category: 'Mathematics & Tools',
    catKey: 'math',
    color: 'purple',
    prereqs: ['math-4', 'math-5'],
    hours: 10,
    weightage: '4%',
    description: 'Rate of change, maxima/minima applications, chain rule in physics.',
    downstreamIds: ['math-7', 'mech-1', 'mech-3'],
    initialStatus: 'at_risk',
    lastCheckInNote: 'Confused about applying chain rule in velocity-displacement problems.',
  },
  {
    id: 'math-7',
    title: 'Integration',
    category: 'Mathematics & Tools',
    catKey: 'math',
    color: 'purple',
    prereqs: ['math-6'],
    hours: 12,
    weightage: '4%',
    description: 'Indefinite & definite integrals, area under curves, continuous summation.',
    downstreamIds: ['mech-4', 'em-1', 'math-9'],
    initialStatus: 'at_risk',
    lastCheckInNote: 'Struggling with setting proper integration limits in variable force problems.',
  },
  {
    id: 'mech-1',
    title: 'Kinematics in One Dimension',
    category: 'Mechanics',
    catKey: 'mechanics',
    color: 'blue',
    prereqs: ['math-4', 'math-6'],
    hours: 12,
    weightage: '5%',
    description: 'Position, velocity, acceleration, calculus motion graphs.',
    downstreamIds: ['mech-2', 'mech-3'],
    initialStatus: 'completed',
    lastCheckInNote: 'Mastered motion under gravity.',
  },
  {
    id: 'mech-2',
    title: 'Kinematics in Two Dimensions (Projectile Motion)',
    category: 'Mechanics',
    catKey: 'mechanics',
    color: 'blue',
    prereqs: ['mech-1', 'math-3'],
    hours: 14,
    weightage: '5%',
    description: 'Projectile motion, circular motion, relative velocity in 2D.',
    downstreamIds: ['mech-3', 'mech-4'],
    initialStatus: 'at_risk',
    lastCheckInNote: 'Needs review on inclined plane projectile numericals.',
  },
  {
    id: 'mech-3',
    title: "Newton's Laws of Motion & Friction",
    category: 'Mechanics',
    catKey: 'mechanics',
    color: 'blue',
    prereqs: ['mech-2', 'math-3'],
    hours: 16,
    weightage: '6%',
    description: "Newton's 3 laws, free body diagrams, static/kinetic friction, pulleys.",
    downstreamIds: ['mech-4', 'mech-7', 'em-3'],
    initialStatus: 'backlog',
    lastCheckInNote: 'Skipped multi-block friction system problem set.',
  },
  {
    id: 'mech-4',
    title: 'Work, Energy & Power',
    category: 'Mechanics',
    catKey: 'mechanics',
    color: 'blue',
    prereqs: ['mech-2', 'mech-3', 'math-7'],
    hours: 14,
    weightage: '6%',
    description: 'Work-energy theorem, conservative forces, potential energy, collisions.',
    downstreamIds: ['mech-5', 'mech-6', 'mech-9', 'em-3'],
    initialStatus: 'backlog',
    lastCheckInNote: 'Failed check-in query on vertical circular motion energy conservation.',
  },
  {
    id: 'mech-5',
    title: 'System of Particles & Rotational Motion',
    category: 'Mechanics',
    catKey: 'mechanics',
    color: 'blue',
    prereqs: ['mech-4', 'math-3'],
    hours: 20,
    weightage: '8%',
    description: 'Center of mass, torque, moment of inertia, angular momentum, rolling.',
    downstreamIds: ['mech-6'],
    initialStatus: 'backlog',
    lastCheckInNote: 'High difficulty chapter; pending 15 JEE Main PYQs.',
  },
  {
    id: 'em-1',
    title: 'Electric Charges & Fields',
    category: 'Electromagnetism',
    catKey: 'em',
    color: 'rose',
    prereqs: ['math-7', 'math-9'],
    hours: 16,
    weightage: '6%',
    description: "Coulomb's law, electric field lines, electric dipole, flux.",
    downstreamIds: ['em-2', 'em-3'],
    initialStatus: 'backlog',
    lastCheckInNote: 'Not started. Prerequisite integration weakness flagged in check-in.',
  },
  {
    id: 'em-3',
    title: 'Electric Potential & Capacitance',
    category: 'Electromagnetism',
    catKey: 'em',
    color: 'rose',
    prereqs: ['em-2', 'mech-4'],
    hours: 16,
    weightage: '6%',
    description: 'Electrostatic potential, capacitors, dielectrics, energy storage.',
    downstreamIds: ['em-4'],
    initialStatus: 'at_risk',
    lastCheckInNote: 'Scored 40% on dielectric insertion quiz.',
  },
  {
    id: 'em-4',
    title: 'Current Electricity',
    category: 'Electromagnetism',
    catKey: 'em',
    color: 'rose',
    prereqs: ['em-3'],
    hours: 18,
    weightage: '7%',
    description: "Ohm's law, drift velocity, Kirchhoff's rules, Wheatstone bridge, potentiometer.",
    downstreamIds: ['em-5', 'mod-5'],
    initialStatus: 'at_risk',
    lastCheckInNote: 'Potentiometer wire balance point concept unclear.',
  },
  {
    id: 'therm-5',
    title: 'Thermodynamics (Laws & Heat Engines)',
    category: 'Thermal Physics',
    catKey: 'thermal',
    color: 'amber',
    prereqs: ['therm-4'],
    hours: 14,
    weightage: '6%',
    description: '1st & 2nd laws of thermodynamics, PV diagrams, Carnot engine efficiency.',
    downstreamIds: ['therm-6'],
    initialStatus: 'completed',
    lastCheckInNote: 'Completed all formulas and exercises.',
  },
  {
    id: 'waves-1',
    title: 'Waves & Sound',
    category: 'Waves & Optics',
    catKey: 'waves',
    color: 'green',
    prereqs: ['mech-9'],
    hours: 14,
    weightage: '5%',
    description: 'Wave equation, Doppler effect, beats, standing waves in organ pipes.',
    downstreamIds: ['waves-2', 'waves-3'],
    initialStatus: 'at_risk',
    lastCheckInNote: 'Doppler effect relative velocity sign conventions causing errors.',
  },
  {
    id: 'mod-1',
    title: 'Dual Nature of Matter & Photoelectric Effect',
    category: 'Modern Physics',
    catKey: 'modern',
    color: 'teal',
    prereqs: ['waves-3', 'em-9'],
    hours: 10,
    weightage: '4%',
    description: 'Photons, Einstein photoelectric equation, de Broglie wavelength.',
    downstreamIds: ['mod-2', 'mod-3', 'mod-5'],
    initialStatus: 'completed',
    lastCheckInNote: 'Good grip on photoelectric graph problems.',
  },
];

export default function RecoverPage() {
  // State for tracking chapter statuses (user check-in modifications)
  const [chapters, setChapters] = useState(PHYSICS_CHAPTERS);
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'backlog' | 'at_risk'
  const [toastMessage, setToastMessage] = useState(null);

  // Map for title lookups
  const chapterMap = useMemo(() => {
    const map = new Map();
    chapters.forEach((ch) => map.set(ch.id, ch));
    return map;
  }, [chapters]);

  // Compute Priority & Sorting
  // Priorities are sorted by:
  // 1. Total downstream connections (chapters that rely on this one) + total prereqs = Highest Connections First!
  // 2. Status weight (Backlog > At Risk)
  const prioritizedIssues = useMemo(() => {
    const issues = chapters.filter(
      (ch) => ch.initialStatus === 'backlog' || ch.initialStatus === 'at_risk'
    );

    const sorted = [...issues].sort((a, b) => {
      // Metric 1: Total connections (downstream dependent count + prereq count)
      const aConn = a.downstreamIds.length * 2 + a.prereqs.length;
      const bConn = b.downstreamIds.length * 2 + b.prereqs.length;

      if (bConn !== aConn) {
        return bConn - aConn; // Highest connections first!
      }

      // Metric 2: Backlog over At Risk
      if (a.initialStatus === 'backlog' && b.initialStatus === 'at_risk') return -1;
      if (a.initialStatus === 'at_risk' && b.initialStatus === 'backlog') return 1;

      // Metric 3: Hours required
      return b.hours - a.hours;
    });

    return sorted;
  }, [chapters]);

  // Filtered issues based on user tab
  const filteredList = useMemo(() => {
    if (filterCategory === 'backlog') {
      return prioritizedIssues.filter((ch) => ch.initialStatus === 'backlog');
    }
    if (filterCategory === 'at_risk') {
      return prioritizedIssues.filter((ch) => ch.initialStatus === 'at_risk');
    }
    return prioritizedIssues;
  }, [prioritizedIssues, filterCategory]);

  // Statistics
  const backlogCount = useMemo(
    () => chapters.filter((c) => c.initialStatus === 'backlog').length,
    [chapters]
  );
  const atRiskCount = useMemo(
    () => chapters.filter((c) => c.initialStatus === 'at_risk').length,
    [chapters]
  );
  const highestImpactChapter = prioritizedIssues[0];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateStatus = (chapterId, newStatus) => {
    setChapters((prev) =>
      prev.map((ch) => (ch.id === chapterId ? { ...ch, initialStatus: newStatus } : ch))
    );
    if (newStatus === 'completed') {
      showToast('🎉 Chapter marked as Completed & Recovered! Dynamic priority updated.');
    } else {
      showToast(`Status updated to ${newStatus === 'backlog' ? '🔴 Backlog' : '🟡 At Risk'}`);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800 font-['Inter'] pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800 animate-bounce max-w-md">
          <span className="text-emerald-400 font-bold text-lg">✓</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Navbar with Centered NavLinks */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between relative shadow-xs">
        <div className="flex items-center gap-4">
          <Link to="/" className="group flex items-center">
            <span className="font-cursive text-4xl sm:text-5xl font-bold text-slate-900 tracking-wide hover:scale-105 transition-transform duration-200">
              Prereq
            </span>
          </Link>
        </div>

        {/* Centered Horizontal NavLinks */}
        <nav className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80 shadow-2xs sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          <NavLink
            to="/graph"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`
            }
          >
            🗺️ Dependency Graph
          </NavLink>
          <NavLink
            to="/recover"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`
            }
          >
            🚨 Recovery Plan
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`
            }
          >
            ⚙️ Profile & Check-in
          </NavLink>
        </nav>

        <div className="flex items-center">
          <Link
            to="/login"
            className="text-xs sm:text-sm font-extrabold text-slate-600 hover:text-rose-600 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-rose-300 hover:bg-rose-50/80 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Logout</span>
            <span className="text-xs">🚪</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Page Hero Header */}
        <div className="mb-8 text-left space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            At Risk & Backlog Recovery Plan
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl font-medium">
            Chapters with the <strong>highest downstream prerequisite connections</strong> are placed at the top of your recovery list. Clearing these high priority chapters first will unblock multiple future topics!
          </p>
        </div>

        {/* SECTION 1: STATS & SUMMARY DASHBOARD (Pastel Card System matching Profile Page) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          
          {/* Card 1: Backlog & At Risk Count */}
          <div className="bg-[#dcfce7] rounded-3xl p-6 shadow-xl shadow-emerald-900/10 border-2 border-emerald-300/80 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-extrabold uppercase tracking-wider text-emerald-950">
                Identified Issues
              </span>
              <span className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center text-sm font-bold">
                ⚠️
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[32px] font-extrabold text-emerald-950">{prioritizedIssues.length}</span>
              <span className="text-[13px] font-bold text-emerald-800">
                ({backlogCount} Backlog, {atRiskCount} At-Risk)
              </span>
            </div>
            <p className="text-[12px] font-semibold text-emerald-800">
              Needs recovery based on prerequisite priority
            </p>
          </div>

          {/* Card 2: Highest Priority Bottleneck */}
          <div className="bg-[#f3e8ff] rounded-3xl p-6 shadow-xl shadow-purple-900/10 border-2 border-purple-300/80 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-extrabold uppercase tracking-wider text-purple-950">
                #1 Top Priority
              </span>
              <span className="w-8 h-8 rounded-xl bg-purple-200 text-purple-900 flex items-center justify-center text-sm font-bold">
                🎯
              </span>
            </div>
            <div>
              <h3 className="text-[19px] font-extrabold text-purple-950 truncate">
                {highestImpactChapter ? highestImpactChapter.title : 'All Clear!'}
              </h3>
              <p className="text-[13px] font-bold text-purple-800">
                {highestImpactChapter
                  ? `Blocks ${highestImpactChapter.downstreamIds.length} downstream chapters`
                  : 'No active backlog'}
              </p>
            </div>
            <p className="text-[12px] font-semibold text-purple-800">
              Highest prerequisite priority rank
            </p>
          </div>

        </div>

        {/* SECTION 3: PRIORITY CHAPTER RECOVERY LIST */}
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Ordered Recovery List
            </h2>

            {/* Subtle Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 rounded-xl text-[13px] font-extrabold transition-all cursor-pointer ${
                  filterCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({prioritizedIssues.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('backlog')}
                className={`px-3 py-1 rounded-xl text-[13px] font-extrabold transition-all cursor-pointer ${
                  filterCategory === 'backlog'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔴 Backlog ({backlogCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('at_risk')}
                className={`px-3 py-1 rounded-xl text-[13px] font-extrabold transition-all cursor-pointer ${
                  filterCategory === 'at_risk'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🟡 At Risk ({atRiskCount})
              </button>
            </div>
          </div>

          {filteredList.length === 0 ? (
            <div className="p-10 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-3 shadow-xs">
              <div className="text-4xl">🎉</div>
              <h3 className="text-lg font-extrabold text-emerald-950">No Pending Recovery Chapters!</h3>
              <p className="text-[13px] font-semibold text-emerald-800 max-w-md mx-auto">
                All physics chapters are currently marked as completed or on track in your check-in system. Great job staying ahead!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredList.map((chapter, index) => {
                const totalConnections = chapter.downstreamIds.length + chapter.prereqs.length;
                const isTopPriority = index === 0;

                return (
                  <div
                    key={chapter.id}
                    className={`rounded-3xl p-6 sm:p-7 border-2 transition-all duration-300 shadow-md relative overflow-hidden group ${
                      chapter.initialStatus === 'backlog'
                        ? 'bg-[#fff1f2] border-rose-300 hover:bg-[#ffe4e6] hover:border-rose-500 hover:shadow-xl hover:shadow-rose-900/15 hover:-translate-y-0.5'
                        : 'bg-[#fef7d8] border-amber-300 hover:bg-[#fef08a] hover:border-amber-500 hover:shadow-xl hover:shadow-amber-900/15 hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Priority Rank Ribbon Badge & Status Tags */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-3.5 py-1.5 rounded-xl text-[13px] font-black shadow-xs flex items-center gap-1.5 ${
                            isTopPriority
                              ? 'bg-slate-900 text-white ring-2 ring-purple-400'
                              : 'bg-white text-slate-900 border border-slate-300'
                          }`}
                        >
                          <span>#{index + 1}</span>
                          {isTopPriority && (
                            <span className="bg-amber-400 text-slate-950 text-[11px] px-1.5 rounded font-black">
                              TOP PRIORITY
                            </span>
                          )}
                        </span>

                        <span
                          className={`px-3.5 py-1.5 rounded-xl text-[13px] uppercase tracking-wide border shadow-xs ${
                            chapter.initialStatus === 'backlog'
                              ? 'bg-red-500 text-white border-red-600 shadow-red-500/20 font-black'
                              : 'bg-amber-400 text-amber-950 border-amber-500 shadow-amber-500/20 font-black'
                          }`}
                        >
                          {chapter.initialStatus === 'backlog' ? '🔴 Backlog' : '🟡 At Risk'}
                        </span>

                        <span className={`px-3 py-1.5 rounded-xl border text-[13px] shadow-2xs ${
                          chapter.color === 'purple' ? 'bg-purple-100 border-purple-300 text-purple-950 font-extrabold' :
                          chapter.color === 'blue' ? 'bg-blue-100 border-blue-300 text-blue-950 font-extrabold' :
                          chapter.color === 'rose' ? 'bg-rose-100 border-rose-300 text-rose-950 font-extrabold' :
                          chapter.color === 'amber' ? 'bg-amber-100 border-amber-300 text-amber-950 font-extrabold' :
                          chapter.color === 'green' ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-extrabold' :
                          'bg-teal-100 border-teal-300 text-teal-950 font-extrabold'
                        }`}>
                          {chapter.category}
                        </span>
                      </div>

                      {/* Connection Score Pill */}
                      <span className="px-3.5 py-1.5 rounded-2xl bg-purple-200 border border-purple-300 text-purple-950 font-extrabold text-[13px] flex items-center gap-1.5 shadow-2xs group-hover:bg-purple-300 transition-colors">
                        <span>🔗 {totalConnections} Connected Topics</span>
                        <span className="text-[11px] text-purple-900 font-bold">({chapter.downstreamIds.length} Downstream)</span>
                      </span>
                    </div>

                    {/* Chapter Title & Meta */}
                    <div className="space-y-2 mb-5">
                      <h3 className="text-[21px] font-extrabold text-slate-900 tracking-tight">
                        {chapter.title}
                      </h3>
                      <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                        {chapter.description}
                      </p>
                    </div>

                    {/* Downstream & Prerequisite Connection Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      
                      {/* Downstream Impact List */}
                      <div className="p-3.5 rounded-2xl bg-purple-50/90 border border-purple-200 space-y-1.5">
                        <span className="text-[12px] font-extrabold uppercase tracking-wider text-purple-950 flex items-center gap-1">
                          <span>⚡ Blocks Downstream Topics:</span>
                          <span className="bg-purple-200 text-purple-950 px-1.5 py-0.5 rounded font-black text-[12px]">
                            {chapter.downstreamIds.length}
                          </span>
                        </span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {chapter.downstreamIds.map((downId) => {
                            const downCh = chapterMap.get(downId);
                            return (
                              <span
                                key={downId}
                                className="px-2.5 py-1 rounded-xl bg-white border border-purple-300 text-purple-950 font-bold text-[12px] shadow-2xs"
                              >
                                {downCh ? downCh.title : downId}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Prerequisites List */}
                      <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-1.5">
                        <span className="text-[12px] font-extrabold uppercase tracking-wider text-amber-950 flex items-center gap-1">
                          <span>⬅️ Required Prerequisites:</span>
                          <span className="bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded font-black text-[12px]">
                            {chapter.prereqs.length}
                          </span>
                        </span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {chapter.prereqs.map((prereqId) => {
                            const prereqCh = chapterMap.get(prereqId);
                            return (
                              <span
                                key={prereqId}
                                className="px-2.5 py-1 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold text-[12px] shadow-2xs"
                              >
                                {prereqCh ? prereqCh.title : prereqId}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-900/10 gap-3">
                      <div className="flex items-center gap-3 text-[13px] font-bold text-slate-700">
                        <span>🎯 JEE Weight: {chapter.weightage}</span>
                      </div>

                      <div className="flex items-center gap-2.5 justify-end">
                        <Link
                          to="/graph"
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[13px] shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Inspect Graph 🗺️</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
