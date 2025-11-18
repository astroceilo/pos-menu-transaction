# 🧾 POS Menu Application (Laravel + Inertia + React)

A modern Point of Sale (POS) menu system built using Laravel 12, Inertia.js, React, and Vite.
Designed for food transactions — complete with menu management, cart system, payments, and receipt printing.

---

## 🚀 Features

- ✔️ Manage Food/Menu (CRUD)
- 🛒 Add to Cart
- ➕➖ Set Quantity
- 💸 Process Payment
- 🧾 Save Transaction + Print Receipt
- 📦 Store Transaction Details in Database

---

## 📦 Tech Stack

| Layer	   | Tools                     |
| Backend  | Laravel 12 (PHP 8.2+)     |
| Frontend | React + Inertia.js + Vite |
| Database | MySQL                     |

---

## ⚙️ Requirements

| Software     | Minimum Version          |
|--------------|--------------------------|
| PHP          | 8.2+                     |
| Composer     | 2.5+ (recommended 2.8.x) |
| Node.js      | 18+                      |

---

## 📥 Installation

### 1. Clone Project

```bash
git clone https://github.com/astroceilo/pos-menu-transaction.git
cd pos-menu-transaction
```

Or extract the ZIP file manually.

### 2. Install Backend Dependency (Laravel)

```bash
composer install
```

### 3. Install Frontend Dependency (React)

```bash
npm install
# or
yarn install
```

### 4. Environment Setup

Copy the example environment file:
```bash
cp .env.example .env
```

Generate the application key:
```bash
php artisan key:generate
```

### 5. Database Configuration

Example for MySQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pos_menu
DB_USERNAME=root
DB_PASSWORD=
```

### 6. Migration (+ Seed Optional)

```bash
php artisan migrate
php artisan db:seed
```

---

## ▶️ Running the App

### Start Laravel backend:

```bash
php artisan serve
```

### Start React frontend:

```bash
npm run dev
```

### App will be available at:

Default URL:
http://127.0.0.1:8000

---

## 🧾 Usage (How to Make a Transaction)

1. Click a menu item to add to cart
2. Adjust quantity with + / −
3. Press **Charge** to open payment popup
4. Enter cash amount
5. Press **Pay** to finish transaction
6. Press **Print Bill** to print the receipt

---

## 🖨 Printing Receipt
After payment:

- Print button becomes active
- The print view opens
- Use **Ctrl + P** to print

---

## 📦 Build for Production

```bash
npm run build
```

Generated assets will be stored in: public/build

---

## 📄 License

Open-source for internal learning and development purposes.

---

## 👤 Author

Doni Anggara
Tech Stack: Laravel, React, Inertia.js, MySQL
GitHub: @astroceilo

---
