# Login Flow (Admin & Kasir) — Lengkap

Dokumen ini menjelaskan alur login di frontend (Vite + React TSX), mulai dari form, request ke API, respons yang diharapkan, normalisasi role, penyimpanan session, hingga routing (admin/kasir). Disertai potongan kode agar mudah dilacak.

## Ringkasannya
- Form login ada di `src/pages/LoginPage.tsx`.
- API client login ada di `src/api/users.ts` (`loginUser(username, password)`).
- State session & routing ada di `src/App.tsx`.
- Role yang dipakai frontend: `admin` atau `cashier` (kata kunci diterima: `admin`, `cashier`, `kasir` → dinormalisasi).
- Token & role disimpan di `localStorage` (`eatway:token`, `eatway:role`).
- Admin area route `/`; Kasir area route `/cashier`.

## Form & submit (LoginPage.tsx)
File: `src/pages/LoginPage.tsx`
```tsx
interface LoginCredentials {
  username: string
  password: string
}

export default function LoginPage({ onLogin, ...props }: LoginPageProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({ username: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await onLogin(credentials) // <-- dipasok dari App.tsx
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal login, coba lagi.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }
```
- Input yang dikirim: `username` + `password`.
- Error dari API ditampilkan di bawah form (`login-error`).

## Panggilan API (users.ts)
File: `src/api/users.ts`
```ts
export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data: LoginResponse = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = typeof data?.message === "string" ? data.message : "Login failed";
    throw new Error(message);
  }
  return data;
}
```
- Endpoint: `POST http://localhost:8000/login`.
- Body: `{"username": "...", "password": "..."}`.
- Harapan respons (minimal):
  ```json
  {
    "status": 1,
    "msg": "Login berhasil",
    "user": { "role": "Kasir" },
    "accessToken": "dummy-token"
  }
  ```
  - `user.role` dipakai untuk penentuan admin/kasir.
  - `accessToken` jika ada akan disimpan ke localStorage; saat ini belum dipakai di header fetch lain (belum ada attach Authorization).

## State & routing (App.tsx)
File: `src/App.tsx`
```tsx
type Role = 'admin' | 'cashier'
const ROLE_STORAGE_KEY = 'eatway:role'
const TOKEN_STORAGE_KEY = 'eatway:token'

function normalizeRole(role?: string | null): Role | null {
  if (!role) return null
  const normalizedRole = role.toLowerCase()
  if (normalizedRole === 'admin') return 'admin'
  if (normalizedRole === 'cashier' || normalizedRole === 'kasir') return 'cashier'
  return null
}

const [role, setRole] = useState<Role | null>(() => {
  const storedRole = localStorage.getItem(ROLE_STORAGE_KEY)
  return storedRole === 'admin' || storedRole === 'cashier' ? storedRole : null
})
const [, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY))
```
- Saat mount, role/token diambil dari localStorage.
- Normalisasi role: `kasir` → `cashier`, `admin` → `admin`.

### Fungsi login di App.tsx
```tsx
const persistSession = (nextRole: Role, response?: LoginResponse) => {
  setRole(nextRole)
  localStorage.setItem(ROLE_STORAGE_KEY, nextRole)

  if (response?.accessToken) {
    setToken(response.accessToken)
    localStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken)
  } else {
    setToken(null)
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }
}

const handleLogin = async (credentials: LoginCredentials, expectedRole: Role) => {
  const response = await loginUser(credentials.username, credentials.password)
  const detectedRole = normalizeRole(response?.user?.role) ?? expectedRole
  persistSession(detectedRole, response)
}
```
- Tidak ada lagi guard role mismatch (dulu ada, sekarang percaya pada role API).
- Jika `user.role` tidak ada, fallback ke `expectedRole` (dikirim dari halaman login admin/kasir).

### Routing & proteksi
Di AppRoutes (dalam App.tsx):
- `role === 'admin'` → akses ke `/` (Dashboard, Products, Accounts, Reports).
- `role === 'cashier'` → akses ke `/cashier` (kasir routes).
- Jika tidak ada role → diarahkan ke `/login` atau `/cashier/login`.

## Perubahan penting untuk backend (sinkron login baru)
- Backend harus menerima body `{ "username": "...", "password": "..." }`.
- Respons harus menyertakan `user.role` dengan nilai `admin`, `Kasir`/`cashier`, atau yang bisa dinormalisasi.
- Jika ingin memakai token di request lain, tambahkan `accessToken` di respons dan update fetch lain untuk memakai Authorization header (belum dilakukan).

## Contoh respons yang diterima frontend
```json
{
  "status": 1,
  "msg": "Login berhasil",
  "user": { "role": "Kasir", "username": "kasir", "email": "Kasir@gmail.com" },
  "accessToken": "dummy-token"
}
```
Ini cukup untuk:
- Menentukan role kasir → diarahkan ke `/cashier`.
- Menyimpan token di localStorage (meski belum dipakai di header lain).

## Jalur masuk untuk Admin vs Kasir
- Admin login page: `/login`, prop `onLogin` dipanggil dengan expectedRole `'admin'`.
- Kasir login page: `/cashier/login`, prop `onLogin` dipanggil dengan expectedRole `'cashier'`.
- Setelah berhasil, `role` diset dari API (dinormalisasi) lalu router menempatkan user ke halaman awal sesuai role:
  - Admin → `/`
  - Kasir → `/cashier`

## Jika ingin menambahkan Authorization header ke semua fetch
(belum diimplementasi)
- Ambil token dari localStorage `eatway:token`.
- Tambah header `Authorization: Bearer ${token}` di setiap API client (users, produk, pesanan, detail-pesanan, cart).

## File rujukan cepat
- Form: `src/pages/LoginPage.tsx`
- API client: `src/api/users.ts` (`loginUser`)
- State & routing: `src/App.tsx`
- Kunci localStorage: `eatway:role`, `eatway:token`
- Normalisasi role: fungsi `normalizeRole` di `src/App.tsx`
