const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outPath = 'C:/Users/trisb/OneDrive/Desktop/zzeatway/eatway-ui-beginner.pdf';
const doc = new PDFDocument({ size: 'A4', margin: 42 });
doc.pipe(fs.createWriteStream(outPath));

twoColumnList = (items) => {
  items.forEach((item) => doc.circle(doc.x - 6, doc.y + 5, 2).fill('#800000').fillColor('#111').text(item, doc.x + 4, doc.y - 2).moveDown(0.2));
};

const brandText = path.join(__dirname, 'src/assets/images/EATWAY_text.png');
const logoSmall = path.join(__dirname, 'src/assets/images/logo_small.png');
const heroChef = path.join(__dirname, 'src/assets/images/hero-chef.png');

function section(title) {
  doc.moveDown(0.8).fillColor('#800000').fontSize(16).text(title, { underline: true });
  doc.moveDown(0.2).fillColor('#111').fontSize(11);
}

// Title
section('Eatway Admin Dashboard - TSX Beginner Trace');
doc.text('Tujuan: jelaskan dari mana elemen di sisi kiri (logo, menu Dashboard/Produk/Akun/Laporan) muncul, dan bagaimana TSX memanggilnya. Ditulis untuk pemula TypeScript + JSX (TSX).');

section('TSX singkat');
doc.text('TSX = TypeScript + JSX. JSX artinya kita menulis markup seperti HTML di dalam JavaScript/TypeScript. TypeScript menambah tipe (interface, type) agar lebih aman.');
doc.moveDown(0.3);
doc.text('Contoh pola dasar:');
doc.font('Courier').fontSize(9).text("import React from 'react'\nfunction MyButton() { return <button>Click</button>; }\nexport default MyButton;\n", { lineBreak: true });
doc.font('Helvetica').fontSize(11);

section('Alur file besar');
doc.list([
  'src/App.tsx: router + pilih layout Admin vs Kasir.',
  'src/components/layout/AppLayout.tsx: bungkus Sidebar + Topbar + Outlet.',
  'src/components/layout/Sidebar.tsx: render logo + menu (Dashboard/Produk/Akun/Laporan).',
  'src/data/mock.ts: berisi daftar navigationLinks dan ikon.',
  'src/components/layout/Topbar.tsx: search bar + notifikasi + user chip (hero-chef.png).',
  'Halaman Dashboard (src/pages/DashboardPage.tsx) ditampilkan di Outlet ketika path "/".',
]);

section('App.tsx (router)');
doc.font('Courier').fontSize(9).text(
"<BrowserRouter>\n  <Routes>\n    <Route path='/' element={<AppLayout .../>}>\n      <Route index element={<DashboardPage />} />\n      ...\n    </Route>\n    ...\n  </Routes>\n</BrowserRouter>\n",
  { lineBreak: true }
);
doc.font('Helvetica').fontSize(11).text('Intinya: kalau URL /, React akan render AppLayout lalu DashboardPage di dalam <Outlet />.');

section('AppLayout.tsx');
doc.font('Courier').fontSize(9).text(
"return (\n  <div className='app-shell'>\n    <Sidebar onLogout={onLogout} />\n    <div className='app-shell__content'>\n      <Topbar userName='Admin' email='admin@gmail.com' />\n      <main className='app-shell__main'><Outlet /></main>\n    </div>\n  </div>\n)\n",
  { lineBreak: true }
);
doc.font('Helvetica').fontSize(11).text('CSS .app-shell membuat grid 2 kolom: kiri Sidebar, kanan konten/topbar.');

section('Sidebar.tsx (logo + menu)');
if (fs.existsSync(brandText)) doc.image(brandText, { width: 110 });
if (fs.existsSync(logoSmall)) doc.image(logoSmall, { width: 50, align: 'left' });
doc.moveDown(0.3);
doc.font('Courier').fontSize(9).text(
"import { NavLink } from 'react-router-dom'\nimport { navigationLinks, systemIcons } from '../../data/mock'\nimport brandText from '../../assets/images/EATWAY_text.png'\nimport logoSmall from '../../assets/images/logo_small.png'\n...\n<nav>\n  {navigationLinks.map(link => (\n    <NavLink key={link.path} to={link.path} className={...}>\n      <img src={link.icon} />\n      <span>{link.label}</span>\n    </NavLink>\n  ))}\n</nav>\n",
  { lineBreak: true }
);
doc.font('Helvetica').fontSize(11).text('Logo muncul karena di-import sebagai module (brandText, logoSmall). Menu muncul karena map navigationLinks ke NavLink. NavLink otomatis menambah .is-active saat URL cocok.');

section('navigationLinks (src/data/mock.ts)');
doc.font('Courier').fontSize(9).text(
"export const navigationLinks = [\n  { label: 'Dashboard', path: '/', icon: iconDashboard },\n  { label: 'Produk', path: '/products', icon: iconProduct },\n  { label: 'Akun', path: '/accounts', icon: iconAccount },\n  { label: 'Laporan', path: '/reports', icon: iconReport },\n];\n",
  { lineBreak: true }
);
doc.font('Helvetica').fontSize(11).text('iconDashboard/iconProduct/... juga di-import di mock.ts dari src/assets/images/icon-*.png.');

section('Topbar.tsx (kanan atas)');
if (fs.existsSync(heroChef)) doc.image(heroChef, { width: 70, align: 'left' });
doc.moveDown(0.2);
doc.font('Courier').fontSize(9).text(
"<header className='topbar'>\n  <SearchInput />\n  <button className='icon-button'>...SVG bell...</button>\n  <div className='user-chip'>\n    <img src={heroChef} alt={userName} />\n    <div><strong>{userName}</strong><span>{email}</span></div>\n  </div>\n</header>\n",
  { lineBreak: true }
);
doc.font('Helvetica').fontSize(11).text('Avatar chef muncul karena import hero-chef.png.');

section('DashboardPage.tsx (konten utama)');
doc.font('Courier').fontSize(9).text(
"import StatCard from '../components/common/StatCard'\nimport { dashboardOverview } from '../data/mock'\n...\n<StatCard key={item.id} item={item} /> // map dashboardOverview\n<DataTable columns={productColumns} rows={products} />\n",
  { lineBreak: true }
);
doc.font('Helvetica').fontSize(11).text('Hero banner kanan pakai hero-chef.png (di file). Statistik pakai data mock/API produk (sudah terhubung).');

section('Ringkasan alur render kiri (day-0)');
doc.list([
  'Browser ke / => App.tsx render AppLayout.',
  'AppLayout render Sidebar (kiri) + Topbar (atas kanan) + Outlet (isi halaman).',
  'Sidebar import image PNG; bundler Vite mengubah import menjadi URL statis.',
  'Sidebar map navigationLinks => NavLink, jadi menu muncul sesuai array.',
  'CSS di App.css mengatur grid dan warna aktif.',
]);

doc.end();
console.log('PDF written to', outPath);
