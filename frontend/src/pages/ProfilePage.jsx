import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  // 1. Contact Details State
  const [fullName, setFullName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('+91 98765 43210');

  // Single Active Schedule State (Requirement #7: Only one active schedule for MVP)
  const [hasActiveSchedule, setHasActiveSchedule] = useState(true);
  const [activeScheduleName, setActiveScheduleName] = useState('Allen Physics Nurture Batch Schedule');
  const [isReplacingSchedule, setIsReplacingSchedule] = useState(false);

  // 2. Coaching Schedule Mode: 'upload' (Option 1) vs 'manual' (Option 2)
  const [scheduleOption, setScheduleOption] = useState('upload'); // 'upload' | 'manual'

  // Option 1: File Upload & Review State
  const [scheduleFile, setScheduleFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle' | 'parsing' | 'extracted' | 'confirmed'
  const [extractedChapters, setExtractedChapters] = useState([
    { id: 101, chapter: 'Kinematics & Motion in 2D', deadline: '2026-09-10', hours: 12 },
    { id: 102, chapter: "Newton's Laws of Motion & Friction", deadline: '2026-09-18', hours: 14 },
    { id: 103, chapter: 'Work, Power & Energy', deadline: '2026-09-25', hours: 10 },
    { id: 104, chapter: 'Rotational Motion & System of Particles', deadline: '2026-10-05', hours: 18 },
    { id: 105, chapter: 'Thermodynamics & Kinetic Theory', deadline: '2026-10-15', hours: 16 },
    { id: 106, chapter: 'Electrostatics & Current Electricity', deadline: '2026-10-28', hours: 20 },
  ]);

  // Option 2: Manual Entry Form State
  const presetPhysicsChapters = [
    'Kinematics & Motion in 2D',
    "Newton's Laws of Motion & Friction",
    'Work, Energy & Power',
    'Rotational Motion & System of Particles',
    'Gravitation',
    'Fluid Mechanics & Properties of Matter',
    'Thermodynamics & Kinetic Theory',
    'Oscillations & Waves',
    'Electrostatics & Capacitance',
    'Current Electricity & Magnetism',
    'Electromagnetic Induction & AC',
    'Ray & Wave Optics',
    'Modern Physics & Atomic Structure',
    'Custom Chapter...',
  ];

  const [manualChapter, setManualChapter] = useState('Kinematics & Motion in 2D');
  const [customChapterName, setCustomChapterName] = useState('');
  const [manualDeadline, setManualDeadline] = useState('2026-09-15');
  const [manualHours, setManualHours] = useState(12);

  // Confirmed Final Physics Schedule State
  const [physicsDeadlines, setPhysicsDeadlines] = useState([
    { id: 1, chapter: 'Kinematics & Motion in 2D', deadline: '2026-09-10', hours: 12 },
    { id: 2, chapter: "Newton's Laws of Motion & Friction", deadline: '2026-09-18', hours: 14 },
    { id: 3, chapter: 'Work, Power & Energy', deadline: '2026-09-25', hours: 10 },
  ]);

  const [isScheduleConfirmed, setIsScheduleConfirmed] = useState(true);

  // 3. WhatsApp Check-in Time State (Requirement #12: Default check-in time set to 8:00 PM)
  const [checkInTime, setCheckInTime] = useState('20:00'); // 8:00 PM (Default)
  const [customTime, setCustomTime] = useState('');

  // Toast & General State
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Sync WhatsApp number with Phone if sameAsPhone is checked
  const handlePhoneChange = (val) => {
    setPhone(val);
    if (sameAsPhone) {
      setWhatsappNumber(val);
    }
  };

  const handleSameAsPhoneToggle = (checked) => {
    setSameAsPhone(checked);
    if (checked) {
      setWhatsappNumber(phone);
    }
  };

  // Option 1: File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadStatus('parsing');
      setIsScheduleConfirmed(false);
      setTimeout(() => {
        setScheduleFile({
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          uploadDate: new Date().toLocaleDateString(),
          format: file.name.split('.').pop().toUpperCase(),
        });
        setUploadStatus('extracted');
        showToast('Schedule extracted! Please review and verify the dates below before saving.');
      }, 1200);
    }
  };

  // Handler for Confirming Extracted Upload Schedule
  const handleConfirmExtractedSchedule = () => {
    setPhysicsDeadlines([...extractedChapters]);
    setIsScheduleConfirmed(true);
    setUploadStatus('confirmed');
    setHasActiveSchedule(true);
    setActiveScheduleName(scheduleFile?.name ? `Uploaded (${scheduleFile.name})` : 'Uploaded Physics Schedule');
    setIsReplacingSchedule(false);
    showToast('✓ New schedule reviewed & set as active profile schedule!');
  };

  // Handlers for Extracted Table Editing
  const handleExtractedDeadlineChange = (id, newDate) => {
    setExtractedChapters((prev) =>
      prev.map((item) => (item.id === id ? { ...item, deadline: newDate } : item))
    );
  };

  const handleExtractedChapterNameChange = (id, newName) => {
    setExtractedChapters((prev) =>
      prev.map((item) => (item.id === id ? { ...item, chapter: newName } : item))
    );
  };

  const handleRemoveExtractedRow = (id) => {
    setExtractedChapters((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddRowToExtracted = () => {
    const newItem = {
      id: Date.now(),
      chapter: 'New Physics Chapter',
      deadline: '2026-10-30',
      hours: 10,
    };
    setExtractedChapters((prev) => [...prev, newItem]);
  };

  // Option 2: Add Next Chapter (Manual Flow)
  const handleAddNextChapter = (e) => {
    e.preventDefault();
    const finalChapterName = manualChapter === 'Custom Chapter...' ? customChapterName : manualChapter;
    if (!finalChapterName || !manualDeadline) return;

    const newItem = {
      id: Date.now(),
      chapter: finalChapterName,
      deadline: manualDeadline,
      hours: Number(manualHours) || 10,
    };

    setPhysicsDeadlines((prev) => [...prev, newItem]);
    setIsScheduleConfirmed(true);
    setHasActiveSchedule(true);
    setActiveScheduleName('Custom Manual Physics Schedule');
    setIsReplacingSchedule(false);

    // Reset inputs for next chapter
    if (manualChapter === 'Custom Chapter...') {
      setCustomChapterName('');
    }
    setManualDeadline('');
    showToast(`✓ Added "${finalChapterName}". Enter your next chapter below!`);
  };

  const handleRemoveManualChapter = (id) => {
    setPhysicsDeadlines((prev) => prev.filter((item) => item.id !== id));
    showToast('Chapter removed.');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (scheduleOption === 'upload' && uploadStatus === 'extracted' && !isScheduleConfirmed) {
      showToast('⚠️ Please click "Confirm & Apply Reviewed Schedule" before saving!');
      return;
    }
    setIsSaved(true);
    showToast('🎉 Profile successfully set! Check-in schedule active.');
  };

  const activeWhatsappNumber = sameAsPhone ? phone : whatsappNumber;

  const formattedTimeDisplay = (timeStr) => {
    if (!timeStr) return '08:00 PM';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12 < 10 ? '0' + hour12 : hour12}:${m} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-['Inter'] pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800 animate-bounce max-w-md">
          <span className="text-emerald-400 font-bold text-lg">✓</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight block leading-none">Prereq</span>
              <span className="text-[11px] font-semibold text-emerald-600">Student Profile Setup</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold">
            <span className={`w-2 h-2 rounded-full ${isSaved ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
            <span>Status: {isSaved ? 'Profile Active ⚡' : 'Setup In Progress'}</span>
          </div>

          <Link
            to="/login"
            className="text-xs font-semibold text-slate-600 hover:text-emerald-600 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Switch Account
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Hero Title Header */}
        <div className="mb-8 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
            <span>⚙️ Profile Settings</span>
            <span className="text-emerald-600">•</span>
            <span>Coaching Schedule & Check-in</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Set Up Your Student Profile
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-2xl">
            Configure your contact details, set your Physics chapter deadlines via schedule upload or manual entry, and choose your preferred WhatsApp check-in time.
          </p>
        </div>

        {/* Profile Setup Form */}
        <form onSubmit={handleSaveProfile} className="space-y-8">
          
          {/* SECTION 1: PERSONAL CONTACT DETAILS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-left space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                👤
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">1. Personal Contact Details</h2>
                <p className="text-xs text-slate-500">Your full name, email, and phone contact for automated alerts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.morgan@example.com"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* WhatsApp Number Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  WhatsApp Number <span className="text-rose-500">*</span>
                </label>

                {/* Checkbox: Same as Phone Number */}
                <div className="flex items-center gap-2.5 py-1">
                  <input
                    type="checkbox"
                    id="sameAsPhoneToggle"
                    checked={sameAsPhone}
                    onChange={(e) => handleSameAsPhoneToggle(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 rounded border-slate-300 cursor-pointer accent-emerald-600"
                  />
                  <label htmlFor="sameAsPhoneToggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Same as Phone Number
                  </label>
                </div>

                {!sameAsPhone && (
                  <input
                    type="tel"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Enter WhatsApp Number"
                    className="w-full px-4 py-3 rounded-2xl border border-emerald-300 bg-emerald-50/30 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all animate-fadeIn"
                  />
                )}
                {sameAsPhone && (
                  <p className="text-[11px] text-slate-400">
                    WhatsApp check-ins sent to: <span className="font-semibold text-slate-700">{phone}</span>
                  </p>
                )}
              </div>
            </div>
          </div>


          {/* SECTION 2: COACHING SCHEDULE PROVIDER */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-left space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                  📅
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">2. Coaching Schedule</h2>
                  <p className="text-xs text-slate-500">Only 1 active schedule supported at a time (Replace anytime)</p>
                </div>
              </div>

              {hasActiveSchedule && !isReplacingSchedule && (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  1 Active Schedule
                </span>
              )}
            </div>

            {/* REQUIREMENT #7: ACTIVE SCHEDULE SUMMARY & REPLACEMENT FLOW */}
            {hasActiveSchedule && !isReplacingSchedule ? (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Active Schedule</span>
                    <h3 className="text-sm font-bold text-slate-900">{activeScheduleName}</h3>
                    <p className="text-xs text-slate-500">{physicsDeadlines.length} Physics chapters active in nightly check-in tracker</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsReplacingSchedule(true)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <span>🔄 Replace Existing Schedule</span>
                  </button>
                </div>

                {/* Quick Chapter Summary Pills */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {physicsDeadlines.map((ch) => (
                    <span key={ch.id} className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-2xs">
                      {ch.chapter} (<span className="text-emerald-700 font-bold">{ch.deadline}</span>)
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              /* SCHEDULE UPLOAD / MANUAL CREATION FLOW */
              <div className="space-y-6 animate-fadeIn">
                {isReplacingSchedule && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900 font-medium">
                    <div className="flex items-center gap-2">
                      <span>⚠️</span>
                      <span>Creating or uploading a new schedule will replace your currently active schedule.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsReplacingSchedule(false)}
                      className="text-slate-600 hover:text-slate-900 underline font-semibold text-[11px]"
                    >
                      Cancel Replacement
                    </button>
                  </div>
                )}

                {/* Mode Selector Tabs (Option 1 vs Option 2) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100/70 border border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => setScheduleOption('upload')}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      scheduleOption === 'upload'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>📂 Option 1: Upload Schedule</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-semibold">Excel / CSV / PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScheduleOption('manual')}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      scheduleOption === 'manual'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>✍️ Option 2: Enter Manually</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-semibold">Chapter by Chapter</span>
                  </button>
                </div>

                {/* OPTION 1: UPLOAD SCHEDULE WORKFLOW */}
                {scheduleOption === 'upload' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                      <h3 className="text-xs font-bold text-indigo-900">Upload Coaching Timetable or Excel Map</h3>
                      <p className="text-xs text-indigo-700">
                        Upload your institute's PDF, Excel, or CSV schedule. <strong>Note:</strong> Extracted deadlines will be displayed below for your mandatory review before applying!
                      </p>
                    </div>

                    {/* Drag and Drop Uploader */}
                    <div className="relative border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 text-center transition-all bg-slate-50/40 hover:bg-emerald-50/30 group">
                      <input
                        type="file"
                        accept=".pdf,.xlsx,.xls,.csv"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                          📄
                        </div>
                        <p className="text-sm font-bold text-slate-800">
                          Click to upload schedule file <span className="text-slate-400 font-normal">or drag & drop</span>
                        </p>
                        <p className="text-xs text-slate-400">Supports Excel (.xlsx, .csv) and PDF files up to 10MB</p>
                      </div>
                    </div>

                    {uploadStatus === 'parsing' && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-3 text-xs font-semibold text-emerald-800">
                        <svg className="animate-spin h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Parsing schedule & extracting Physics chapter deadlines...</span>
                      </div>
                    )}

                    {/* MANDATORY REVIEW OF EXTRACTED SCHEDULE (Requirement #6) */}
                    {scheduleFile && (uploadStatus === 'extracted' || uploadStatus === 'confirmed') && (
                      <div className="space-y-4 pt-2">
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                          <span className="text-xl">⚠️</span>
                          <div className="space-y-0.5 text-xs text-amber-900">
                            <h4 className="font-bold">Review Uploaded Schedule</h4>
                            <p>
                              We never directly apply an extracted schedule without your verification. Please check, edit deadlines, or add missing Physics chapters below, then click <strong>"Confirm & Apply Reviewed Schedule"</strong>.
                            </p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl p-1.5 rounded-xl bg-white shadow-xs font-bold">📑</span>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">{scheduleFile.name}</h4>
                              <p className="text-[11px] text-slate-500">{scheduleFile.format} • {scheduleFile.size} • Extracted {extractedChapters.length} Physics chapters</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isScheduleConfirmed 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {isScheduleConfirmed ? '✓ Schedule Verified' : 'Review Required'}
                          </span>
                        </div>

                        {/* Interactive Review Table */}
                        <div className="space-y-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-200/80">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                              Extracted Chapters ({extractedChapters.length})
                            </span>
                            <button
                              type="button"
                              onClick={handleAddRowToExtracted}
                              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>+ Add Chapter Row</span>
                            </button>
                          </div>

                          {extractedChapters.map((item, idx) => (
                            <div
                              key={item.id}
                              className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                            >
                              <div className="flex items-center gap-3 flex-grow min-w-0">
                                <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                                <input
                                  type="text"
                                  value={item.chapter}
                                  onChange={(e) => handleExtractedChapterNameChange(item.id, e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                                />
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50">
                                  <span className="text-slate-400 font-semibold">📅 Deadline:</span>
                                  <input
                                    type="date"
                                    value={item.deadline}
                                    onChange={(e) => handleExtractedDeadlineChange(item.id, e.target.value)}
                                    className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveExtractedRow(item.id)}
                                  className="text-slate-400 hover:text-rose-600 font-bold text-xs px-2"
                                  title="Delete row"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={handleConfirmExtractedSchedule}
                            className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <span>✓ Confirm & Apply Reviewed Schedule</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}


                {/* OPTION 2: ENTER MANUALLY WORKFLOW */}
                {scheduleOption === 'manual' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                      <h3 className="text-xs font-bold text-emerald-900">Enter Physics Chapter Deadlines Manually</h3>
                      <p className="text-xs text-emerald-700">
                        Select a chapter, choose its target completion deadline, then click <strong>"Add Next Chapter"</strong> to build your schedule step-by-step.
                      </p>
                    </div>

                    {/* Chapter & Deadline Input Card */}
                    <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Select Chapter */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                            1. Select Chapter <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={manualChapter}
                            onChange={(e) => setManualChapter(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          >
                            {presetPhysicsChapters.map((ch) => (
                              <option key={ch} value={ch}>{ch}</option>
                            ))}
                          </select>
                        </div>

                        {/* Custom Chapter Name if selected */}
                        {manualChapter === 'Custom Chapter...' && (
                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                              Custom Chapter Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Center of Mass & Collisions"
                              value={customChapterName}
                              onChange={(e) => setCustomChapterName(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        )}

                        {/* Select Deadline */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                            2. Select Deadline Date <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="date"
                            required
                            value={manualDeadline}
                            onChange={(e) => setManualDeadline(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleAddNextChapter}
                          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                        >
                          <span>+ Add Next Chapter</span>
                        </button>
                      </div>
                    </div>

                    {/* Manually Added Chapter List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Your Scheduled Physics Chapters ({physicsDeadlines.length})
                        </h4>
                        <span className="text-[11px] text-slate-400">Chapters saved in sequential order</span>
                      </div>

                      {physicsDeadlines.length === 0 ? (
                        <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 text-xs">
                          No Physics chapters added yet. Select a chapter and deadline above to add your first milestone!
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {physicsDeadlines.map((item, idx) => (
                            <div
                              key={item.id}
                              className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between gap-3 shadow-xs"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-bold">
                                  {idx + 1}
                                </span>
                                <span className="text-xs font-bold text-slate-900">{item.chapter}</span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                                  📅 {item.deadline}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveManualChapter(item.id)}
                                  className="text-slate-400 hover:text-rose-600 font-bold text-sm px-1"
                                  title="Remove chapter"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>


          {/* SECTION 3: PREFERRED WHATSAPP CHECK-IN TIME */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-left space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                💬
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">3. Preferred WhatsApp Check-in Time</h2>
                <p className="text-xs text-slate-500">Automated nightly study progress prompt dispatch time</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Select Nightly Prompt Time
                </label>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                  Default: 08:00 PM
                </span>
              </div>

              {/* Requirement #12: Default check-in time 8:00 PM (20:00) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: '20:00', label: '08:00 PM (Default)' },
                  { id: '20:30', label: '08:30 PM' },
                  { id: '21:00', label: '09:00 PM' },
                  { id: '21:30', label: '09:30 PM' },
                  { id: '22:00', label: '10:00 PM' },
                ].map((t) => {
                  const isSelected = checkInTime === t.id && !customTime;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setCheckInTime(t.id);
                        setCustomTime('');
                      }}
                      className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Time Picker */}
              <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500">Or custom time:</span>
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => {
                      setCustomTime(e.target.value);
                      if (e.target.value) setCheckInTime(e.target.value);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  * If unconfigured, automatically defaults to 8:00 PM. Change anytime later in Settings.
                </p>
              </div>

              {/* Automated Check-in Live Message Preview */}
              <div className="mt-4 p-5 rounded-2xl bg-emerald-950 text-emerald-100 border border-emerald-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-emerald-800/80 pb-2">
                  <span>📱 Automated WhatsApp Prompt Preview</span>
                  <span className="bg-emerald-900 px-2.5 py-0.5 rounded-full text-[10px]">
                    Time: {formattedTimeDisplay(checkInTime)}
                  </span>
                </div>
                <p className="leading-relaxed">
                  "Hey <strong className="text-white">{fullName || 'Student'}</strong>! 🔔 It's {formattedTimeDisplay(checkInTime)}. Time for your nightly Physics study check-in! Did you complete your target chapter <strong className="text-white">'{physicsDeadlines[0]?.chapter || 'Kinematics & Motion in 2D'}'</strong> today?"
                </p>
                <div className="text-[11px] text-emerald-400 italic">
                  Sent to: <span className="font-semibold text-emerald-200">{activeWhatsappNumber}</span> • Reply "Yes", "Partial", or "No" to auto-log your progress.
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTON & SUBMIT */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900">Ready to save your profile?</h3>
              <p className="text-xs text-slate-500">Your Physics schedule and nightly check-in will be immediately active.</p>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Save & Activate Profile</span>
              <span>⚡</span>
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}
