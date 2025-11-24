# Testing Guide (Admin + Kasir)

Base URL: `http://localhost:8000`

## 1) Start services
- Backend: `go run main.go` (folder `API_RESTORAN`)
- Frontend: `npm run dev` (folder `eatway2`) lalu buka URL yang muncul.

## 2) Auth / Login
- Endpoint: `POST /login`
- Body:
```json
{"username":"kasir","password":"123"}
```
- Frontend: login via halaman Admin atau Kasir; role ditentukan oleh API response.

## 3) Users (Admin)
- List: `GET /users`
- Detail: `GET /users/{id}`
- Create: `POST /users`
- Update: `PUT /users/{id}`
- Delete: `DELETE /users/{id}`
- Body (POST/PUT):
```json
{"email":"user@example.com","password":"123","username":"arnold","telp":"08123","role":"Kasir","image":""}
```

## 4) Produk (Admin)
- List: `GET /produks`
- Detail: `GET /produks/{id}`
- Create: `POST /produks`
- Update: `PUT /produks/{id}`
- Delete: `DELETE /produks/{id}`
- Body (POST/PUT):
```json
{"nama_produk":"Nasi Goreng","deskripsi":"Enak","stock":10,"price":15000,"image_url":""}
```
- Laporan & Low-stock: pastikan ada produk dengan `stock <= 5`.

## 5) Pesanan (Kasir/Admin)
- List: `GET /pesanans`
- Detail: `GET /pesanans/{id}`
- Create: `POST /pesanans`
- Update status (Setujui/Tolak/Selesai): `PUT /pesanans/{id}`
- Delete: `DELETE /pesanans/{id}`
- Body (POST/PUT):
```json
{"user_id":2,"pesanan_date":"2025-11-20 05:21:28","status":"Pending","note":"Catatan"}
```
- Status yang dipakai di UI kasir: `Pending` (default), `Diproses` (setujui), `Dibatalkan` (tolak), `Selesai` (selesai).

## 6) Detail Pesanan (untuk laporan & detail kasir)
- List: `GET /detail-pesanan`
- Detail: `GET /detail-pesanan/{id}`
- Create: `POST /detail-pesanan`
- Update: `PUT /detail-pesanan/{id}`
- Delete: `DELETE /detail-pesanan/{id}`
- Body (POST/PUT):
```json
{"pesanan_id":1,"produk_id":3,"jumlah_order":2,"subtotal":30000}
```
- Laporan pendapatan mengambil subtotal per pesanan_date; isi beberapa detail untuk pesanan berbeda bulan agar grafik terisi.

## 7) Cart (belum dipakai di UI, opsional)
- List: `GET /carts`
- Create: `POST /carts`
- Update: `PUT /carts/{id}`
- Delete: `DELETE /carts/{id}`
- Body (POST/PUT):
```json
{"user_id":2,"produk_id":1,"quantity":3}
```

## 8) Verifikasi fitur di UI
- Admin: Produk/Accounts list & form (CRUD), Dashboard tabel produk, Laporan grafik + low-stock.
- Kasir: daftar pesanan Menunggu (Setujui -> status `Diproses`, Tolak -> `Ditolak`), Pesanan Diproses (Selesai -> `Selesai`), detail pesanan menampilkan detail-pesanan.
