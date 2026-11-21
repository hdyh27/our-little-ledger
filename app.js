const STORAGE_KEY = 'our_little_ledger_v1';

const DEFAULT_WEDDING_ITEMS = [
  { id: 'wi_1', category: 'Venue & Ceremony', name: 'Biaya Akad & Penghulu', estimated: 3500000, budget: 3500000, actual: 0, dp: 0, status: 'Belum dicari', vendor: '' },
  { id: 'wi_2', category: 'Venue & Ceremony', name: 'Mahar Pernikahan', estimated: 5000000, budget: 5000000, actual: 0, dp: 0, status: 'Belum dicari', vendor: '' },
  { id: 'wi_3', category: 'Decoration', name: 'Dekorasi Akad & Pelaminan', estimated: 12000000, budget: 12000000, actual: 0, dp: 0, status: 'Belum dicari', vendor: '' },
  { id: 'wi_4', category: 'Makeup & Beauty', name: 'MUA Pengantin & Keluarga', estimated: 6500000, budget: 6500000, actual: 0, dp: 0, status: 'Belum dicari', vendor: '' },
  { id: 'wi_5', category: 'Wedding Outfit', name: 'Busana Pengantin & Cincin', estimated: 8500000, budget: 8500000, actual: 0, dp: 0, status: 'Belum dicari', vendor: '' },
  { id: 'wi_6', category: 'Photography & Videography', name: 'Foto & Video Dokumentasi', estimated: 7000000, budget: 7000000, actual: 0, dp: 0, status: 'Belum dicari', vendor: '' },
  { id: 'wi_7', category: 'Catering & Food', name: 'Catering Tamu & Keluarga', estimated: 25000000, budget: 25000000, actual: 0, dp: 0, status: 'Belum dicari', vendor: '' },
  { id: 'wi_8', category: 'Invitation & Guest', name: 'Undangan Digital, Cetak & Souvenir', estimated: 4000000, budget: 4000000, actual: 0, dp: 0, status: 'Belum dicari', vendor: '' },
  { id: 'wi_9', category: 'Family & Miscellaneous', name: 'Dana Darurat & Kebutuhan Keluarga', estimated: 3500000, budget: 3500000, actual: 0, dp: 0, status: 'Belum dicari', vendor: '' }
];

const DEFAULT_WEDDING_CHECKLIST = [
  { id: 'c_1', task: 'Menentukan tanggal & konsep pernikahan', category: 'Perencanaan', deadline: '', done: false },
  { id: 'c_2', task: 'Menentukan total budget & target tabungan', category: 'Keuangan', deadline: '', done: false },
  { id: 'c_3', task: 'Survei & booking venue / masjid akad', category: 'Venue', deadline: '', done: false },
  { id: 'c_4', task: 'Mengurus berkas administrasi KUA / pernikahan', category: 'Dokumen', deadline: '', done: false },
  { id: 'c_5', task: 'Menyiapkan mahar & cincin nikah', category: 'Mahar', deadline: '', done: false },
  { id: 'c_6', task: 'Booking MUA, dekorasi & busana pengantin', category: 'Vendor', deadline: '', done: false },
  { id: 'c_7', task: 'Booking fotografer & catering', category: 'Vendor', deadline: '', done: false },
  { id: 'c_8', task: 'Finalisasi daftar tamu & undangan', category: 'Tamu', deadline: '', done: false }
];

const DEFAULT_STATE = {
  settings: {
    userName: 'Satria Gerhana',
    appName: 'Our Little Ledger',
    tagline: 'Every day of work, a step closer to our future.',
    defaultDailyWage: 12000,
    monthlyExpenseLimit: 90000,
    exchangeRate: 105,
    weddingTargetDate: '2027-06-20',
    weddingBudgetTarget: 75000000,
    cityJapan: 'Osaka',
    countryJapan: 'Japan',
    calcMethod: 3,
    prayerReminders: { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true, offsetMin: 10, motivational: true }
  },
  workLogs: [],
  incomes: [],
  expenses: [],
  remittances: [],
  savingsGoals: [
    { id: 'g_wedding', name: 'Tabungan Menikah', targetIdr: 75000000, currentIdr: 0, priority: 'Tinggi' },
    { id: 'g_emergency', name: 'Dana Darurat', targetIdr: 25000000, currentIdr: 0, priority: 'Tinggi' },
    { id: 'g_home', name: 'Persiapan Rumah / Masa Depan', targetIdr: 50000000, currentIdr: 0, priority: 'Sedang' }
  ],
  weddingItems: DEFAULT_WEDDING_ITEMS,
  weddingChecklist: DEFAULT_WEDDING_CHECKLIST,
  weddingVendors: [],
  ibadahLogs: {},
  ibadahPlans: [],
  ibadahHabits: [
    { id: 'h_1', title: 'Tilawah Al-Quran minimal 5–10 menit', category: 'Tilawah', targetPerWeek: 7, doneDates: [] },
    { id: 'h_2', title: 'Dzikir pagi & petang', category: 'Dzikir', targetPerWeek: 7, doneDates: [] },
    { id: 'h_3', title: 'Sedekah Jumat / sisihkan rezeki harian', category: 'Sedekah', targetPerWeek: 2, doneDates: [] },
    { id: 'h_4', title: 'Salat Dhuha saat libur atau waktu luang', category: 'Sunnah', targetPerWeek: 4, doneDates: [] }
  ],
  musalaNotes: [],
  prayerCache: {}
};

let state = loadState();
let currentPage = 'home';
let selectedMonth = getJSTYearMonth();
let selectedIbadahDate = getJSTDateStr();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      settings: {
        ...structuredClone(DEFAULT_STATE.settings),
        ...(parsed.settings || {}),
        prayerReminders: {
          ...structuredClone(DEFAULT_STATE.settings.prayerReminders),
          ...((parsed.settings && parsed.settings.prayerReminders) || {})
        }
      }
    };
  } catch (e) {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid(prefix = 'id') {
  return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
}

function getJSTNow() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
}

function getJSTDateStr(offsetDays = 0) {
  const d = getJSTNow();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getJSTYearMonth() {
  return getJSTDateStr().slice(0, 7);
}

function updateJSTClock() {
  const now = getJSTNow();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const text = `${hh}:${mm} JST`;
  const sEl = document.getElementById('sidebar-jst-clock');
  const mEl = document.getElementById('mobile-jst-badge');
  if (sEl) sEl.textContent = text;
  if (mEl) mEl.textContent = text;
}

function formatJPY(val) {
  const num = Number(val || 0);
  return '¥' + num.toLocaleString('ja-JP');
}

function formatIDR(val) {
  const num = Number(val || 0);
  return 'Rp ' + num.toLocaleString('id-ID');
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.remove('translate-x-full', 'opacity-0');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.add('translate-x-full', 'opacity-0');
  }, 2400);
}

function openModal(html) {
  const backdrop = document.getElementById('modal-backdrop');
  const box = document.getElementById('modal-box');
  box.innerHTML = html;
  backdrop.classList.remove('hidden');
  lucide.createIcons();
}

function closeModal() {
  document.getElementById('modal-backdrop').classList.add('hidden');
  document.getElementById('modal-box').innerHTML = '';
}

function toggleMoreDrawer() {
  const drawer = document.getElementById('more-drawer');
  drawer.classList.toggle('hidden');
  renderMoreDrawer();
}

const NAV_ITEMS = [
  { id: 'home', label: 'Beranda', icon: 'home' },
  { id: 'work', label: 'Kerja & Gaji', icon: 'briefcase' },
  { id: 'expenses', label: 'Pengeluaran JPY', icon: 'wallet' },
  { id: 'remittance', label: 'Remittance & Tabungan', icon: 'arrow-left-right' },
  { id: 'wedding', label: 'Wedding Plan', icon: 'heart' },
  { id: 'ibadah', label: 'Salat & Ibadah', icon: 'moon' },
  { id: 'report', label: 'Laporan Bulanan', icon: 'bar-chart-3' },
  { id: 'calendar', label: 'Kalender JST', icon: 'calendar' },
  { id: 'settings', label: 'Pengaturan & Backup', icon: 'settings' }
];

function renderNav() {
  const dNav = document.getElementById('desktop-nav');
  if (dNav) {
    dNav.innerHTML = NAV_ITEMS.map(item => {
      const active = currentPage === item.id;
      return `<button onclick="navigate('${item.id}')" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
        active ? 'bg-sage-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
      }">
        <i data-lucide="${item.icon}" class="w-4 h-4"></i>
        <span>${item.label}</span>
      </button>`;
    }).join('');
  }

  document.querySelectorAll('.mob-nav-btn').forEach(btn => {
    const isActive = btn.dataset.nav === currentPage;
    btn.classList.toggle('text-sage-700', isActive);
    btn.classList.toggle('bg-sage-50', isActive);
    btn.classList.toggle('text-slate-500', !isActive);
  });

  const bDesktop = document.getElementById('brand-name-desktop');
  const bMobile = document.getElementById('brand-name-mobile');
  const tDesktop = document.getElementById('brand-tagline-desktop');
  if (bDesktop) bDesktop.textContent = state.settings.appName || 'Our Little Ledger';
  if (bMobile) bMobile.textContent = state.settings.appName || 'Our Little Ledger';
  if (tDesktop) tDesktop.textContent = state.settings.tagline || 'Every day of work, a step closer to our future.';
}

function renderMoreDrawer() {
  const grid = document.getElementById('more-drawer-grid');
  if (!grid) return;
  const extra = NAV_ITEMS.filter(i => !['home', 'work', 'wedding', 'ibadah'].includes(i.id));
  grid.innerHTML = extra.map(item => `
    <button onclick="navigate('${item.id}'); toggleMoreDrawer();" class="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-slate-200/80 hover:bg-sage-50/70 text-center gap-1.5">
      <i data-lucide="${item.icon}" class="w-5 h-5 text-sage-700"></i>
      <span class="text-[11px] font-semibold text-slate-700 leading-tight">${item.label}</span>
    </button>
  `).join('');
  lucide.createIcons();
}

function navigate(page) {
  currentPage = page;
  renderNav();
  renderPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getWorkStats(monthStr = selectedMonth) {
  const logs = state.workLogs.filter(w => w.date.startsWith(monthStr));
  const workDays = logs.filter(w => w.status === 'Kerja' || w.status === 'Lembur').length;
  const totalHours = logs.reduce((s, w) => s + Number(w.hours || 0), 0);
  const estimatedWage = logs.reduce((s, w) => s + Number(w.wage || 0), 0);

  const monthIncomes = state.incomes.filter(i => i.date.startsWith(monthStr));
  const paidWage = monthIncomes
    .filter(i => i.type === 'Gaji Harian' || i.type === 'Gaji Bulanan' || i.type === 'Lembur')
    .reduce((s, i) => s + Number(i.amountJpy || 0), 0);
  const otherIncome = monthIncomes
    .filter(i => !['Gaji Harian', 'Gaji Bulanan', 'Lembur'].includes(i.type))
    .reduce((s, i) => s + Number(i.amountJpy || 0), 0);
  const totalIncome = paidWage + otherIncome;

  const allWorkWage = state.workLogs.reduce((s, w) => s + Number(w.wage || 0), 0);
  const allPaidWage = state.incomes
    .filter(i => ['Gaji Harian', 'Gaji Bulanan', 'Lembur'].includes(i.type))
    .reduce((s, i) => s + Number(i.amountJpy || 0), 0);
  const unpaidWage = Math.max(0, allWorkWage - allPaidWage);

  return { workDays, totalHours, estimatedWage, paidWage, otherIncome, totalIncome, unpaidWage };
}

function getExpenseStats(monthStr = selectedMonth) {
  const list = state.expenses.filter(e => e.date.startsWith(monthStr));
  const totalExpense = list.reduce((s, e) => s + Number(e.amountJpy || 0), 0);
  const limit = Number(state.settings.monthlyExpenseLimit || 90000);
  const remaining = limit - totalExpense;
  const pct = limit > 0 ? Math.min(100, Math.round((totalExpense / limit) * 100)) : 0;
  return { totalExpense, limit, remaining, pct, count: list.length };
}

function getRemittanceStats() {
  const totalJpy = state.remittances.reduce((s, r) => s + Number(r.amountJpy || 0), 0);
  const totalIdr = state.remittances.reduce((s, r) => s + Number(r.amountIdr || 0), 0);
  const goalsSaved = state.savingsGoals.reduce((s, g) => s + Number(g.currentIdr || 0), 0);
  const goalsTarget = state.savingsGoals.reduce((s, g) => s + Number(g.targetIdr || 0), 0);
  return { totalJpy, totalIdr, goalsSaved, goalsTarget };
}

function getWeddingStats() {
  const targetBudget = Number(state.settings.weddingBudgetTarget || 75000000);
  const itemBudget = state.weddingItems.reduce((s, i) => s + Number(i.budget || 0), 0);
  const itemActual = state.weddingItems.reduce((s, i) => s + Number(i.actual || 0), 0);
  const itemDp = state.weddingItems.reduce((s, i) => s + Number(i.dp || 0), 0);

  const weddingGoal = state.savingsGoals.find(g => g.id === 'g_wedding' || /nikah|wedding/i.test(g.name));
  const savedWedding = weddingGoal ? Number(weddingGoal.currentIdr || 0) : 0;
  const pct = targetBudget > 0 ? Math.min(100, Math.round((savedWedding / targetBudget) * 100)) : 0;
  const remaining = Math.max(0, targetBudget - savedWedding);

  const doneChecklist = state.weddingChecklist.filter(c => c.done).length;
  const totalChecklist = state.weddingChecklist.length;

  let daysLeft = null;
  if (state.settings.weddingTargetDate) {
    const today = new Date(getJSTDateStr() + 'T00:00:00');
    const target = new Date(state.settings.weddingTargetDate + 'T00:00:00');
    daysLeft = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  }

  return { targetBudget, itemBudget, itemActual, itemDp, savedWedding, pct, remaining, doneChecklist, totalChecklist, daysLeft };
}

function getPrayerDayRecord(dateStr) {
  const rec = state.ibadahLogs[dateStr] || {};
  return {
    Fajr: Boolean(rec.Fajr),
    Dhuhr: Boolean(rec.Dhuhr),
    Asr: Boolean(rec.Asr),
    Maghrib: Boolean(rec.Maghrib),
    Isha: Boolean(rec.Isha),
    sunnah: Array.isArray(rec.sunnah) ? rec.sunnah : [],
    note: rec.note || ''
  };
}

function getPrayerDoneCount(dateStr) {
  const r = getPrayerDayRecord(dateStr);
  return ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].filter(p => r[p]).length;
}

function getPrayerStreak() {
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const d = getJSTDateStr(-i);
    if (getPrayerDoneCount(d) === 5) streak++;
    else break;
  }
  return streak;
}

async function fetchPrayerTimes(dateStr = getJSTDateStr()) {
  const city = encodeURIComponent(state.settings.cityJapan || 'Osaka');
  const country = encodeURIComponent(state.settings.countryJapan || 'Japan');
  const method = state.settings.calcMethod || 3;
  const cacheKey = `${dateStr}_${city}_${country}_${method}`;
  if (state.prayerCache[cacheKey]) return state.prayerCache[cacheKey];

  const [y, m, d] = dateStr.split('-');
  const url = `https://api.aladhan.com/v1/timingsByCity/${d}-${m}-${y}?city=${city}&country=${country}&method=${method}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal memuat jadwal salat');
  const json = await res.json();
  const timings = json.data.timings;
  const clean = {
    Fajr: (timings.Fajr || '').slice(0, 5),
    Dhuhr: (timings.Dhuhr || '').slice(0, 5),
    Asr: (timings.Asr || '').slice(0, 5),
    Maghrib: (timings.Maghrib || '').slice(0, 5),
    Isha: (timings.Isha || '').slice(0, 5)
  };
  state.prayerCache[cacheKey] = clean;
  saveState();
  return clean;
}

function renderPage() {
  const container = document.getElementById('app-view');
  if (!container) return;

  switch (currentPage) {
    case 'home': container.innerHTML = viewHome(); break;
    case 'work': container.innerHTML = viewWork(); break;
    case 'expenses': container.innerHTML = viewExpenses(); break;
    case 'remittance': container.innerHTML = viewRemittance(); break;
    case 'wedding': container.innerHTML = viewWedding(); break;
    case 'ibadah': container.innerHTML = viewIbadah(); break;
    case 'report': container.innerHTML = viewReport(); break;
    case 'calendar': container.innerHTML = viewCalendar(); break;
    case 'settings': container.innerHTML = viewSettings(); break;
    default: container.innerHTML = viewHome();
  }
  lucide.createIcons();

  if (currentPage === 'home' || currentPage === 'ibadah') {
    loadPrayerWidget();
  }
}

function viewHome() {
  const m = selectedMonth;
  const w = getWorkStats(m);
  const e = getExpenseStats(m);
  const r = getRemittanceStats();
  const wed = getWeddingStats();
  const today = getJSTDateStr();
  const prayerDone = getPrayerDoneCount(today);
  const streak = getPrayerStreak();
  const todayWork = state.workLogs.find(x => x.date === today);

  return `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs font-semibold text-sage-700">Assalamu'alaikum, ${escapeHtml(state.settings.userName || 'Satria Gerhana')}</p>
        <h2 class="text-2xl font-bold text-slate-800">Ringkasan Hari Ini</h2>
        <p class="text-xs text-slate-400">Periode aktif: ${m} · ${escapeHtml(state.settings.cityJapan)}, Jepang (JST)</p>
      </div>
      <div class="flex items-center gap-2">
        <input type="month" value="${m}" onchange="selectedMonth=this.value; renderPage();" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700" />
        <button onclick="openWorkModal()" class="px-3.5 py-2 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold flex items-center gap-1.5">
          <i data-lucide="plus" class="w-4 h-4"></i> Catat Kerja
        </button>
      </div>
    </div>

    <!-- Quick Action Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      <button onclick="openWorkModal()" class="card p-3.5 text-left hover:border-sage-300 transition">
        <span class="text-[11px] font-semibold text-sage-700 block">+ Kerja Hari Ini</span>
        <span class="text-xs text-slate-500 mt-0.5 block">${todayWork ? `${todayWork.status} (${todayWork.hours || 0} jam)` : 'Belum dicatat hari ini'}</span>
      </button>
      <button onclick="openExpenseModal()" class="card p-3.5 text-left hover:border-softblue-500 transition">
        <span class="text-[11px] font-semibold text-softblue-600 block">+ Pengeluaran JPY</span>
        <span class="text-xs text-slate-500 mt-0.5 block">Sisa limit: ${formatJPY(Math.max(0, e.remaining))}</span>
      </button>
      <button onclick="openRemittanceModal()" class="card p-3.5 text-left hover:border-sage-300 transition">
        <span class="text-[11px] font-semibold text-sage-700 block">+ Kirim Uang / Tabung</span>
        <span class="text-xs text-slate-500 mt-0.5 block">Kurs: 1¥ = Rp ${state.settings.exchangeRate}</span>
      </button>
      <button onclick="navigate('ibadah')" class="ibadah-card p-3.5 text-left hover:border-sage-500 transition">
        <span class="text-[11px] font-semibold text-sage-700 block">Salat Hari Ini</span>
        <span class="text-xs text-slate-600 mt-0.5 block">${prayerDone}/5 waktu · Streak ${streak} hari</span>
      </button>
    </div>

    <!-- KPI Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div class="card p-4">
        <p class="text-xs text-slate-400 font-medium">Estimasi Upah Kerja (${m})</p>
        <p class="text-xl font-bold text-slate-800 mt-1">${formatJPY(w.estimatedWage)}</p>
        <p class="text-[11px] text-slate-500 mt-1">${w.workDays} hari kerja · ${w.totalHours} jam</p>
        <p class="text-[11px] font-semibold text-amber-600 mt-1">Belum cair: ${formatJPY(w.unpaidWage)}</p>
      </div>

      <div class="card p-4">
        <p class="text-xs text-slate-400 font-medium">Pengeluaran Jepang (${m})</p>
        <p class="text-xl font-bold text-slate-800 mt-1">${formatJPY(e.totalExpense)}</p>
        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
          <div class="h-full ${e.pct > 85 ? 'bg-rose-500' : 'bg-softblue-500'}" style="width:${e.pct}%"></div>
        </div>
        <p class="text-[11px] text-slate-500 mt-1">${e.pct}% dari limit ${formatJPY(e.limit)}</p>
      </div>

      <div class="card p-4">
        <p class="text-xs text-slate-400 font-medium">Total Kiriman & Tabungan IDR</p>
        <p class="text-xl font-bold text-sage-700 mt-1">${formatIDR(r.goalsSaved)}</p>
        <p class="text-[11px] text-slate-500 mt-1">Terkirim: ${formatIDR(r.totalIdr)} (${formatJPY(r.totalJpy)})</p>
        <p class="text-[11px] text-slate-400 mt-0.5">Target gol: ${formatIDR(r.goalsTarget)}</p>
      </div>

      <div class="wedding-card p-4">
        <p class="text-xs text-champagne-600 font-semibold">Progress Dana Menikah</p>
        <p class="text-xl font-bold text-slate-800 mt-1">${wed.pct}%</p>
        <div class="w-full h-2 bg-champagne-100 rounded-full overflow-hidden mt-2">
          <div class="h-full bg-champagne-600" style="width:${wed.pct}%"></div>
        </div>
        <p class="text-[11px] text-slate-600 mt-1">Kurang ${formatIDR(wed.remaining)}</p>
        ${wed.daysLeft !== null ? `<p class="text-[11px] font-semibold text-champagne-600 mt-0.5">${wed.daysLeft > 0 ? wed.daysLeft + ' hari lagi' : 'Tanggal target tercapai'}</p>` : ''}
      </div>
    </div>

    <!-- Prayer & Wedding Spotlight -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="ibadah-card p-5">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="font-bold text-slate-800 text-sm">Jadwal Salat (${escapeHtml(state.settings.cityJapan)})</h3>
            <p class="text-xs text-slate-500">Tanggal ${today} · Klik waktu untuk menandai salat</p>
          </div>
          <button onclick="navigate('ibadah')" class="text-xs font-semibold text-sage-700 hover:underline">Buka Ibadah →</button>
        </div>
        <div id="home-prayer-grid" class="grid grid-cols-5 gap-2 text-center">
          <div class="p-2.5 rounded-xl bg-white/80 text-xs text-slate-400 col-span-5">Memuat jadwal salat...</div>
        </div>
      </div>

      <div class="wedding-card p-5 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-champagne-600">Wedding Milestone</span>
            <button onclick="navigate('wedding')" class="text-xs font-semibold text-champagne-600 hover:underline">Detail Wedding →</button>
          </div>
          <h3 class="font-serif text-2xl font-bold text-slate-800 mt-1">Persiapan Akad & Masa Depan</h3>
          <p class="text-xs text-slate-600 mt-1">Target budget: <b>${formatIDR(wed.targetBudget)}</b> · Terkumpul: <b>${formatIDR(wed.savedWedding)}</b></p>
        </div>
        <div class="mt-4 pt-3 border-t border-champagne-200/70 flex items-center justify-between text-xs">
          <span class="text-slate-600">Checklist selesai: <b>${wed.doneChecklist}/${wed.totalChecklist}</b></span>
          <span class="font-semibold text-champagne-600">${state.settings.weddingTargetDate || 'Belum diatur'}</span>
        </div>
      </div>
    </div>
  `;
}

function viewWork() {
  const m = selectedMonth;
  const w = getWorkStats(m);
  const logs = state.workLogs.filter(x => x.date.startsWith(m)).sort((a, b) => b.date.localeCompare(a.date));
  const incomes = state.incomes.filter(x => x.date.startsWith(m)).sort((a, b) => b.date.localeCompare(a.date));

  return `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Kerja & Pemasukan</h2>
        <p class="text-xs text-slate-400">Catat shift harian, jam lembur, gaji masuk, dan upah yang belum dibayarkan</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <input type="month" value="${m}" onchange="selectedMonth=this.value; renderPage();" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold" />
        <button onclick="openWorkModal()" class="px-3.5 py-2 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold">+ Catat Kerja</button>
        <button onclick="openIncomeModal()" class="px-3.5 py-2 rounded-xl bg-softblue-600 hover:bg-softblue-500 text-white text-xs font-semibold">+ Catat Gaji/Masuk</button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div class="card p-4">
        <p class="text-xs text-slate-400">Hari Kerja (${m})</p>
        <p class="text-xl font-bold text-slate-800 mt-1">${w.workDays} hari</p>
        <p class="text-xs text-slate-500 mt-0.5">Total ${w.totalHours} jam</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-slate-400">Estimasi Upah Kerja</p>
        <p class="text-xl font-bold text-slate-800 mt-1">${formatJPY(w.estimatedWage)}</p>
        <p class="text-xs text-slate-500 mt-0.5">Standar: ${formatJPY(state.settings.defaultDailyWage)}/hari</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-slate-400">Gaji / Pemasukan Cair</p>
        <p class="text-xl font-bold text-sage-700 mt-1">${formatJPY(w.totalIncome)}</p>
        <p class="text-xs text-slate-500 mt-0.5">Gaji: ${formatJPY(w.paidWage)} · Lainnya: ${formatJPY(w.otherIncome)}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-slate-400">Total Upah Belum Cair</p>
        <p class="text-xl font-bold text-amber-600 mt-1">${formatJPY(w.unpaidWage)}</p>
        <p class="text-xs text-slate-500 mt-0.5">Selisih estimasi vs gaji masuk</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="card p-5">
        <h3 class="font-bold text-slate-800 text-sm mb-3">Riwayat Kerja Harian (${m})</h3>
        ${logs.length ? `<div class="space-y-2.5">${logs.map(item => `
          <div class="p-3 rounded-2xl border border-slate-100 flex items-center justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-800">${item.date}</span>
                <span class="text-[11px] px-2 py-0.5 rounded-full font-semibold ${item.status === 'Libur' ? 'bg-slate-100 text-slate-600' : 'bg-sage-50 text-sage-700'}">${escapeHtml(item.status)}</span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">${escapeHtml(item.location || 'Lokasi kerja')} · ${item.hours || 0} jam ${item.note ? '· ' + escapeHtml(item.note) : ''}</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-bold text-slate-800">${formatJPY(item.wage)}</p>
              <div class="flex items-center justify-end gap-2 mt-1">
                <button onclick="openWorkModal('${item.id}')" class="text-[11px] text-softblue-600 font-semibold">Edit</button>
                <button onclick="deleteWorkLog('${item.id}')" class="text-[11px] text-rose-500 font-semibold">Hapus</button>
              </div>
            </div>
          </div>
        `).join('')}</div>` : `<p class="text-xs text-slate-400 py-6 text-center">Belum ada catatan kerja pada ${m}.</p>`}
      </div>

      <div class="card p-5">
        <h3 class="font-bold text-slate-800 text-sm mb-3">Riwayat Gaji & Pemasukan Masuk (${m})</h3>
        ${incomes.length ? `<div class="space-y-2.5">${incomes.map(inc => `
          <div class="p-3 rounded-2xl border border-slate-100 flex items-center justify-between gap-2">
            <div>
              <p class="text-xs font-bold text-slate-800">${escapeHtml(inc.type)} · <span class="font-normal text-slate-500">${inc.date}</span></p>
              <p class="text-xs text-slate-500 mt-0.5">${escapeHtml(inc.note || 'Pemasukan tercatat')}</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-bold text-sage-700">+${formatJPY(inc.amountJpy)}</p>
              <button onclick="deleteIncome('${inc.id}')" class="text-[11px] text-rose-500 font-semibold mt-1">Hapus</button>
            </div>
          </div>
        `).join('')}</div>` : `<p class="text-xs text-slate-400 py-6 text-center">Belum ada gaji/pemasukan masuk pada ${m}.</p>`}
      </div>
    </div>
  `;
}

function viewExpenses() {
  const m = selectedMonth;
  const e = getExpenseStats(m);
  const list = state.expenses.filter(x => x.date.startsWith(m)).sort((a, b) => b.date.localeCompare(a.date));

  const byCat = {};
  list.forEach(item => {
    byCat[item.category] = (byCat[item.category] || 0) + Number(item.amountJpy || 0);
  });

  return `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Pengeluaran Harian (JPY)</h2>
        <p class="text-xs text-slate-400">Kontrol biaya hidup di Jepang agar tetap aman dari batas bulanan</p>
      </div>
      <div class="flex items-center gap-2">
        <input type="month" value="${m}" onchange="selectedMonth=this.value; renderPage();" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold" />
        <button onclick="openExpenseModal()" class="px-3.5 py-2 rounded-xl bg-softblue-600 hover:bg-softblue-500 text-white text-xs font-semibold">+ Catat Pengeluaran</button>
      </div>
    </div>

    <div class="card p-5">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div>
          <p class="text-xs text-slate-400">Total Pengeluaran ${m}</p>
          <p class="text-2xl font-bold text-slate-800">${formatJPY(e.totalExpense)} <span class="text-xs font-normal text-slate-400">/ limit ${formatJPY(e.limit)}</span></p>
        </div>
        <span class="text-xs font-bold px-3 py-1.5 rounded-full ${e.remaining >= 0 ? 'bg-sage-50 text-sage-700' : 'bg-rose-50 text-rose-600'}">
          ${e.remaining >= 0 ? 'Sisa ' + formatJPY(e.remaining) : 'Lewat limit ' + formatJPY(Math.abs(e.remaining))}
        </span>
      </div>
      <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full ${e.pct > 85 ? 'bg-rose-500' : 'bg-softblue-500'}" style="width:${e.pct}%"></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="card p-5">
        <h3 class="font-bold text-slate-800 text-sm mb-3">Per Kategori</h3>
        ${Object.keys(byCat).length ? `<div class="space-y-2">${Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => `
          <div class="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
            <span class="font-medium text-slate-700">${escapeHtml(cat)}</span>
            <span class="font-bold text-slate-800">${formatJPY(amt)}</span>
          </div>
        `).join('')}</div>` : `<p class="text-xs text-slate-400 py-4 text-center">Belum ada data kategori.</p>`}
      </div>

      <div class="card p-5 lg:col-span-2">
        <h3 class="font-bold text-slate-800 text-sm mb-3">Daftar Pengeluaran (${m})</h3>
        ${list.length ? `<div class="space-y-2.5">${list.map(item => `
          <div class="p-3 rounded-2xl border border-slate-100 flex items-center justify-between gap-2">
            <div>
              <p class="text-xs font-bold text-slate-800">${escapeHtml(item.category)} · <span class="font-normal text-slate-500">${item.date}</span></p>
              <p class="text-xs text-slate-500 mt-0.5">${escapeHtml(item.note || '-')} · <span class="text-slate-400">${escapeHtml(item.method || 'Cash')}</span></p>
            </div>
            <div class="text-right">
              <p class="text-xs font-bold text-rose-600">-${formatJPY(item.amountJpy)}</p>
              <button onclick="deleteExpense('${item.id}')" class="text-[11px] text-rose-500 font-semibold mt-1">Hapus</button>
            </div>
          </div>
        `).join('')}</div>` : `<p class="text-xs text-slate-400 py-6 text-center">Belum ada pengeluaran pada ${m}.</p>`}
      </div>
    </div>
  `;
}

function viewRemittance() {
  const r = getRemittanceStats();
  const rate = Number(state.settings.exchangeRate || 105);

  return `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Remittance & Tabungan IDR</h2>
        <p class="text-xs text-slate-400">Kurs manual saat ini: <b>1 JPY = Rp ${rate}</b> · Kelola kiriman ke Indonesia & target tabungan</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="openRemittanceModal()" class="px-3.5 py-2 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold">+ Catat Kiriman</button>
        <button onclick="openGoalModal()" class="px-3.5 py-2 rounded-xl bg-champagne-600 hover:opacity-90 text-white text-xs font-semibold">+ Target Tabungan</button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      <div class="card p-4">
        <p class="text-xs text-slate-400">Total Dikirim (JPY)</p>
        <p class="text-xl font-bold text-slate-800 mt-1">${formatJPY(r.totalJpy)}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-slate-400">Total Diterima (IDR)</p>
        <p class="text-xl font-bold text-sage-700 mt-1">${formatIDR(r.totalIdr)}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-slate-400">Total Saldo Tabungan</p>
        <p class="text-xl font-bold text-slate-800 mt-1">${formatIDR(r.goalsSaved)}</p>
        <p class="text-xs text-slate-400 mt-0.5">dari target ${formatIDR(r.goalsTarget)}</p>
      </div>
    </div>

    <!-- Savings Goals -->
    <div class="card p-5">
      <h3 class="font-bold text-slate-800 text-sm mb-3">Pos Tabungan (IDR)</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        ${state.savingsGoals.map(g => {
          const pct = g.targetIdr > 0 ? Math.min(100, Math.round((g.currentIdr / g.targetIdr) * 100)) : 0;
          return `
            <div class="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sage-50 text-sage-700">${escapeHtml(g.priority || 'Target')}</span>
                  <span class="text-xs font-bold text-slate-700">${pct}%</span>
                </div>
                <h4 class="font-bold text-slate-800 text-sm mt-2">${escapeHtml(g.name)}</h4>
                <p class="text-sm font-bold text-sage-700 mt-1">${formatIDR(g.currentIdr)}</p>
                <p class="text-[11px] text-slate-400">Target: ${formatIDR(g.targetIdr)}</p>
              </div>
              <div class="mt-3">
                <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
                  <div class="h-full bg-sage-600" style="width:${pct}%"></div>
                </div>
                <div class="flex items-center gap-2">
                  <button onclick="openTopupGoalModal('${g.id}')" class="flex-1 py-1.5 rounded-xl bg-sage-600 text-white text-xs font-semibold">+ Tambah Dana</button>
                  <button onclick="deleteGoal('${g.id}')" class="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-rose-500">Hapus</button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Remittance History -->
    <div class="card p-5">
      <h3 class="font-bold text-slate-800 text-sm mb-3">Riwayat Remittance</h3>
      ${state.remittances.length ? `<div class="space-y-2.5">${state.remittances.slice().reverse().map(rem => `
        <div class="p-3 rounded-2xl border border-slate-100 flex items-center justify-between gap-2">
          <div>
            <p class="text-xs font-bold text-slate-800">${formatJPY(rem.amountJpy)} → <span class="text-sage-700">${formatIDR(rem.amountIdr)}</span></p>
            <p class="text-xs text-slate-500 mt-0.5">${rem.date} · Kurs ${rem.rate} · ${escapeHtml(rem.service || 'Transfer')} ${rem.goalName ? '· Masuk: ' + escapeHtml(rem.goalName) : ''}</p>
          </div>
          <button onclick="deleteRemittance('${rem.id}')" class="text-xs text-rose-500 font-semibold">Hapus</button>
        </div>
      `).join('')}</div>` : `<p class="text-xs text-slate-400 py-6 text-center">Belum ada riwayat pengiriman uang.</p>`}
    </div>
  `;
}

function viewWedding() {
  const wed = getWeddingStats();
  const categories = [...new Set(state.weddingItems.map(i => i.category))];

  return `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <span class="text-[11px] font-bold uppercase tracking-wider text-champagne-600">Wedding Financial & Prep Planner</span>
        <h2 class="font-serif text-3xl font-bold text-slate-800">Rencana Pernikahan Kita</h2>
        <p class="text-xs text-slate-500">Target hari H: <b>${state.settings.weddingTargetDate || '-'}</b> ${wed.daysLeft !== null && wed.daysLeft > 0 ? `(${wed.daysLeft} hari lagi)` : ''}</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button onclick="openWeddingTargetModal()" class="px-3.5 py-2 rounded-xl border border-champagne-200 bg-champagne-50 text-champagne-600 text-xs font-semibold">Atur Target & Tanggal</button>
        <button onclick="openWeddingItemModal()" class="px-3.5 py-2 rounded-xl bg-champagne-600 text-white text-xs font-semibold">+ Item Anggaran</button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div class="wedding-card p-4">
        <p class="text-xs text-champagne-600 font-semibold">Target Dana Menikah</p>
        <p class="text-xl font-bold text-slate-800 mt-1">${formatIDR(wed.targetBudget)}</p>
        <p class="text-xs text-slate-500 mt-0.5">Terkumpul: ${formatIDR(wed.savedWedding)} (${wed.pct}%)</p>
      </div>
      <div class="wedding-card p-4">
        <p class="text-xs text-champagne-600 font-semibold">Estimasi Rincian Item</p>
        <p class="text-xl font-bold text-slate-800 mt-1">${formatIDR(wed.itemBudget)}</p>
        <p class="text-xs text-slate-500 mt-0.5">${state.weddingItems.length} pos anggaran</p>
      </div>
      <div class="wedding-card p-4">
        <p class="text-xs text-champagne-600 font-semibold">DP & Realisasi Terbayar</p>
        <p class="text-xl font-bold text-slate-800 mt-1">${formatIDR(wed.itemDp + wed.itemActual)}</p>
        <p class="text-xs text-slate-500 mt-0.5">DP: ${formatIDR(wed.itemDp)} · Lunas/Actual: ${formatIDR(wed.itemActual)}</p>
      </div>
      <div class="wedding-card p-4">
        <p class="text-xs text-champagne-600 font-semibold">Checklist Persiapan</p>
        <p class="text-xl font-bold text-slate-800 mt-1">${wed.doneChecklist} / ${wed.totalChecklist}</p>
        <p class="text-xs text-slate-500 mt-0.5">Tahapan tercentang</p>
      </div>
    </div>

    <!-- Budget Items -->
    <div class="wedding-card p-5">
      <h3 class="font-bold text-slate-800 text-sm mb-3">Rincian Anggaran Pernikahan</h3>
      <div class="space-y-2.5">
        ${state.weddingItems.map(item => `
          <div class="p-3.5 rounded-2xl bg-white border border-champagne-200/70 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-champagne-600">${escapeHtml(item.category)}</span>
              <h4 class="text-xs font-bold text-slate-800">${escapeHtml(item.name)}</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">Status: <b>${escapeHtml(item.status)}</b> ${item.vendor ? '· Vendor: ' + escapeHtml(item.vendor) : ''}</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-bold text-slate-800">Budget: ${formatIDR(item.budget)}</p>
              <p class="text-[11px] text-slate-500">DP: ${formatIDR(item.dp)} · Realisasi: ${formatIDR(item.actual)}</p>
              <div class="flex items-center justify-end gap-2 mt-1">
                <button onclick="openWeddingItemModal('${item.id}')" class="text-[11px] font-semibold text-champagne-600">Edit</button>
                <button onclick="deleteWeddingItem('${item.id}')" class="text-[11px] font-semibold text-rose-500">Hapus</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Checklist & Vendors -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="wedding-card p-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold text-slate-800 text-sm">Checklist Persiapan</h3>
          <button onclick="addWeddingChecklistPrompt()" class="text-xs font-semibold text-champagne-600">+ Tambah Tugas</button>
        </div>
        <div class="space-y-2">
          ${state.weddingChecklist.map(c => `
            <label class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-champagne-200/60 cursor-pointer">
              <div class="flex items-center gap-2.5">
                <input type="checkbox" ${c.done ? 'checked' : ''} onchange="toggleChecklist('${c.id}')" class="rounded accent-amber-600" />
                <span class="text-xs ${c.done ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}">${escapeHtml(c.task)}</span>
              </div>
              <span class="text-[10px] text-slate-400">${escapeHtml(c.category)}</span>
            </label>
          `).join('')}
        </div>
      </div>

      <div class="wedding-card p-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold text-slate-800 text-sm">Catatan & Perbandingan Vendor</h3>
          <button onclick="openVendorModal()" class="text-xs font-semibold text-champagne-600">+ Tambah Vendor</button>
        </div>
        ${state.weddingVendors.length ? `<div class="space-y-2.5">${state.weddingVendors.map(v => `
          <div class="p-3 rounded-2xl bg-white border border-champagne-200/60 flex items-center justify-between gap-2">
            <div>
              <p class="text-xs font-bold text-slate-800">${escapeHtml(v.name)} <span class="text-[11px] font-normal text-champagne-600">(${escapeHtml(v.category)})</span></p>
              <p class="text-[11px] text-slate-500 mt-0.5">Harga: ${formatIDR(v.price)} · DP: ${formatIDR(v.dp)} · Status: ${escapeHtml(v.status)}</p>
              ${v.note ? `<p class="text-[11px] text-slate-400 mt-0.5">${escapeHtml(v.note)}</p>` : ''}
            </div>
            <button onclick="deleteVendor('${v.id}')" class="text-xs text-rose-500 font-semibold">Hapus</button>
          </div>
        `).join('')}</div>` : `<p class="text-xs text-slate-400 py-6 text-center">Belum ada kandidat vendor tercatat.</p>`}
      </div>
    </div>
  `;
}

function viewIbadah() {
  const d = selectedIbadahDate;
  const rec = getPrayerDayRecord(d);
  const doneCount = getPrayerDoneCount(d);
  const streak = getPrayerStreak();
  const prayers = [
    { key: 'Fajr', label: 'Subuh' },
    { key: 'Dhuhr', label: 'Dzuhur' },
    { key: 'Asr', label: 'Ashar' },
    { key: 'Maghrib', label: 'Maghrib' },
    { key: 'Isha', label: 'Isya' }
  ];

  return `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <span class="text-[11px] font-bold uppercase tracking-wider text-sage-700">Islamic Daily Companion · JST</span>
        <h2 class="text-2xl font-bold text-slate-800">Salat & Ibadah Harian</h2>
        <p class="text-xs text-slate-500">Lokasi: <b>${escapeHtml(state.settings.cityJapan)}, ${escapeHtml(state.settings.countryJapan)}</b> · Streak 5 waktu: <b>${streak} hari</b></p>
      </div>
      <div class="flex items-center gap-2">
        <input type="date" value="${d}" onchange="selectedIbadahDate=this.value; renderPage();" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold" />
        <button onclick="openIbadahPlanModal()" class="px-3.5 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold">+ Rencana Salat</button>
      </div>
    </div>

    <!-- 5 Daily Prayers -->
    <div class="ibadah-card p-5">
      <div class="flex items-center justify-between mb-3">
        <div>
          <h3 class="font-bold text-slate-800 text-sm">Salat Fardhu (${d})</h3>
          <p class="text-xs text-slate-500">Tercapai <b>${doneCount}/5</b> waktu salat</p>
        </div>
        <span class="text-xs font-bold px-3 py-1 rounded-full bg-white text-sage-700 border border-sage-200">${doneCount === 5 ? 'MasyaAllah Lengkap' : 'Tetap Istiqomah'}</span>
      </div>
      <div id="ibadah-prayer-list" class="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        ${prayers.map(p => `
          <button onclick="togglePrayer('${d}', '${p.key}')" class="p-3.5 rounded-2xl border text-left transition ${
            rec[p.key] ? 'bg-sage-600 text-white border-sage-600' : 'bg-white text-slate-700 border-sage-200 hover:bg-sage-50'
          }">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold">${p.label}</span>
              <span class="text-xs">${rec[p.key] ? '✓' : '○'}</span>
            </div>
            <p id="time-${p.key}" class="text-sm font-bold mt-1.5 opacity-90">--:--</p>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Work-Friendly Prayer Plans & Habits -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="ibadah-card p-5">
        <h3 class="font-bold text-slate-800 text-sm mb-3">Rencana Salat Saat Kerja / Shift</h3>
        ${state.ibadahPlans.length ? `<div class="space-y-2.5">${state.ibadahPlans.map(pl => `
          <div class="p-3 rounded-2xl bg-white border border-sage-200/70 flex items-center justify-between gap-2">
            <div>
              <p class="text-xs font-bold text-slate-800">${escapeHtml(pl.prayer)} · ${escapeHtml(pl.strategy)}</p>
              <p class="text-[11px] text-slate-500 mt-0.5">${escapeHtml(pl.note || '')}</p>
            </div>
            <button onclick="deleteIbadahPlan('${pl.id}')" class="text-xs text-rose-500 font-semibold">Hapus</button>
          </div>
        `).join('')}</div>` : `<p class="text-xs text-slate-400 py-5 text-center">Belum ada rencana salat kerja. Klik "+ Rencana Salat" untuk menambah.</p>`}
      </div>

      <div class="ibadah-card p-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold text-slate-800 text-sm">Kebiasaan Ibadah (${d})</h3>
          <button onclick="openHabitModal()" class="text-xs font-semibold text-sage-700">+ Kebiasaan</button>
        </div>
        <div class="space-y-2">
          ${state.ibadahHabits.map(h => {
            const isDone = (h.doneDates || []).includes(d);
            return `
              <label class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-sage-200/60 cursor-pointer">
                <div class="flex items-center gap-2.5">
                  <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleHabit('${h.id}', '${d}')" class="accent-emerald-700" />
                  <div>
                    <p class="text-xs font-semibold text-slate-800">${escapeHtml(h.title)}</p>
                    <p class="text-[10px] text-slate-400">${escapeHtml(h.category)} · Target ${h.targetPerWeek}x/pekan</p>
                  </div>
                </div>
                <span class="text-xs font-bold text-sage-700">${(h.doneDates || []).length}x</span>
              </label>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Musala & Refleksi -->
    <div class="ibadah-card p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-slate-800 text-sm">Catatan Musala / Ruang Salat & Refleksi</h3>
        <button onclick="openMusalaModal()" class="text-xs font-semibold text-sage-700">+ Catatan</button>
      </div>
      ${state.musalaNotes.length ? `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">${state.musalaNotes.map(n => `
        <div class="p-3 rounded-2xl bg-white border border-sage-200/60 flex items-start justify-between gap-2">
          <div>
            <p class="text-xs font-bold text-slate-800">${escapeHtml(n.place)}</p>
            <p class="text-[11px] text-slate-500 mt-0.5">${escapeHtml(n.note)}</p>
          </div>
          <button onclick="deleteMusalaNote('${n.id}')" class="text-xs text-rose-500 font-semibold">Hapus</button>
        </div>
      `).join('')}</div>` : `<p class="text-xs text-slate-400 py-4 text-center">Belum ada catatan lokasi musala atau refleksi.</p>`}
    </div>
  `;
}

function viewReport() {
  const m = selectedMonth;
  const w = getWorkStats(m);
  const e = getExpenseStats(m);
  const netJpy = w.totalIncome - e.totalExpense;

  return `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Laporan Bulanan (${m})</h2>
        <p class="text-xs text-slate-400">Ringkasan arus kas Jepang (JPY) dan ekspor CSV</p>
      </div>
      <div class="flex items-center gap-2">
        <input type="month" value="${m}" onchange="selectedMonth=this.value; renderPage();" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold" />
        <button onclick="exportCSV()" class="px-3.5 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold">Export CSV</button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      <div class="card p-4">
        <p class="text-xs text-slate-400">Pemasukan Cair (${m})</p>
        <p class="text-xl font-bold text-sage-700 mt-1">${formatJPY(w.totalIncome)}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-slate-400">Pengeluaran (${m})</p>
        <p class="text-xl font-bold text-rose-600 mt-1">${formatJPY(e.totalExpense)}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-slate-400">Selisih Bersih (Pemasukan - Pengeluaran)</p>
        <p class="text-xl font-bold ${netJpy >= 0 ? 'text-slate-800' : 'text-rose-600'} mt-1">${formatJPY(netJpy)}</p>
      </div>
    </div>
  `;
}

function viewCalendar() {
  const m = selectedMonth;
  const [yStr, mStr] = m.split('-');
  const year = Number(yStr);
  const monthIdx = Number(mStr) - 1;
  const firstDay = new Date(year, monthIdx, 1).getDay();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(`<div></div>`);
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${m}-${String(day).padStart(2, '0')}`;
    const wLog = state.workLogs.find(x => x.date === dateStr);
    const pCount = getPrayerDoneCount(dateStr);
    const isWeddingDay = state.settings.weddingTargetDate === dateStr;

    cells.push(`
      <div class="p-2 rounded-xl border ${isWeddingDay ? 'border-champagne-600 bg-champagne-50' : 'border-slate-100 bg-white'} min-h-[72px] flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-700">${day}</span>
          ${pCount > 0 ? `<span class="text-[10px] font-semibold text-sage-700">${pCount}/5</span>` : ''}
        </div>
        <div class="space-y-0.5 mt-1">
          ${wLog ? `<span class="block text-[10px] px-1.5 py-0.5 rounded bg-sage-50 text-sage-700 font-semibold truncate">${escapeHtml(wLog.status)}</span>` : ''}
          ${isWeddingDay ? `<span class="block text-[10px] px-1.5 py-0.5 rounded bg-champagne-100 text-champagne-600 font-bold truncate">Target Nikah</span>` : ''}
        </div>
      </div>
    `);
  }

  return `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Kalender JST (${m})</h2>
        <p class="text-xs text-slate-400">Gabungan jadwal kerja, progres salat, dan tanggal target pernikahan</p>
      </div>
      <input type="month" value="${m}" onchange="selectedMonth=this.value; renderPage();" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold" />
    </div>

    <div class="card p-4 sm:p-5">
      <div class="grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-slate-400 mb-2">
        <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
      </div>
      <div class="grid grid-cols-7 gap-2">${cells.join('')}</div>
    </div>
  `;
}

function viewSettings() {
  const s = state.settings;
  return `
    <div>
      <h2 class="text-2xl font-bold text-slate-800">Pengaturan & Backup Data</h2>
      <p class="text-xs text-slate-400">Atur preferensi kerja, kurs, lokasi salat di Jepang, dan cadangan JSON</p>
    </div>

    <form onsubmit="saveSettingsForm(event)" class="card p-5 space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Nama Pengguna</label>
          <input name="userName" value="${escapeHtml(s.userName)}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Upah Harian Standar (JPY)</label>
          <input type="number" name="defaultDailyWage" value="${s.defaultDailyWage}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Batas Pengeluaran Bulanan (JPY)</label>
          <input type="number" name="monthlyExpenseLimit" value="${s.monthlyExpenseLimit}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Kurs Manual (1 JPY = ? IDR)</label>
          <input type="number" step="0.1" name="exchangeRate" value="${s.exchangeRate}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Kota di Jepang (Jadwal Salat)</label>
          <input name="cityJapan" value="${escapeHtml(s.cityJapan)}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Metode Hisab (Aladhan)</label>
          <select name="calcMethod" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
            <option value="3" ${Number(s.calcMethod) === 3 ? 'selected' : ''}>MWL (Muslim World League)</option>
            <option value="2" ${Number(s.calcMethod) === 2 ? 'selected' : ''}>ISNA</option>
            <option value="4" ${Number(s.calcMethod) === 4 ? 'selected' : ''}>Umm al-Qura</option>
          </select>
        </div>
      </div>
      <button type="submit" class="px-4 py-2.5 rounded-xl bg-sage-600 text-white text-xs font-semibold">Simpan Pengaturan</button>
    </form>

    <div class="card p-5 space-y-3">
      <h3 class="font-bold text-slate-800 text-sm">Backup & Restore (JSON)</h3>
      <p class="text-xs text-slate-500">Unduh file JSON untuk memindahkan atau mengamankan data ke perangkat lain.</p>
      <div class="flex flex-wrap items-center gap-2.5">
        <button onclick="downloadBackupJSON()" class="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold">Download Backup JSON</button>
        <label class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer">
          Restore dari JSON
          <input type="file" accept=".json" onchange="restoreBackupJSON(event)" class="hidden" />
        </label>
        <button onclick="resetAllData()" class="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 text-xs font-semibold">Reset Semua Data</button>
      </div>
    </div>
  `;
}

async function loadPrayerWidget() {
  const dateStr = currentPage === 'ibadah' ? selectedIbadahDate : getJSTDateStr();
  try {
    const timings = await fetchPrayerTimes(dateStr);
    if (currentPage === 'home') {
      const grid = document.getElementById('home-prayer-grid');
      if (!grid) return;
      const rec = getPrayerDayRecord(dateStr);
      const map = [
        ['Fajr', 'Subuh'],
        ['Dhuhr', 'Dzuhur'],
        ['Asr', 'Ashar'],
        ['Maghrib', 'Maghrib'],
        ['Isha', 'Isya']
      ];
      grid.innerHTML = map.map(([key, label]) => `
        <button onclick="togglePrayer('${dateStr}', '${key}')" class="p-2.5 rounded-2xl border text-center transition ${
          rec[key] ? 'bg-sage-600 text-white border-sage-600' : 'bg-white text-slate-700 border-sage-200 hover:bg-sage-50'
        }">
          <span class="block text-[11px] font-semibold">${label}</span>
          <span class="block text-xs font-bold mt-0.5">${timings[key] || '--:--'}</span>
        </button>
      `).join('');
    } else if (currentPage === 'ibadah') {
      ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(k => {
        const el = document.getElementById('time-' + k);
        if (el) el.textContent = timings[k] || '--:--';
      });
    }
  } catch (e) {
    if (currentPage === 'home') {
      const grid = document.getElementById('home-prayer-grid');
      if (grid) grid.innerHTML = `<div class="p-2.5 rounded-xl bg-white/80 text-xs text-slate-500 col-span-5">Jadwal salat belum dapat dimuat (cek koneksi internet).</div>`;
    }
  }
}

function togglePrayer(dateStr, prayerKey) {
  const cur = getPrayerDayRecord(dateStr);
  state.ibadahLogs[dateStr] = { ...cur, [prayerKey]: !cur[prayerKey] };
  saveState();
  showToast(`Status salat ${prayerKey} diperbarui`);
  renderPage();
}

function toggleChecklist(id) {
  const item = state.weddingChecklist.find(x => x.id === id);
  if (!item) return;
  item.done = !item.done;
  saveState();
  renderPage();
}

function toggleHabit(id, dateStr) {
  const h = state.ibadahHabits.find(x => x.id === id);
  if (!h) return;
  h.doneDates = Array.isArray(h.doneDates) ? h.doneDates : [];
  if (h.doneDates.includes(dateStr)) {
    h.doneDates = h.doneDates.filter(d => d !== dateStr);
  } else {
    h.doneDates.push(dateStr);
  }
  saveState();
  renderPage();
}

/* Modals & Actions */
function openWorkModal(editId = null) {
  const item = editId ? state.workLogs.find(x => x.id === editId) : null;
  openModal(`
    <h3 class="font-bold text-slate-800 text-base mb-3">${item ? 'Edit Catatan Kerja' : 'Catat Kerja Harian'}</h3>
    <form onsubmit="saveWorkForm(event, '${item ? item.id : ''}')" class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Tanggal</label>
          <input type="date" name="date" required value="${item ? item.date : getJSTDateStr()}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Status</label>
          <select name="status" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
            ${['Kerja', 'Lembur', 'Libur', 'Sakit/Izin'].map(st => `<option ${item && item.status === st ? 'selected' : ''}>${st}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Jam Kerja</label>
          <input type="number" step="0.5" name="hours" value="${item ? item.hours : 8}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Estimasi Upah (JPY)</label>
          <input type="number" name="wage" value="${item ? item.wage : state.settings.defaultDailyWage}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Lokasi / Jenis Pekerjaan</label>
        <input name="location" value="${escapeHtml(item ? item.location : '')}" placeholder="Contoh: Gudang / Konstruksi / Haken" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Catatan</label>
        <input name="note" value="${escapeHtml(item ? item.note : '')}" placeholder="Opsional" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">Batal</button>
        <button type="submit" class="px-4 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold">Simpan</button>
      </div>
    </form>
  `);
}

function saveWorkForm(e, editId) {
  e.preventDefault();
  const f = new FormData(e.target);
  const record = {
    id: editId || uid('w'),
    date: f.get('date'),
    status: f.get('status'),
    hours: Number(f.get('hours') || 0),
    wage: Number(f.get('wage') || 0),
    location: f.get('location'),
    note: f.get('note')
  };
  if (editId) {
    state.workLogs = state.workLogs.map(x => x.id === editId ? record : x);
  } else {
    state.workLogs.push(record);
  }
  saveState();
  closeModal();
  showToast('Catatan kerja tersimpan');
  renderPage();
}

function deleteWorkLog(id) {
  state.workLogs = state.workLogs.filter(x => x.id !== id);
  saveState();
  renderPage();
}

function openIncomeModal() {
  openModal(`
    <h3 class="font-bold text-slate-800 text-base mb-3">Catat Gaji / Pemasukan Masuk</h3>
    <form onsubmit="saveIncomeForm(event)" class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Tanggal</label>
          <input type="date" name="date" required value="${getJSTDateStr()}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Jenis</label>
          <select name="type" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
            <option>Gaji Harian</option>
            <option>Gaji Bulanan</option>
            <option>Lembur</option>
            <option>Bonus / Lainnya</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Jumlah Diterima (JPY)</label>
        <input type="number" name="amountJpy" required placeholder="Contoh: 12000" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Catatan</label>
        <input name="note" placeholder="Contoh: Gaji minggu ke-2" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">Batal</button>
        <button type="submit" class="px-4 py-2 rounded-xl bg-softblue-600 text-white text-xs font-semibold">Simpan</button>
      </div>
    </form>
  `);
}

function saveIncomeForm(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  state.incomes.push({
    id: uid('inc'),
    date: f.get('date'),
    type: f.get('type'),
    amountJpy: Number(f.get('amountJpy') || 0),
    note: f.get('note')
  });
  saveState();
  closeModal();
  showToast('Pemasukan tercatat');
  renderPage();
}

function deleteIncome(id) {
  state.incomes = state.incomes.filter(x => x.id !== id);
  saveState();
  renderPage();
}

function openExpenseModal() {
  openModal(`
    <h3 class="font-bold text-slate-800 text-base mb-3">Catat Pengeluaran (JPY)</h3>
    <form onsubmit="saveExpenseForm(event)" class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Tanggal</label>
          <input type="date" name="date" required value="${getJSTDateStr()}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Kategori</label>
          <select name="category" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
            <option>Makan & Minum</option>
            <option>Transportasi</option>
            <option>Tempat Tinggal / Listrik</option>
            <option>Kebutuhan Harian</option>
            <option>Kesehatan & Ibadah</option>
            <option>Lainnya</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Nominal (JPY)</label>
          <input type="number" name="amountJpy" required placeholder="1500" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Metode</label>
          <select name="method" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
            <option>Cash</option>
            <option>IC Card / PayPay</option>
            <option>Bank Transfer</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Keterangan</label>
        <input name="note" placeholder="Contoh: Makan siang / kereta" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">Batal</button>
        <button type="submit" class="px-4 py-2 rounded-xl bg-softblue-600 text-white text-xs font-semibold">Simpan</button>
      </div>
    </form>
  `);
}

function saveExpenseForm(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  state.expenses.push({
    id: uid('exp'),
    date: f.get('date'),
    category: f.get('category'),
    amountJpy: Number(f.get('amountJpy') || 0),
    method: f.get('method'),
    note: f.get('note')
  });
  saveState();
  closeModal();
  showToast('Pengeluaran tersimpan');
  renderPage();
}

function deleteExpense(id) {
  state.expenses = state.expenses.filter(x => x.id !== id);
  saveState();
  renderPage();
}

function openRemittanceModal() {
  const rate = Number(state.settings.exchangeRate || 105);
  openModal(`
    <h3 class="font-bold text-slate-800 text-base mb-3">Catat Kiriman Uang (Remittance)</h3>
    <form onsubmit="saveRemittanceForm(event)" class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Tanggal</label>
          <input type="date" name="date" required value="${getJSTDateStr()}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Kurs (1 JPY = ? IDR)</label>
          <input type="number" step="0.1" name="rate" value="${rate}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Jumlah Dikirim (JPY)</label>
        <input type="number" name="amountJpy" required placeholder="50000" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Alokasikan ke Pos Tabungan</label>
        <select name="goalId" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
          <option value="">-- Tidak masuk pos tabungan --</option>
          ${state.savingsGoals.map(g => `<option value="${g.id}">${escapeHtml(g.name)}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Layanan / Catatan</label>
        <input name="service" placeholder="Contoh: Wise / Transfer bank" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">Batal</button>
        <button type="submit" class="px-4 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold">Simpan</button>
      </div>
    </form>
  `);
}

function saveRemittanceForm(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  const amountJpy = Number(f.get('amountJpy') || 0);
  const rate = Number(f.get('rate') || state.settings.exchangeRate || 105);
  const amountIdr = Math.round(amountJpy * rate);
  const goalId = f.get('goalId');
  const goal = state.savingsGoals.find(g => g.id === goalId);

  if (goal) {
    goal.currentIdr = Number(goal.currentIdr || 0) + amountIdr;
  }

  state.remittances.push({
    id: uid('rem'),
    date: f.get('date'),
    amountJpy,
    rate,
    amountIdr,
    goalId,
    goalName: goal ? goal.name : '',
    service: f.get('service')
  });
  saveState();
  closeModal();
  showToast('Kiriman uang tercatat');
  renderPage();
}

function deleteRemittance(id) {
  state.remittances = state.remittances.filter(x => x.id !== id);
  saveState();
  renderPage();
}

function openGoalModal() {
  openModal(`
    <h3 class="font-bold text-slate-800 text-base mb-3">Tambah Target Tabungan (IDR)</h3>
    <form onsubmit="saveGoalForm(event)" class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Nama Pos Tabungan</label>
        <input name="name" required placeholder="Contoh: Dana Resepsi / Orang Tua" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Target (IDR)</label>
          <input type="number" name="targetIdr" required placeholder="20000000" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Saldo Awal (IDR)</label>
          <input type="number" name="currentIdr" value="0" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Prioritas</label>
        <select name="priority" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
          <option>Tinggi</option>
          <option>Sedang</option>
          <option>Santai</option>
        </select>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">Batal</button>
        <button type="submit" class="px-4 py-2 rounded-xl bg-champagne-600 text-white text-xs font-semibold">Simpan</button>
      </div>
    </form>
  `);
}

function saveGoalForm(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  state.savingsGoals.push({
    id: uid('goal'),
    name: f.get('name'),
    targetIdr: Number(f.get('targetIdr') || 0),
    currentIdr: Number(f.get('currentIdr') || 0),
    priority: f.get('priority')
  });
  saveState();
  closeModal();
  showToast('Target tabungan ditambahkan');
  renderPage();
}

function openTopupGoalModal(goalId) {
  const g = state.savingsGoals.find(x => x.id === goalId);
  if (!g) return;
  openModal(`
    <h3 class="font-bold text-slate-800 text-base mb-1">Tambah Dana: ${escapeHtml(g.name)}</h3>
    <p class="text-xs text-slate-400 mb-3">Saldo saat ini: ${formatIDR(g.currentIdr)}</p>
    <form onsubmit="saveTopupGoal(event, '${goalId}')" class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Nominal Tambahan (IDR)</label>
        <input type="number" name="addIdr" required placeholder="1000000" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">Batal</button>
        <button type="submit" class="px-4 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold">Tambah</button>
      </div>
    </form>
  `);
}

function saveTopupGoal(e, goalId) {
  e.preventDefault();
  const addIdr = Number(new FormData(e.target).get('addIdr') || 0);
  const g = state.savingsGoals.find(x => x.id === goalId);
  if (g) g.currentIdr = Number(g.currentIdr || 0) + addIdr;
  saveState();
  closeModal();
  showToast('Saldo tabungan diperbarui');
  renderPage();
}

function deleteGoal(id) {
  state.savingsGoals = state.savingsGoals.filter(x => x.id !== id);
  saveState();
  renderPage();
}

function openWeddingTargetModal() {
  openModal(`
    <h3 class="font-bold text-slate-800 text-base mb-3">Target Dana & Tanggal Pernikahan</h3>
    <form onsubmit="saveWeddingTarget(event)" class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Target Tanggal Pernikahan</label>
        <input type="date" name="weddingTargetDate" value="${state.settings.weddingTargetDate || ''}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Total Target Dana Nikah (IDR)</label>
        <input type="number" name="weddingBudgetTarget" value="${state.settings.weddingBudgetTarget || 75000000}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">Batal</button>
        <button type="submit" class="px-4 py-2 rounded-xl bg-champagne-600 text-white text-xs font-semibold">Simpan</button>
      </div>
    </form>
  `);
}

function saveWeddingTarget(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  state.settings.weddingTargetDate = f.get('weddingTargetDate');
  state.settings.weddingBudgetTarget = Number(f.get('weddingBudgetTarget') || 75000000);
  saveState();
  closeModal();
  showToast('Target pernikahan disimpan');
  renderPage();
}

function openWeddingItemModal(editId = null) {
  const item = editId ? state.weddingItems.find(x => x.id === editId) : null;
  openModal(`
    <h3 class="font-bold text-slate-800 text-base mb-3">${item ? 'Edit Item Anggaran' : 'Tambah Item Anggaran Wedding'}</h3>
    <form onsubmit="saveWeddingItem(event, '${item ? item.id : ''}')" class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Nama Item</label>
        <input name="name" required value="${escapeHtml(item ? item.name : '')}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Kategori</label>
          <input name="category" value="${escapeHtml(item ? item.category : 'General')}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Status</label>
          <select name="status" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
            ${['Belum dicari', 'Survey/Riset', 'DP dibayar', 'Lunas'].map(st => `<option ${item && item.status === st ? 'selected' : ''}>${st}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-2.5">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Budget (IDR)</label>
          <input type="number" name="budget" value="${item ? item.budget : 0}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">DP (IDR)</label>
          <input type="number" name="dp" value="${item ? item.dp : 0}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Realisasi</label>
          <input type="number" name="actual" value="${item ? item.actual : 0}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Vendor Pilihan</label>
        <input name="vendor" value="${escapeHtml(item ? item.vendor : '')}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">Batal</button>
        <button type="submit" class="px-4 py-2 rounded-xl bg-champagne-600 text-white text-xs font-semibold">Simpan</button>
      </div>
    </form>
  `);
}

function saveWeddingItem(e, editId) {
  e.preventDefault();
  const f = new FormData(e.target);
  const rec = {
    id: editId || uid('wi'),
    name: f.get('name'),
    category: f.get('category') || 'General',
    status: f.get('status'),
    budget: Number(f.get('budget') || 0),
    estimated: Number(f.get('budget') || 0),
    dp: Number(f.get('dp') || 0),
    actual: Number(f.get('actual') || 0),
    vendor: f.get('vendor')
  };
  if (editId) {
    state.weddingItems = state.weddingItems.map(x => x.id === editId ? rec : x);
  } else {
    state.weddingItems.push(rec);
  }
  saveState();
  closeModal();
  showToast('Item wedding tersimpan');
  renderPage();
}

function deleteWeddingItem(id) {
  state.weddingItems = state.weddingItems.filter(x => x.id !== id);
  saveState();
  renderPage();
}

function addWeddingChecklistPrompt() {
  const task = prompt('Tulis tugas persiapan pernikahan baru:');
  if (!task || !task.trim()) return;
  state.weddingChecklist.push({ id: uid('c'), task: task.trim(), category: 'Tambahan', deadline: '', done: false });
  saveState();
  renderPage();
}

function openVendorModal() {
  openModal(`
    <h3 class="font-bold text-slate-800 text-base mb-3">Tambah Kandidat Vendor</h3>
    <form onsubmit="saveVendorForm(event)" class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Nama Vendor</label>
          <input name="name" required class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Kategori</label>
          <input name="category" placeholder="Dekorasi / MUA / Catering" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Estimasi Harga (IDR)</label>
          <input type="number" name="price" value="0" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Status</label>
          <select name="status" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
            <option>Riset</option>
            <option>Dihubungi</option>
            <option>DP</option>
            <option>Fix</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Catatan</label>
        <input name="note" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">Batal</button>
        <button type="submit" class="px-4 py-2 rounded-xl bg-champagne-600 text-white text-xs font-semibold">Simpan</button>
      </div>
    </form>
  `);
}

function saveVendorForm(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  state.weddingVendors.push({
    id: uid('vnd'),
    name: f.get('name'),
    category: f.get('category') || 'Vendor',
    price: Number(f.get('price') || 0),
    dp: 0,
    status: f.get('status'),
    note: f.get('note')
  });
  saveState();
  closeModal();
  showToast('Vendor tersimpan');
  renderPage();
}

function deleteVendor(id) {
  state.weddingVendors = state.weddingVendors.filter(x => x.id !== id);
  saveState();
  renderPage();
}

function openIbadahPlanModal() {
  openModal(`
    <h3 class="font-bold text-slate-800 text-base mb-3">Rencana Salat Saat Kerja</h3>
    <form onsubmit="saveIbadahPlan(event)" class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Waktu Salat</label>
          <select name="prayer" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
            <option>Subuh</option><option>Dzuhur</option><option>Ashar</option><option>Maghrib</option><option>Isya</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Strategi</label>
          <select name="strategy" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
            <option>Saat istirahat kerja</option>
            <option>Jamak qashar (saat safar)</option>
            <option>Segera setelah pulang shift</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Catatan</label>
        <input name="note" placeholder="Contoh: Bawa sajadah lipat & wudhu di toilet bersih" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">Batal</button>
        <button type="submit" class="px-4 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold">Simpan</button>
      </div>
    </form>
  `);
}

function saveIbadahPlan(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  state.ibadahPlans.push({ id: uid('ipl'), prayer: f.get('prayer'), strategy: f.get('strategy'), note: f.get('note') });
  saveState();
  closeModal();
  showToast('Rencana salat tersimpan');
  renderPage();
}

function deleteIbadahPlan(id) {
  state.ibadahPlans = state.ibadahPlans.filter(x => x.id !== id);
  saveState();
  renderPage();
}

function openHabitModal() {
  openModal(`
    <h3 class="font-bold text-slate-800 text-base mb-3">Tambah Kebiasaan Ibadah</h3>
    <form onsubmit="saveHabitForm(event)" class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Nama Kebiasaan</label>
        <input name="title" required placeholder="Contoh: Istighfar 100x setelah subuh" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Kategori</label>
          <input name="category" value="Dzikir" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Target / Pekan</label>
          <input type="number" name="targetPerWeek" value="7" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
        </div>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">Batal</button>
        <button type="submit" class="px-4 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold">Simpan</button>
      </div>
    </form>
  `);
}

function saveHabitForm(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  state.ibadahHabits.push({
    id: uid('hab'),
    title: f.get('title'),
    category: f.get('category') || 'Ibadah',
    targetPerWeek: Number(f.get('targetPerWeek') || 7),
    doneDates: []
  });
  saveState();
  closeModal();
  showToast('Kebiasaan ditambahkan');
  renderPage();
}

function openMusalaModal() {
  openModal(`
    <h3 class="font-bold text-slate-800 text-base mb-3">Catatan Musala / Refleksi</h3>
    <form onsubmit="saveMusalaForm(event)" class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Tempat / Topik</label>
        <input name="place" required placeholder="Contoh: Stasiun / Area istirahat kerja" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Catatan</label>
        <input name="note" required placeholder="Arah kiblat, fasilitas wudhu, atau doa hari ini" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">Batal</button>
        <button type="submit" class="px-4 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold">Simpan</button>
      </div>
    </form>
  `);
}

function saveMusalaForm(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  state.musalaNotes.push({ id: uid('mus'), place: f.get('place'), note: f.get('note') });
  saveState();
  closeModal();
  showToast('Catatan tersimpan');
  renderPage();
}

function deleteMusalaNote(id) {
  state.musalaNotes = state.musalaNotes.filter(x => x.id !== id);
  saveState();
  renderPage();
}

function saveSettingsForm(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  state.settings.userName = f.get('userName');
  state.settings.defaultDailyWage = Number(f.get('defaultDailyWage') || 12000);
  state.settings.monthlyExpenseLimit = Number(f.get('monthlyExpenseLimit') || 90000);
  state.settings.exchangeRate = Number(f.get('exchangeRate') || 105);
  state.settings.cityJapan = f.get('cityJapan') || 'Osaka';
  state.settings.calcMethod = Number(f.get('calcMethod') || 3);
  state.prayerCache = {};
  saveState();
  renderNav();
  showToast('Pengaturan disimpan');
  renderPage();
}

function downloadBackupJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `our-little-ledger-backup-${getJSTDateStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup JSON diunduh');
}

function restoreBackupJSON(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      state = { ...structuredClone(DEFAULT_STATE), ...data };
      saveState();
      renderNav();
      renderPage();
      showToast('Data berhasil dipulihkan');
    } catch (err) {
      showToast('File JSON tidak valid');
    }
  };
  reader.readAsText(file);
}

function exportCSV() {
  const rows = [['Tanggal', 'Jenis', 'Kategori', 'Nominal_JPY', 'Catatan']];
  state.incomes.forEach(i => rows.push([i.date, 'Pemasukan', i.type, i.amountJpy, i.note || '']));
  state.expenses.forEach(e => rows.push([e.date, 'Pengeluaran', e.category, -Math.abs(e.amountJpy), e.note || '']));
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ledger-${selectedMonth}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV diunduh');
}

function resetAllData() {
  if (!confirm('Hapus semua data di perangkat ini dan kembalikan ke awal?')) return;
  localStorage.removeItem(STORAGE_KEY);
  state = structuredClone(DEFAULT_STATE);
  renderNav();
  renderPage();
  showToast('Data direset');
}

document.addEventListener('DOMContentLoaded', () => {
  updateJSTClock();
  renderNav();
  renderPage();
  setInterval(updateJSTClock, 15000);
});
