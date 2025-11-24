const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outPath = 'C:/Users/trisb/OneDrive/Desktop/zzeatway/eatway-ui-trace.pdf';
const doc = new PDFDocument({ size: 'A4', margin: 48 });
doc.pipe(fs.createWriteStream(outPath));

const brandText = path.join(__dirname, 'src/assets/images/EATWAY_text.png');
const logoSmall = path.join(__dirname, 'src/assets/images/logo_small.png');

function section(title) {
  doc.moveDown(0.6).fontSize(14).fillColor('#800000').text(title, { underline: true });
  doc.moveDown(0.2).fillColor('#111').fontSize(11);
}

// Title
section('Eatway Dashboard UI Trace (Admin)');
doc.text('Halaman Dashboard admin disusun oleh AppLayout yang memuat Sidebar + Topbar + main (Outlet). Sidebar memakai data mock untuk navigasi dan brand.');

// Sidebar visual crop
section('Crop kiri (Sidebar brand & menu)');
if (fs.existsSync(brandText)) doc.image(brandText, { width: 120 });
if (fs.existsSync(logoSmall)) doc.image(logoSmall, { width: 60, align: 'left' });
doc.moveDown(0.3).text('Asset di-load langsung sebagai import di Sidebar.tsx:');
doc.font('Courier').fontSize(9).text("import brandText from '../../assets/images/EATWAY_text.png'\nimport logoSmall from '../../assets/images/logo_small.png'\n", { lineBreak: true });
doc.font('Helvetica').fontSize(10).text('Brand ditampilkan di <div className="sidebar__brand"> lalu diikuti nav link dari navigationLinks.');

// Trace chain
section('Alur komponen');
doc.list([
  'App.tsx: Router => path / => <AppLayout /> untuk area admin.',
  'AppLayout.tsx: membungkus <Sidebar onLogout> + <Topbar userName="Admin" email="admin@gmail.com"> + <Outlet>.',
  'Sidebar.tsx: ambil navigationLinks dari src/data/mock.ts, render <NavLink> Dashboard/Produk/Akun/Laporan.',
  'Topbar.tsx: render SearchInput, tombol notifikasi (SVG inline), dan user chip dengan hero-chef.png.',
]);

section('Sumber data menu (navigationLinks)');
doc.font('Courier').fontSize(9).text(
  "export const navigationLinks = [\n  { label: 'Dashboard', path: '/', icon: iconDashboard },\n  { label: 'Produk', path: '/products', icon: iconProduct },\n  { label: 'Akun', path: '/accounts', icon: iconAccount },\n  { label: 'Laporan', path: '/reports', icon: iconReport },\n]\n",
  { lineBreak: true }
);
doc.font('Helvetica').fontSize(10).text('Ikon di-load dari src/assets/images/icon-*.png melalui data/mock.ts, lalu dipakai di Sidebar NavLink.');

section('Hero / konten kanan');
doc.text('Topbar memakai hero-chef.png sebagai avatar. DashboardPage memuat hero-chef.png di hero banner (kanan) dan statistik memakai mock data/real API produk.');

section('File penting');
doc.list([
  'src/App.tsx',
  'src/components/layout/AppLayout.tsx',
  'src/components/layout/Sidebar.tsx',
  'src/components/layout/Topbar.tsx',
  'src/data/mock.ts (navigationLinks + icons)',
  'src/assets/images/EATWAY_text.png, logo_small.png, icon-*.png',
]);

section('Cara rendering sidebar dari awal');
doc.text('1) Vite bundler memproses import PNG di Sidebar.tsx (brandText/logoSmall).\n2) navigationLinks di data/mock.ts memasok label/path/icon.\n3) Sidebar map navigationLinks -> <NavLink> (react-router-dom) sehingga highlight aktif mengikuti URL.\n4) AppLayout menaruh Sidebar di kiri dan Topbar+Outlet di kanan, CSS di src/App.css mengatur layout dua kolom.');

section('CSS yang memposisikan kiri-kanan');
doc.font('Courier').fontSize(9).text('.app-shell { display: grid; grid-template-columns: 280px 1fr; min-height: 100vh; }\n.sidebar { padding: 24px; display: flex; flex-direction: column; gap: 24px; }\n.sidebar__nav .sidebar__link.is-active { background: #f4e8df; color: #9a1d1d; }', { lineBreak: true });

doc.end();
console.log('PDF written to', outPath);
