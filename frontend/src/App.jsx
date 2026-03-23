import { useState, useEffect, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════════
   SVG ICON COMPONENTS (16×16, outline style)
   ═══════════════════════════════════════════════════════════════ */
const Ic = (p) => (
  <svg width={p.s || 16} height={p.s || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.w || 2} strokeLinecap="round" strokeLinejoin="round" style={p.style}>{p.children}</svg>
);
const IcCalendar = () => <Ic><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Ic>;
const IcSchedule = () => <Ic><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><circle cx="8" cy="14" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="14" r="1" fill="currentColor" stroke="none" /><circle cx="16" cy="14" r="1" fill="currentColor" stroke="none" /><circle cx="8" cy="18" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" /></Ic>;
const IcClock = () => <Ic><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Ic>;
const IcGear = () => <Ic><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></Ic>;
const IcBell = () => <Ic><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></Ic>;
const IcPlus = () => <Ic w={2.5}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Ic>;
const IcX = () => <Ic><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Ic>;
const IcCheck = () => <Ic w={2.5}><polyline points="20 6 9 17 4 12" /></Ic>;
const IcTrash = () => <Ic><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M10 11v6" /><path d="M14 11v6" /></Ic>;
const IcPill = () => <Ic><path d="M4.5 12.75L12.75 4.5a4.773 4.773 0 0 1 6.75 6.75l-8.25 8.25a4.773 4.773 0 0 1-6.75-6.75z" /><line x1="8.625" y1="8.625" x2="15.375" y2="15.375" /></Ic>;

/* ═══════════════════════════════════════════════════════════════
   CSS (injected via <style> tag)
   ═══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap');

:root {
  --white:#ffffff;--bg:#f8fafc;--bg2:#f1f5f9;--surface:#ffffff;
  --border:#e2e8f0;--border2:#cbd5e1;
  --text:#0f172a;--text2:#334155;--muted:#64748b;--muted2:#94a3b8;
  --blue:#0ea5e9;--blue-lt:#f0f9ff;
  --green:#10b981;--green-lt:#f0fdf4;
  --amber:#f59e0b;--amber-lt:#fffbeb;
  --red:#f43f5e;--red-lt:#fff1f2;
  --radius:14px;
  --shadow:0 1px 3px rgba(0,0,0,.06),0 4px 12px rgba(0,0,0,.04);
  --shadow-md:0 4px 16px rgba(0,0,0,.08),0 1px 4px rgba(0,0,0,.04);
  --shadow-lg:0 20px 48px rgba(0,0,0,.12);
  --font:'Plus Jakarta Sans',sans-serif;
  --font-serif:'Lora',serif;
}

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
body{font-family:var(--font);background:var(--bg);color:var(--text);min-height:100vh;}
button{cursor:pointer;font-family:var(--font);border:none;background:none;}
input,select{font-family:var(--font);outline:none;}

/* ── LAYOUT ── */
.app{display:grid;grid-template-columns:230px 1fr;min-height:100vh;}

/* ── SIDEBAR ── */
.sidebar{background:var(--white);border-right:1px solid var(--border);padding:24px 14px;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;}
.brand{display:flex;align-items:center;gap:10px;margin-bottom:24px;padding:0 4px;}
.brand-icon{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#0ea5e9,#6366f1);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.brand-name{font-size:17px;font-weight:800;color:var(--text);}
.nav-label{font-size:10.5px;font-weight:700;color:var(--muted2);text-transform:uppercase;letter-spacing:1px;padding:8px 12px 6px;margin-top:4px;}
.nav-items{display:flex;flex-direction:column;gap:2px;}
.nav-btn{display:flex;align-items:center;gap:9px;width:100%;padding:10px 12px;border-radius:10px;font-size:14px;font-weight:500;color:var(--muted);transition:all .15s ease;position:relative;}
.nav-btn:hover{background:var(--bg2);color:var(--text2);}
.nav-active{background:var(--blue-lt)!important;color:var(--blue)!important;font-weight:600!important;}
.nav-badge{margin-left:auto;background:var(--red);color:#fff;font-size:11px;font-weight:700;padding:2px 7px;border-radius:20px;line-height:1.3;}
.sidebar-spacer{flex:1;}
.patient-card{border:1px solid var(--border);border-radius:12px;padding:14px;background:var(--bg);display:flex;align-items:center;gap:10px;}
.patient-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#0ea5e9,#6366f1);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:700;flex-shrink:0;}
.patient-info{display:flex;flex-direction:column;}
.patient-name{font-size:13px;font-weight:700;color:var(--text);}
.patient-tag{font-size:11px;color:var(--blue);font-weight:600;}

/* ── MAIN AREA ── */
.main-area{display:flex;flex-direction:column;min-height:100vh;}

/* ── TOPBAR ── */
.topbar{background:var(--white);border-bottom:1px solid var(--border);padding:16px 32px;position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;}
.topbar-date{font-size:14px;font-weight:600;color:var(--text);}
.topbar-time{font-size:12px;color:var(--muted);margin-top:1px;}
.btn-add{display:flex;align-items:center;gap:7px;background:var(--blue);color:#fff;font-size:13.5px;font-weight:600;padding:9px 20px;border-radius:10px;transition:all .2s ease;}
.btn-add:hover{background:#0284c7;transform:translateY(-1px);box-shadow:0 6px 20px rgba(14,165,233,.3);}

/* ── MAIN CONTENT ── */
.main-content{flex:1;padding:28px 32px;overflow-y:auto;}

/* ── GREETING ── */
.greeting{background:linear-gradient(120deg,#f0f9ff 0%,#faf5ff 100%);border:1px solid #bfdbfe;border-radius:var(--radius);padding:22px 28px;display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.greeting-text{font-family:var(--font-serif);font-size:20px;font-weight:600;color:var(--text);}
.greeting-sub{font-size:13.5px;color:var(--muted);margin-top:5px;font-family:var(--font);}
.progress-ring{position:relative;width:80px;height:80px;flex-shrink:0;}
.progress-ring svg{transform:rotate(-90deg);}
.progress-label{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.progress-pct{font-size:17px;font-weight:800;color:var(--text);}
.progress-done{font-size:10px;color:var(--muted);font-weight:500;}

/* ── STATS ── */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;}
.stat-tile{border-radius:var(--radius);padding:18px 20px;border:1px solid transparent;transition:transform .2s ease;cursor:default;}
.stat-tile:hover{transform:translateY(-2px);}
.stat-val{font-size:28px;font-weight:800;font-family:var(--font-serif);}
.stat-lbl{font-size:12px;color:var(--muted);font-weight:500;margin-top:5px;}

/* ── NEXT DOSE ── */
.next-dose{background:var(--white);border:1.5px solid var(--blue);border-radius:var(--radius);padding:18px 22px;margin-bottom:20px;box-shadow:0 4px 16px rgba(14,165,233,.08);}
.next-dose-header{display:flex;align-items:center;gap:7px;margin-bottom:12px;color:var(--blue);}
.next-dose-label{font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--blue);}
.next-dose-body{display:flex;align-items:center;gap:14px;}
.next-dose-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.next-dose-info{flex:1;}
.next-dose-name{font-size:16px;font-weight:700;color:var(--text);}
.next-dose-meta{font-size:13px;color:var(--muted);margin-top:2px;}
.btn-take-now{background:var(--blue);color:#fff;font-size:13.5px;font-weight:700;padding:9px 22px;border-radius:9px;transition:all .2s ease;flex-shrink:0;}
.btn-take-now:hover{background:#0284c7;box-shadow:0 6px 18px rgba(14,165,233,.3);}

/* ── FILTER PILLS ── */
.filter-row{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;}
.filter-pill{padding:6px 14px;border-radius:20px;font-size:13px;font-weight:500;border:1px solid var(--border);background:var(--white);color:var(--muted);transition:all .15s ease;cursor:pointer;}
.filter-pill:hover{border-color:var(--border2);color:var(--text2);}
.filter-active{background:var(--blue-lt);border-color:#bae6fd;color:var(--blue);}

/* ── MED GROUPS ── */
.med-group{margin-bottom:20px;}
.med-group-header{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
.med-group-emoji{font-size:15px;}
.med-group-name{font-size:13px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;white-space:nowrap;}
.med-group-count{font-size:11px;color:var(--muted2);font-weight:600;white-space:nowrap;}
.med-group-line{flex:1;height:1px;background:var(--border);}
.med-list{display:flex;flex-direction:column;gap:8px;}

/* ── MED ROW ── */
.med-row{background:var(--white);border:1px solid var(--border);border-radius:12px;padding:14px 18px;display:flex;align-items:center;gap:14px;box-shadow:var(--shadow);transition:all .2s ease;}
.med-row:hover{border-color:var(--border2);box-shadow:var(--shadow-md);}
.med-row.taken{opacity:.55;background:var(--bg);}
.med-icon{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.med-info{flex:1;min-width:0;}
.med-name{font-size:15px;font-weight:700;color:var(--text);}
.med-meta{font-size:12.5px;color:var(--muted);margin-top:3px;}
.med-right{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.time-badge{font-size:13px;font-weight:600;color:var(--text2);background:var(--bg2);padding:4px 10px;border-radius:8px;}
.taken-chip{display:inline-flex;align-items:center;gap:4px;background:var(--green-lt);border:1px solid #bbf7d0;color:var(--green);font-size:12px;font-weight:600;padding:4px 10px;border-radius:20px;}
.action-btns{display:flex;gap:6px;}
.act-btn{width:32px;height:32px;border-radius:9px;border:1px solid var(--border);background:var(--white);color:var(--muted2);display:flex;align-items:center;justify-content:center;transition:all .15s ease;}
.act-btn:hover{border-color:var(--border2);}
.act-btn.check-done{background:var(--green-lt);border-color:#bbf7d0;color:var(--green);}
.act-btn.del:hover{background:var(--red-lt);border-color:#fecdd3;color:var(--red);}

@keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.03)}100%{transform:scale(1)}}
.celebrating{animation:pop .45s ease;}

/* ── SCHEDULE TABLE ── */
.page-title{font-family:var(--font-serif);font-size:22px;font-weight:600;color:var(--text);margin-bottom:4px;}
.page-sub{font-size:13.5px;color:var(--muted);margin-bottom:20px;}
.table-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
.table-header{display:grid;grid-template-columns:2fr 1fr 1.2fr 1.3fr 1fr;padding:12px 20px;background:var(--bg2);font-size:11.5px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;}
.table-row{display:grid;grid-template-columns:2fr 1fr 1.2fr 1.3fr 1fr;padding:14px 20px;border-bottom:1px solid var(--border);font-size:14px;align-items:center;transition:background .1s;}
.table-row:last-child{border-bottom:none;}
.table-row:hover{background:var(--bg);}
.table-name{font-weight:600;display:flex;align-items:center;gap:8px;}
.table-dosage{color:var(--muted);font-size:13px;}
.table-time{font-weight:600;color:var(--text2);}
.cat-tag{display:inline-block;font-size:12px;font-weight:600;padding:4px 10px;border-radius:20px;}
.status-chip{display:inline-flex;align-items:center;font-size:12px;font-weight:600;padding:4px 10px;border-radius:20px;}

/* ── HISTORY ── */
.chart-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px 14px;margin-bottom:20px;}
.chart-title{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:14px;}
.chart-bars{display:flex;height:120px;gap:0;}
.chart-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;}
.chart-bar-wrap{flex:1;width:100%;display:flex;align-items:flex-end;justify-content:center;}
.chart-bar{width:70%;border-radius:4px 4px 0 0;min-height:4px;transition:height .6s ease;}
.chart-pct{font-size:11px;font-weight:700;}
.chart-day{font-size:12px;color:var(--muted);font-weight:600;}
.activity-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
.activity-header{padding:16px 20px;font-size:13px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;border-bottom:1px solid var(--border);}
.activity-row{display:flex;align-items:center;gap:12px;padding:13px 20px;border-bottom:1px solid var(--border);}
.activity-row:last-child{border-bottom:none;}
.activity-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.activity-info{flex:1;display:flex;align-items:baseline;gap:8px;}
.activity-name{font-size:14px;font-weight:600;}
.activity-meta{font-size:12.5px;color:var(--muted);}
.activity-status{font-size:12px;font-weight:600;margin-left:auto;flex-shrink:0;}

/* ── SETTINGS ── */
.settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.settings-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:22px;}
.settings-card-title{font-size:14px;font-weight:700;color:var(--text);padding-bottom:14px;border-bottom:1px solid var(--border);margin-bottom:16px;}
.settings-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);}
.settings-row:last-child{border-bottom:none;}
.settings-key{font-size:13.5px;color:var(--muted);font-weight:500;}
.settings-val{font-size:13.5px;font-weight:600;color:var(--text2);}
.toggle{width:40px;height:22px;border-radius:11px;position:relative;cursor:pointer;transition:background .2s;border:none;flex-shrink:0;}
.toggle.off{background:#e2e8f0;}
.toggle.on{background:var(--blue);}
.toggle-knob{width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;top:3px;transition:left .2s;}
.toggle.off .toggle-knob{left:3px;}
.toggle.on .toggle-knob{left:21px;}

/* ── MODAL ── */
.modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,.4);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:100;animation:fadeIn .2s ease;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal-box{background:var(--white);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:30px;width:430px;max-width:95vw;box-shadow:var(--shadow-lg);animation:slideUp .25s ease;}
@keyframes slideUp{from{opacity:0;transform:translateY(20px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
.modal-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;}
.modal-title{font-family:var(--font-serif);font-size:20px;font-weight:600;color:var(--text);}
.modal-subtitle{font-size:13px;color:var(--muted);margin-top:3px;}
.modal-close{width:30px;height:30px;border-radius:8px;border:1px solid var(--border);background:var(--bg);display:flex;align-items:center;justify-content:center;color:var(--muted);transition:all .15s;}
.modal-close:hover{background:var(--bg2);color:var(--text);}
.form-fields{display:flex;flex-direction:column;gap:16px;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.form-group{display:flex;flex-direction:column;gap:6px;}
.form-label{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;}
.form-input{padding:10px 14px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);font-size:14px;color:var(--text);font-family:var(--font);transition:all .15s;}
.form-input:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(14,165,233,.1);}
.form-input::placeholder{color:var(--muted2);}
.btn-submit{width:100%;padding:12px;border-radius:11px;background:var(--blue);color:#fff;font-size:14.5px;font-weight:700;font-family:var(--font-serif);margin-top:8px;transition:all .2s;}
.btn-submit:hover{background:#0284c7;box-shadow:0 8px 24px rgba(14,165,233,.3);}

/* ── TOAST ── */
.toast{position:fixed;bottom:24px;right:24px;background:var(--white);border:1px solid var(--border);border-radius:12px;padding:13px 18px;font-size:14px;font-weight:500;box-shadow:var(--shadow-lg);max-width:300px;z-index:200;animation:toastIn .3s ease;}
@keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.toast-ok{border-left:3px solid var(--green);}
.toast-warn{border-left:3px solid var(--amber);}

/* ── EMPTY STATE ── */
.empty-state{text-align:center;padding:48px 20px;color:var(--muted);}
.empty-icon{font-size:40px;margin-bottom:10px;display:block;}
.empty-text{font-size:14px;}
`;

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
const CAT_COLORS = {
  Diabetes: '#0ea5e9', Heart: '#f43f5e', Supplement: '#8b5cf6',
  'Blood Pressure': '#f59e0b', Antibiotic: '#10b981', Other: '#94a3b8'
};
const CATEGORIES = ['All', 'Diabetes', 'Heart', 'Supplement', 'Blood Pressure', 'Antibiotic', 'Other'];
const INIT_MEDS = [
  { id: 1, name: 'Metformin', dosage: '500mg', time: '08:00', category: 'Diabetes', taken: true, color: '#0ea5e9', icon: '💊' },
  { id: 2, name: 'Aspirin', dosage: '100mg', time: '13:00', category: 'Heart', taken: false, color: '#f43f5e', icon: '❤️' },
  { id: 3, name: 'Vitamin D', dosage: '1000IU', time: '09:30', category: 'Supplement', taken: true, color: '#8b5cf6', icon: '☀️' },
  { id: 4, name: 'Lisinopril', dosage: '10mg', time: '20:00', category: 'Blood Pressure', taken: false, color: '#f59e0b', icon: '🩺' },
  { id: 5, name: 'Omega-3', dosage: '1000mg', time: '21:00', category: 'Supplement', taken: false, color: '#10b981', icon: '🐟' },
];
const ICONS_MAP = { 'Diabetes': '💊', 'Heart': '❤️', 'Supplement': '☀️', 'Blood Pressure': '🩺', 'Antibiotic': '💉', 'Other': '💊' };

function fmtTime(t) {
  const [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ap}`;
}
function getTimeGroup(t) {
  const h = parseInt(t.split(':')[0], 10);
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  if (h < 20) return 'Evening';
  return 'Night';
}
const GROUP_EMOJI = { Morning: '🌅', Afternoon: '☀️', Evening: '🌇', Night: '🌙' };
const GROUP_ORDER = ['Morning', 'Afternoon', 'Evening', 'Night'];

/* ═══════════════════════════════════════════════════════════════
   APP COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [meds, setMeds] = useState(INIT_MEDS);
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState('today');
  const [toast, setToast] = useState(null);
  const [celebrating, setCelebrating] = useState(null);
  const [form, setForm] = useState({ name: '', dosage: '', time: '', category: 'Other' });
  const [settings, setSettings] = useState({ emailReminder: true, pushNotif: true, smsAlert: false, dailySummary: true });
  const [now, setNow] = useState(new Date());

  // live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  // escape to close modal
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setModal(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── derived ──
  const taken = meds.filter(m => m.taken).length;
  const total = meds.length;
  const pct = total ? Math.round((taken / total) * 100) : 0;
  const remaining = total - taken;
  const nextMed = meds.filter(m => !m.taken).sort((a, b) => a.time.localeCompare(b.time))[0] || null;
  const filtered = filter === 'All' ? meds : meds.filter(m => m.category === filter);
  const grouped = filtered.reduce((acc, m) => {
    const g = getTimeGroup(m.time);
    if (!acc[g]) acc[g] = [];
    acc[g].push(m);
    return acc;
  }, {});

  // ── greeting ──
  const hour = now.getHours();
  const greetEmoji = hour < 12 ? '🌤️' : hour < 18 ? '☀️' : '🌙';
  const greetText = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // ── handlers ──
  const showToast = (msg, type = 'ok') => setToast({ msg, type });

  const toggleTaken = useCallback((id) => {
    setMeds(prev => prev.map(m => {
      if (m.id !== id) return m;
      const next = !m.taken;
      if (next) {
        setCelebrating(id);
        setTimeout(() => setCelebrating(null), 500);
        showToast(`✅ ${m.name} marked as taken`, 'ok');
      } else {
        showToast(`↩️ ${m.name} marked as pending`, 'warn');
      }
      return { ...m, taken: next };
    }));
  }, []);

  const deleteMed = useCallback((id) => {
    const m = meds.find(x => x.id === id);
    setMeds(prev => prev.filter(x => x.id !== id));
    if (m) showToast(`🗑️ ${m.name} removed`, 'warn');
  }, [meds]);

  const addMed = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.dosage.trim() || !form.time) return;
    const color = CAT_COLORS[form.category] || '#94a3b8';
    const icon = ICONS_MAP[form.category] || '💊';
    const newMed = {
      id: Date.now(), name: form.name.trim(), dosage: form.dosage.trim(),
      time: form.time, category: form.category, taken: false, color, icon
    };
    setMeds(prev => [...prev, newMed]);
    setForm({ name: '', dosage: '', time: '', category: 'Other' });
    setModal(false);
    showToast(`💊 ${newMed.name} added successfully`, 'ok');
  };

  const toggleSetting = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  // ── date strings ──
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  // ── progress arc ──
  const R = 32, C = 2 * Math.PI * R;
  const arcStroke = C - (pct / 100) * C;

  // ── history chart ──
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartData = [100, 80, 100, 60, 100, 100, pct];
  const maxChart = 100;
  const barColor = (v) => v === 100 ? '#10b981' : v >= 70 ? '#0ea5e9' : '#f43f5e';

  /* ═══════════════════════════════════════════════════════════
     RENDER PAGES
     ═══════════════════════════════════════════════════════════ */
  const renderToday = () => (
    <>
      {/* Greeting */}
      <div className="greeting">
        <div>
          <div className="greeting-text">{greetEmoji} {greetText}, Jane</div>
          <div className="greeting-sub">
            {pct === 100 ? 'All medicines taken today — great job! 🎉' : `You have ${remaining} medicine(s) remaining today.`}
          </div>
        </div>
        <div className="progress-ring">
          <svg width="80" height="80">
            <circle cx="40" cy="40" r={R} stroke="#e2e8f0" strokeWidth="7" fill="none" />
            <circle cx="40" cy="40" r={R} stroke={pct === 100 ? 'var(--green)' : 'var(--blue)'} strokeWidth="7" fill="none"
              strokeLinecap="round" strokeDasharray={`${C} ${C}`} strokeDashoffset={arcStroke}
              style={{ transition: 'stroke-dasharray .7s ease,stroke-dashoffset .7s ease' }} />
          </svg>
          <div className="progress-label">
            <span className="progress-pct">{pct}%</span>
            <span className="progress-done">done</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: 'Total Today', val: total, accent: '#0ea5e9', bg: '#f0f9ff' },
          { label: 'Taken', val: taken, accent: '#10b981', bg: '#f0fdf4' },
          { label: 'Remaining', val: remaining, accent: '#f59e0b', bg: '#fffbeb' },
          { label: 'Adherence', val: `${pct}%`, accent: '#8b5cf6', bg: '#faf5ff' },
        ].map(s => (
          <div key={s.label} className="stat-tile" style={{ background: s.bg, borderColor: `color-mix(in srgb,${s.accent} 20%,transparent)` }}>
            <div className="stat-val" style={{ color: s.accent }}>{s.val}</div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Next Dose */}
      {nextMed && (
        <div className="next-dose">
          <div className="next-dose-header"><IcBell /><span className="next-dose-label">Next Dose</span></div>
          <div className="next-dose-body">
            <div className="next-dose-icon" style={{ background: `color-mix(in srgb,${nextMed.color} 18%,transparent)` }}>{nextMed.icon}</div>
            <div className="next-dose-info">
              <div className="next-dose-name">{nextMed.name}</div>
              <div className="next-dose-meta">{nextMed.dosage} · {fmtTime(nextMed.time)}</div>
            </div>
            <button className="btn-take-now" onClick={() => toggleTaken(nextMed.id)}>Take Now</button>
          </div>
        </div>
      )}

      {/* Filter Pills */}
      <div className="filter-row">
        {CATEGORIES.map(c => (
          <button key={c} className={`filter-pill${filter === c ? ' filter-active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      {/* Medicine Groups */}
      {GROUP_ORDER.map(g => {
        const items = (grouped[g] || []).sort((a, b) => a.time.localeCompare(b.time));
        if (!items.length) return null;
        return (
          <div key={g} className="med-group">
            <div className="med-group-header">
              <span className="med-group-emoji">{GROUP_EMOJI[g]}</span>
              <span className="med-group-name">{g}</span>
              <span className="med-group-count">{items.length} med{items.length > 1 ? 's' : ''}</span>
              <div className="med-group-line" />
            </div>
            <div className="med-list">
              {items.map(m => (
                <div key={m.id} className={`med-row${m.taken ? ' taken' : ''}${celebrating === m.id ? ' celebrating' : ''}`}>
                  <div className="med-icon" style={{
                    background: `color-mix(in srgb,${m.color} 15%,transparent)`,
                    border: `1.5px solid color-mix(in srgb,${m.color} 30%,transparent)`
                  }}>{m.icon}</div>
                  <div className="med-info">
                    <div className="med-name">{m.name}</div>
                    <div className="med-meta">{m.dosage} · {m.category} · {fmtTime(m.time)}</div>
                  </div>
                  <div className="med-right">
                    {m.taken
                      ? <span className="taken-chip">✓ Taken</span>
                      : <span className="time-badge">{fmtTime(m.time)}</span>
                    }
                    <div className="action-btns">
                      <button className={`act-btn${m.taken ? ' check-done' : ''}`} onClick={() => toggleTaken(m.id)} title={m.taken ? 'Undo' : 'Mark taken'}><IcCheck /></button>
                      <button className="act-btn del" onClick={() => deleteMed(m.id)} title="Delete"><IcTrash /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {filtered.length === 0 && (
        <div className="empty-state"><span className="empty-icon">💊</span><div className="empty-text">No medicines found for this filter.</div></div>
      )}
    </>
  );

  const renderSchedule = () => {
    const sorted = [...meds].sort((a, b) => a.time.localeCompare(b.time));
    return (
      <>
        <div className="page-title">Schedule</div>
        <div className="page-sub">Your complete medication schedule for today</div>
        <div className="table-card">
          <div className="table-header"><span>Medicine</span><span>Dosage</span><span>Time</span><span>Category</span><span>Status</span></div>
          {sorted.map(m => (
            <div key={m.id} className="table-row">
              <span className="table-name"><span>{m.icon}</span>{m.name}</span>
              <span className="table-dosage">{m.dosage}</span>
              <span className="table-time">{fmtTime(m.time)}</span>
              <span><span className="cat-tag" style={{
                background: `color-mix(in srgb,${m.color} 12%,transparent)`,
                border: `1px solid color-mix(in srgb,${m.color} 25%,transparent)`,
                color: m.color
              }}>{m.category}</span></span>
              <span>{m.taken
                ? <span className="status-chip" style={{ background: 'var(--green-lt)', border: '1px solid #bbf7d0', color: 'var(--green)' }}>✓ Taken</span>
                : <span className="status-chip" style={{ background: 'var(--amber-lt)', border: '1px solid #fde68a', color: 'var(--amber)' }}>Pending</span>
              }</span>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderHistory = () => {
    const sorted = [...meds].sort((a, b) => a.time.localeCompare(b.time));
    return (
      <>
        <div className="page-title">History</div>
        <div className="page-sub">Your medication adherence over the past week</div>
        <div className="chart-card">
          <div className="chart-title">Weekly Adherence</div>
          <div className="chart-bars">
            {chartData.map((v, i) => (
              <div key={i} className="chart-col">
                <div className="chart-pct" style={{ color: barColor(v) }}>{v}%</div>
                <div className="chart-bar-wrap">
                  <div className="chart-bar" style={{ height: `${(v / maxChart) * 100}%`, background: barColor(v) }} />
                </div>
                <div className="chart-day">{dayNames[i]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="activity-card">
          <div className="activity-header">Recent Activity</div>
          {sorted.map(m => (
            <div key={m.id} className="activity-row">
              <div className="activity-dot" style={{ background: m.taken ? 'var(--green)' : '#e2e8f0' }} />
              <div className="activity-info">
                <span className="activity-name">{m.name}</span>
                <span className="activity-meta">{m.dosage} · {fmtTime(m.time)}</span>
              </div>
              <span className="activity-status" style={{ color: m.taken ? 'var(--green)' : 'var(--muted2)' }}>{m.taken ? 'Taken' : 'Pending'}</span>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderSettings = () => (
    <>
      <div className="page-title">Settings</div>
      <div className="page-sub">Manage your profile and notification preferences</div>
      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-card-title">Profile Information</div>
          {[
            ['Name', 'Jane Doe'], ['Email', 'jane.doe@email.com'], ['Phone', '+1 (555) 123-4567'],
            ['Doctor', 'Dr. Sarah Wilson'], ['Plan', 'Premium']
          ].map(([k, v]) => (
            <div key={k} className="settings-row"><span className="settings-key">{k}</span><span className="settings-val">{v}</span></div>
          ))}
        </div>
        <div className="settings-card">
          <div className="settings-card-title">Notifications</div>
          {[
            ['Email Reminder', 'emailReminder'], ['Push Notifications', 'pushNotif'],
            ['SMS Alerts', 'smsAlert'], ['Daily Summary', 'dailySummary']
          ].map(([label, key]) => (
            <div key={key} className="settings-row">
              <span className="settings-key">{label}</span>
              <button className={`toggle ${settings[key] ? 'on' : 'off'}`} onClick={() => toggleSetting(key)}>
                <div className="toggle-knob" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  /* ═══════════════════════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon"><IcPill style={{ color: '#fff' }} /></div>
            <span className="brand-name">MedCare</span>
          </div>
          <div className="nav-label">Menu</div>
          <div className="nav-items">
            <button className={`nav-btn${page === 'today' ? ' nav-active' : ''}`} onClick={() => setPage('today')}>
              <IcCalendar />Today
              {remaining > 0 && <span className="nav-badge">{remaining}</span>}
            </button>
            <button className={`nav-btn${page === 'schedule' ? ' nav-active' : ''}`} onClick={() => setPage('schedule')}><IcSchedule />Schedule</button>
            <button className={`nav-btn${page === 'history' ? ' nav-active' : ''}`} onClick={() => setPage('history')}><IcClock />History</button>
            <button className={`nav-btn${page === 'settings' ? ' nav-active' : ''}`} onClick={() => setPage('settings')}><IcGear />Settings</button>
          </div>
          <div className="sidebar-spacer" />
          <div className="patient-card">
            <div className="patient-avatar">JD</div>
            <div className="patient-info">
              <span className="patient-name">Jane Doe</span>
              <span className="patient-tag">Patient · Premium</span>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="main-area">
          <div className="topbar">
            <div>
              <div className="topbar-date">{dateStr}</div>
              <div className="topbar-time">{timeStr}</div>
            </div>
            {page === 'today' && (
              <button className="btn-add" onClick={() => setModal(true)}><IcPlus />Add Medicine</button>
            )}
          </div>
          <div className="main-content">
            {page === 'today' && renderToday()}
            {page === 'schedule' && renderSchedule()}
            {page === 'history' && renderHistory()}
            {page === 'settings' && renderSettings()}
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="modal-box">
            <div className="modal-header">
              <div>
                <div className="modal-title">Add Medicine</div>
                <div className="modal-subtitle">Fill in the details below</div>
              </div>
              <button className="modal-close" onClick={() => setModal(false)}><IcX /></button>
            </div>
            <form className="form-fields" onSubmit={addMed}>
              <div className="form-group">
                <label className="form-label">Medicine Name</label>
                <input className="form-input" placeholder="e.g. Amoxicillin" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Dosage</label>
                  <input className="form-input" placeholder="e.g. 250mg" value={form.dosage}
                    onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input className="form-input" type="time" value={form.time}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" className="btn-submit">Add Medicine</button>
            </form>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
