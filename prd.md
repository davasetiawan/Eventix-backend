# PRD - Eventix

## Problem Statement

Banyak penyelenggara event skala kecil hingga menengah masih mengelola penjualan tiket secara manual melalui media sosial atau aplikasi pesan instan. Proses tersebut sering menyebabkan kesulitan dalam mengelola informasi event, pencatatan pembelian tiket, verifikasi pembayaran, serta distribusi tiket kepada peserta.

Eventix hadir sebagai platform yang memudahkan penyelenggara dalam membuat dan mengelola event serta memudahkan pengguna untuk menemukan, membeli, dan memperoleh tiket event secara digital dengan sistem pembayaran manual melalui verifikasi oleh organizer.

---

# Goals

* Menyediakan platform untuk publikasi dan pengelolaan event.
* Memudahkan pengguna dalam mencari dan membeli tiket event.
* Mempermudah organizer dalam mengelola event, tiket, serta pembayaran.
* Menyediakan sistem verifikasi organizer oleh admin untuk menjaga kualitas platform.
* Menghasilkan tiket digital yang dapat diunduh setelah pembayaran berhasil diverifikasi.

---

# Target Users

## 1. User (Pengunjung)

Pengguna yang ingin mencari event dan membeli tiket secara online.

## 2. Organizer

Penyelenggara event yang ingin mempublikasikan event dan menjual tiket.

## 3. Admin

Pengelola platform yang bertugas mengelola pengguna, organizer, serta event.

---

# User Stories

## User

* Sebagai user, saya ingin membuat akun agar dapat membeli tiket event.
* Sebagai user, saya ingin login menggunakan email atau Google agar proses masuk lebih mudah.
* Sebagai user, saya ingin melihat daftar event agar dapat menemukan event yang saya inginkan.
* Sebagai user, saya ingin mencari event agar lebih mudah menemukan event tertentu.
* Sebagai user, saya ingin melihat detail event sebelum membeli tiket.
* Sebagai user, saya ingin memilih jenis tiket dan jumlah tiket sebelum checkout.
* Sebagai user, saya ingin memilih metode pembayaran yang tersedia.
* Sebagai user, saya ingin melihat informasi pembayaran agar dapat melakukan transfer.
* Sebagai user, saya ingin mengunggah bukti pembayaran agar organizer dapat memverifikasi pembayaran saya.
* Sebagai user, saya ingin melihat status pembayaran.
* Sebagai user, saya ingin melihat dan mengunduh tiket yang telah berhasil dibeli.

## Organizer

* Sebagai organizer, saya ingin memiliki dashboard untuk melihat ringkasan penjualan.
* Sebagai organizer, saya ingin menambah, mengubah, dan menghapus event.
* Sebagai organizer, saya ingin mengunggah banner atau flyer event.
* Sebagai organizer, saya ingin mengelola jenis tiket, harga, dan kuota tiket.
* Sebagai organizer, saya ingin mengelola metode pembayaran yang digunakan pada event saya.
* Sebagai organizer, saya ingin melihat daftar pembayaran yang masuk.
* Sebagai organizer, saya ingin melihat bukti pembayaran dari pembeli.
* Sebagai organizer, saya ingin menerima atau menolak pembayaran.
* Sebagai organizer, saya ingin mengelola profil organizer.

## Admin

* Sebagai admin, saya ingin melihat statistik platform.
* Sebagai admin, saya ingin memverifikasi akun organizer.
* Sebagai admin, saya ingin mengelola akun organizer.
* Sebagai admin, saya ingin mengelola akun pengguna.
* Sebagai admin, saya ingin menyetujui atau menghapus event.

---

# Functional Requirements

## 1. Autentikasi

* Pengguna dapat melakukan registrasi sebagai User atau Organizer.
* Pengguna dapat login menggunakan email dan password.
* Pengguna dapat login menggunakan Google.
* Pengguna dapat logout.

---

## 2. Pengunjung (User)

### Profil

* Melihat profil.
* Mengubah profil.

### Event

* Melihat daftar event.
* Mencari event.
* Melihat detail event yang berisi banner, deskripsi, jadwal, lokasi, harga, dan organizer.

### Pembelian Tiket

* Memilih jenis tiket.
* Memilih jumlah tiket.
* Melakukan checkout.

### Pembayaran

* Memilih metode pembayaran.
* Melihat informasi pembayaran.
* Mengunggah bukti pembayaran.
* Melihat status pembayaran.

### Tiket

* Melihat tiket yang telah dibeli.
* Mengunduh tiket dalam format PDF.

---

## 3. Organizer

### Dashboard

* Melihat total event.
* Melihat total tiket terjual.
* Melihat total pendapatan.

### Kelola Event

* Menambah event.
* Mengubah event.
* Menghapus event.
* Mengunggah banner atau flyer event.

### Kelola Tiket

* Menambah jenis tiket.
* Mengatur harga tiket.
* Mengatur kuota tiket.

### Kelola Metode Pembayaran

* Menambah metode pembayaran.
* Mengubah metode pembayaran.
* Menghapus metode pembayaran.
* Mengatur informasi rekening bank atau e-wallet.
* Mengaktifkan atau menonaktifkan metode pembayaran.

### Verifikasi Pembayaran

* Melihat daftar pembayaran.
* Melihat bukti pembayaran.
* Menerima pembayaran.
* Menolak pembayaran.

### Profil Organizer

* Melihat profil organizer.
* Mengubah profil organizer.

---

## 4. Admin

### Dashboard

* Melihat statistik platform.

### Manajemen Organizer

* Memverifikasi akun organizer.
* Mengelola akun organizer.

### Manajemen User

* Mengelola akun pengguna.

### Manajemen Event

* Menyetujui event.
* Menghapus event.

---

## 5. Keamanan

* Login menggunakan email dan password.
* Login menggunakan Google.
* Password disimpan dalam bentuk terenkripsi.
* Setiap tiket memiliki QR Code yang unik.

---

# Non Functional Requirements

### Performance

* Halaman utama dapat dimuat dengan cepat.
* Sistem mampu menangani banyak pengguna secara bersamaan tanpa mengurangi performa secara signifikan.

### Security

* Password disimpan menggunakan hashing.
* Validasi autentikasi dan otorisasi berdasarkan role (User, Organizer, Admin).
* QR Code tiket bersifat unik.

### Usability

* Antarmuka mudah digunakan.
* Desain responsif untuk desktop dan perangkat mobile.
* Navigasi sederhana dan konsisten.

### Reliability

* Data pengguna, event, pembayaran, dan tiket tersimpan secara konsisten.
* Sistem mampu menjaga integritas data selama proses pembelian dan verifikasi pembayaran.

### Maintainability

* Struktur aplikasi dibuat modular agar mudah dikembangkan dan dipelihara.

---

# Scope

## In Scope

* Registrasi User dan Organizer.
* Login menggunakan email/password dan Google.
* Pengelolaan profil pengguna.
* Pengelolaan event oleh organizer.
* Pengelolaan tiket.
* Pengelolaan metode pembayaran manual.
* Upload bukti pembayaran.
* Verifikasi pembayaran oleh organizer.
* Verifikasi organizer oleh admin.
* Approve event oleh admin.
* Dashboard organizer.
* Dashboard admin.
* Tiket digital dalam format PDF.
* QR Code unik pada tiket.

## Out of Scope

* Payment Gateway otomatis.
* Pembayaran menggunakan kartu kredit/debit.
* QR Code check-in di lokasi event.
* Sistem refund otomatis.
* Notifikasi email otomatis.
* Aplikasi mobile native.


# Fitur Website Eventix

## Role : Admin, Organizer, User

## 1. Autentikasi

* Register sebagai User atau Organizer
* Login 
    * sebagai admin
    * sebagai organizer
    * sebagai user
* Login dengan Google
* Logout

---

## 2. Pengunjung (User)

### A. Profil

* Lihat profil
* Edit profil

### B. Event

* Lihat daftar event
* Cari event
* Lihat detail event (banner, deskripsi, jadwal, lokasi, harga, organizer)

### C. Pembelian Tiket

* Pilih jenis tiket
* Pilih jumlah tiket
* Checkout

### D. Pembayaran

* Pilih metode pembayaran
* Lihat informasi pembayaran
* Upload bukti pembayaran
* Lihat status pembayaran

### E. Tiket

* Lihat tiket yang telah dibeli
* Download tiket (PDF)

---

## 3. Organizer

### A. Dashboard

* Total event
* Total tiket terjual
* Total pendapatan

### B. Kelola Event

* Tambah event
* Edit event
* Hapus event
* Upload banner/flyer event

### C. Kelola Tiket

* Tambah jenis tiket
* Atur harga tiket
* Atur kuota tiket

### D. Kelola Metode Pembayaran

* Tambah metode pembayaran
* Edit metode pembayaran
* Hapus metode pembayaran
* Atur informasi rekening bank atau e-wallet
* Aktifkan/Nonaktifkan metode pembayaran

### E. Verifikasi Pembayaran

* Lihat daftar pembayaran
* Lihat bukti pembayaran
* Terima pembayaran
* Tolak pembayaran

### F. Profil Organizer

* Lihat profil
* Edit profil

---

## 4. Admin

### A. Dashboard

* Lihat statistik platform

### B. Manajemen Organizer

* Verifikasi akun organizer
* Kelola akun organizer

### C. Manajemen User

* Kelola akun pengguna

### D. Manajemen Event

* Approve event
* Hapus event

---

## 5. Keamanan

* Login dengan Email & Password
* Login dengan Google
* Enkripsi Password
* QR Code tiket unik
