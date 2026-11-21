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
  // ... lanjutkan persis dengan seluruh kode JavaScript dari respons sebelumnya
