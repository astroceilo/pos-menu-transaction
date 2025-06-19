# pos-menu-transaction


# 🧾 Aplikasi Kasir POS (Laravel + Inertia + React)

Aplikasi Kasir berbasis Laravel 12 + Inertia.js + React + Vite. Digunakan untuk transaksi makanan, dengan fitur tambah ke keranjang, proses pembayaran, dan cetak struk.

---

## 🚀 Fitur Utama

- ✅ CRUD Makanan/Menu
- 🛒 Tambah ke Keranjang
- ➕➖ Atur Kuantitas
- 💳 Proses Pembayaran
- 🧾 Simpan & Cetak Struk
- 📦 Data Transaksi & Detail Tersimpan ke DB

---

## ⚙️ Kebutuhan Sistem

| Software     | Versi Minimal  |
|--------------|----------------|
| PHP          | 8.4            |
| Composer     | Terinstal      |
| Node.js      | 22             |
| NPM/Yarn     | Terinstal      |
| SQLite / MySQL | Terinstal    |
| Git          | (opsional)     |

---

## 📥 Instalasi

### 1. Clone Project

```bash
git clone https://github.com/astroceilo/pos-menu-transaction.git
cd nama-proyek
```

Atau ekstrak ZIP dan buka foldernya di terminal.

### 2. Install Dependency Laravel

```bash
composer install
```

### 3. Install Dependency Frontend

```bash
npm install
# atau
# yarn install
```

### 4. Setup File Environment

```bash
cp .env.example .env
php artisan key:generate
```

### 5. Konfigurasi Database

Contoh menggunakan SQLite:

```env
DB_CONNECTION=sqlite
```

Lalu buat file-nya:

```bash
touch database/database.sqlite
```

### 6. Migrasi & Seeder (Opsional)

```bash
php artisan migrate
php artisan db:seed
```

---

## ▶️ Menjalankan Aplikasi

### Backend Laravel:

```bash
php artisan serve
```

### Frontend React + Vite:

```bash
npm run dev
```

Buka browser ke:

```
http://kasir-pos-preview-lazis-task.test
```

---

## 🧾 Cara Transaksi

1. Klik makanan untuk menambah ke keranjang.
2. Tambah atau kurangi kuantitas dengan tombol + / -.
3. Klik **Charge** untuk buka dialog pembayaran.
4. Masukkan nominal uang pembeli.
5. Klik tombol **Pay** untuk menyimpan transaksi.
6. Klik **Print Bill** untuk mencetak struk.

---

## 🖨 Print Struk (Bill)

Setelah transaksi berhasil:

- Tombol `Print Bill` akan aktif
- Halaman cetak akan muncul
- Gunakan `Ctrl + P` untuk mencetak

---

## 🏁 Build untuk Produksi (Opsional)

```bash
npm run build
```

Aset akan berada di folder `public/build`.

---

## 📄 Lisensi

Open-source untuk keperluan pembelajaran dan pengembangan internal.

---

## 🙋‍♂️ Author

- **Nama**: Doni Anggara
- **Tech Stack**: Laravel 12, React, Inertia.js, SQLite

---
