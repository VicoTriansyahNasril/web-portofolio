# Personal Portfolio & CMS (Go + React)

<p align="center">
  Sebuah platform portofolio pribadi yang canggih, dibangun dari awal dengan arsitektur modern yang memisahkan backend dan frontend. Proyek ini tidak hanya berfungsi sebagai situs portofolio, tetapi juga sebagai <strong>Content Management System (CMS)</strong> lengkap yang memungkinkan pengelolaan semua konten secara dinamis melalui panel admin yang aman.
</p>

<p align="center">
  <strong><a href="https://web-portofolio-vico.vercel.app/">Lihat Demo Langsung »</a></strong>
</p>

---

## ✨ Fitur Utama

Proyek ini terbagi menjadi dua bagian utama: **Situs Publik** yang dilihat pengunjung dan **Panel Admin** untuk mengelola konten.

### 🌐 Situs Publik
-   **Halaman Utama Interaktif:** Pengalaman 3D yang imersif menggunakan **React Three Fiber** sebagai "kartu nama" digital.
-   **Desain Modern & Responsif:** Tampilan yang elegan dan berfungsi dengan baik di semua perangkat, dari desktop hingga mobile, dibangun dengan **Material-UI**.
-   **Halaman Proyek Dinamis:** Menampilkan daftar proyek yang diambil langsung dari database, lengkap dengan *tech stack*, ringkasan, dan gambar sampul.
-   **Detail Proyek Lengkap:** Halaman detail untuk setiap proyek dengan deskripsi dalam format Markdown, galeri gambar, dan tautan ke demo atau repositori.
-   **Halaman "Tentang Saya":** Menampilkan profil, bio, pengalaman kerja, pendidikan, keahlian, dan pencapaian yang semuanya dikelola dari CMS.
-   **Tema Terang & Gelap:** Pengguna dapat beralih antara mode terang dan gelap, dengan latar belakang animasi yang unik untuk setiap tema.

### 🔐 Panel Admin (CMS)
-   **Autentikasi Aman:** Halaman login yang dilindungi, menggunakan **JWT (JSON Web Tokens)** untuk mengamankan semua rute admin.
-   **Manajemen Konten Penuh (CRUD):**
    -   **Proyek:** Tambah, edit, dan hapus proyek. Kelola deskripsi (mendukung Markdown), *tech stack*, URL, gambar sampul, dan galeri.
    -   **Profil:** Kelola semua detail pribadi, termasuk bio, foto, CV, dan tautan sosial.
    -   **Keahlian (Skills):** Tambah, edit, dan hapus keahlian, lalu kelompokkan berdasarkan kategori (misalnya, Frontend, Backend, DevOps).
    -   **Pengalaman & Pencapaian:** Kelola riwayat pekerjaan, pendidikan, organisasi, dan sertifikasi.
-   **Fitur Drag-and-Drop:** Mengatur ulang urutan proyek, keahlian, dan pencapaian dengan mudah untuk ditampilkan di situs publik.
-   **Pengelola Gambar Canggih:**
    -   Unggah gambar dengan *drag-and-drop*.
    -   Fitur **Image Cropper** untuk memotong gambar sampul dan galeri agar sesuai dengan rasio aspek yang diinginkan.

## 🏛️ Arsitektur & Teknologi

Proyek ini dibangun dengan arsitektur *monorepo* yang terorganisir, memisahkan logika backend dan frontend secara bersih.

### Backend (API Service)
![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Gin](https://img.shields.io/badge/Gin-008ECF?style=for-the-badge&logo=gin&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![GORM](https://img.shields.io/badge/GORM-C42828?style=for-the-badge&logo=gorm&logoColor=white)

-   **Bahasa:** Go (Golang)
-   **Framework:** Gin Gonic (untuk performa tinggi dan *routing* yang cepat).
-   **Database:** PostgreSQL.
-   **ORM:** GORM (untuk interaksi database yang efisien dan aman).
-   **API:** Arsitektur RESTful.
-   **Autentikasi:** JWT (JSON Web Tokens).

### Frontend (Client App)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)

-   **Library:** React.js
-   **Build Tool:** Vite (untuk pengembangan yang sangat cepat).
-   **UI:** Material-UI (MUI).
-   **Routing:** React Router.
-   **State Management:** React Context API.
-   **Animasi & 3D:** Framer Motion, React Three Fiber (Three.js), dan TSParticles.

## ☁️ DevOps & Deployment

Proyek ini dirancang untuk alur kerja CI/CD modern yang sepenuhnya otomatis.

-   **Containerization:** Backend Go dibungkus dalam kontainer **Docker** menggunakan *multi-stage build* untuk menghasilkan *image distroless* yang minimalis dan aman.
-   **Backend Hosting:** Dideploy di **Render** sebagai *Web Service*.
    -   Terhubung ke database **PostgreSQL** yang dikelola oleh Render.
    -   Menggunakan **Persistent Disk** dari Render untuk menyimpan file gambar yang diunggah secara permanen.
-   **Frontend Hosting:** Dideploy di **Vercel**. Vercel secara otomatis membangun aplikasi Vite menjadi file statis dan menyajikannya secara global melalui CDN mereka.
-   **CI/CD:** Setiap `git push` ke *branch* `main` di GitHub secara otomatis memicu *deployment* baru di Render dan Vercel, memastikan situs selalu diperbarui dengan kode terbaru.

## 🚀 Menjalankan Proyek Secara Lokal

Proyek ini dirancang untuk dijalankan dengan mudah menggunakan Docker.

### 1. Prasyarat
-   [Docker](https://www.docker.com/) dan Docker Compose terinstal di komputer Anda.
-   [Git](https://git-scm.com/) terinstal.

### 2. Instalasi & Konfigurasi
1.  **Clone repositori ini:**
    ```bash
    git clone https://github.com/VicoTriansyahNasril/web-portofolio.git
    cd web-portofolio
    ```

2.  **Buat file `.env`:**
    Salin file `.env.example` menjadi file baru bernama `.env`.
    ```bash
    cp .env.example .env
    ```
    Isi nilai-nilai yang kosong di dalam file `.env` (seperti `DB_PASSWORD`, `JWT_SECRET`, dll.). Untuk pengembangan lokal, Anda bisa menggunakan nilai-nilai dari `docker-compose.yml`.

3.  **Jalankan dengan Docker Compose:**
    Perintah ini akan membangun *image* backend, menjalankan kontainer backend, database, dan Adminer.
    ```bash
    docker-compose up --build
    ```

4.  **Jalankan Frontend:**
    Buka terminal baru, masuk ke folder frontend, install dependensi, dan jalankan server pengembangan Vite.
    ```bash
    cd frontend-portofolio
    npm install
    npm run dev
    ```

### 5. Akses Aplikasi
-   **Frontend (Situs Publik & Admin):** [http://localhost:5173](http://localhost:5173)
-   **Backend API:** Berjalan di [http://localhost:8080](http://localhost:8080)
-   **Adminer (Manajemen Database):** [http://localhost:8081](http://localhost:8081)

---
Terima kasih telah melihat proyek ini!
