# Vue-Supabase Dashboard Monitor

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)

**Vue-Supabase Dashboard Monitor** adalah aplikasi web monitoring operasional yang modern dan responsif. Aplikasi ini dirancang untuk memfasilitasi manajemen data secara *real-time* dengan pemisahan hak akses yang ketat antara manajemen dan operasional lapangan, didukung oleh infrastruktur backend Supabase yang andal.

---

## Fitur Unggulan

### 1. Authentication & Security
Sistem autentikasi yang aman menggunakan **Supabase Auth**. State autentikasi dikelola secara global menggunakan **Pinia**, memastikan sesi pengguna tetap terjaga dan aman di seluruh aplikasi.

### 2. Role-Based Access Control (RBAC)
Aplikasi menerapkan pembatasan akses yang ketat berdasarkan peran pengguna:
* **Manajer**: Memiliki akses penuh ke *Dashboard Statistik* untuk melihat performa bisnis.
* **Operator**: Memiliki akses terbatas ke halaman operasional khusus.
* **Navigation Guards**: Proteksi rute (`router.beforeEach`) mencegah pengguna mengakses halaman yang tidak sesuai dengan hak aksesnya.

### 3. Real-time Dashboard
Pusat informasi interaktif untuk pengambilan keputusan:
* **Statistik Kunci**: Memantau Volume, Revenue, dan Jumlah Kendaraan secara langsung.
* **Live Feed**: Aliran data operasional terbaru.
* **Auto-Refresh**: Data diperbarui secara otomatis setiap **30 detik** untuk memastikan akurasi tanpa perlu *refresh* halaman manual.
* **Filter Dinamis**: Analisis data berdasarkan periode (Hari ini, Mingguan, Bulanan) menggunakan fitur `watch` effect dari Vue.

### 4. Data Visualization
Visualisasi data yang informatif menggunakan **Chart.js**:
* Grafik performa berdasarkan Shift kerja.
* Statistik kategori kendaraan.

---

## Teknologi yang Digunakan

Daftar teknologi utama berdasarkan konfigurasi proyek:

* **Core Framework**: Vue 3 (Composition API / Script Setup)
* **Build Tool**: Vite
* **Styling**: Tailwind CSS v4 & DaisyUI
* **State Management**: Pinia
* **Routing**: Vue Router
* **Backend & Auth**: Supabase (BaaS)
* **Visualisasi Data**: Chart.js / Vue-Chartjs
* **Peta**: Leaflet
* **Notifikasi**: Vue3-Toastify

---