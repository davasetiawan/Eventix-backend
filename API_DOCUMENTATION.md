# 📖 Dokumentasi Endpoint API Eventix Backend (Berdasarkan Role)

Eventix adalah platform khusus **penjualan tiket konser**. Dokumen ini berisi panduan seluruh endpoint API yang dikelompokkan secara hirarkis berdasarkan **Role Pengguna** (Public, User, Organizer, Admin) dan **Kategori Fitur** di dalamnya.

---

## 🌐 Informasi Server & Autentikasi

* **Base API URL**: `http://localhost:3000/api/v1`
* **Swagger UI (Interaktif)**: `http://localhost:3000/docs`
* **Superadmin Default**: `admin@gmail.com` / `Admin123!`

### Cara Membuka Gembok Otorisasi (🔒):
1. Jalankan `POST /api/v1/auth/login`.
2. Salin nilai `accessToken` dari respon.
3. Klik tombol **Authorize** 🔒 di kanan atas Swagger UI, paste token, klik **Authorize** → **Close**.

---

# 1. 🌐 PUBLIC / UNAUTHENTICATED (Pengunjung Umum)

Endpoint yang dapat diakses oleh siapa saja tanpa memerlukan token login.

### 🔑 A. Autentikasi
| Method | Endpoint | Deskripsi / Fungsi |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Mendaftar akun baru (role `USER` atau `ORGANIZER`). |
| `POST` | `/api/v1/auth/login` | Login akun dan menerima JWT `accessToken`. |
| `POST` | `/api/v1/auth/google` | Login / Registrasi instan dengan Google Token. |

### 📅 B. Informasi Event (Publik)
| Method | Endpoint | Deskripsi / Fungsi |
|---|---|---|
| `GET` | `/api/v1/events` | Melihat daftar event (support query `search` & `categoryId`). |
| `GET` | `/api/v1/events/{id}` | Melihat detail lengkap 1 event beserta jenis tiket & organizer. |

### 💳 C. Informasi Pembayaran
| Method | Endpoint | Deskripsi / Fungsi |
|---|---|---|
| `GET` | `/api/v1/payment-methods/organizer/{organizerId}` | Melihat nomor rekening/e-wallet aktif milik organizer. |
| `GET` | `/api/v1/payment-methods/{id}` | Melihat detail 1 metode pembayaran. |

### 📂 D. Kategori Event
| Method | Endpoint | Deskripsi / Fungsi |
|---|---|---|
| `GET` | `/api/v1/categories` | Melihat daftar kategori event (Konser, Seminar, Olahraga, dll). |
| `GET` | `/api/v1/categories/{id}` | Melihat detail 1 kategori event. |

---

# 2. 👤 ROLE: USER (Pembeli / Pengunjung Terdaftar)

Endpoint khusus untuk pengguna terdaftar yang membeli tiket dan mengelola akun pribadi.

### 👤 A. Profil Pengguna
| Method | Endpoint | Access | Deskripsi / Fungsi |
|---|---|---|---|
| `GET` | `/api/v1/auth/me` | 🔒 USER | Melihat data profil sendiri. |
| `PATCH` | `/api/v1/users/{id}` | 🔒 USER | Mengubah profil pribadi (Nama, Foto Avatar, Telepon). |

### 🎟️ B. Pemesanan & Pembayaran Tiket
| Method | Endpoint | Access | Deskripsi / Fungsi |
|---|---|---|---|
| `POST` | `/api/v1/registrations` | 🔒 USER | Checkout / memesan tiket event (pilih jenis tiket & jumlah). |
| `POST` | `/api/v1/uploads` | 🔒 USER | Mengunggah foto bukti transfer pembayaran. |
| `PATCH` | `/api/v1/registrations/{id}/payment-proof` | 🔒 USER | Menyimpan URL foto bukti pembayaran pada pesanan tiket. |

### 🎫 C. Tiket & Sertifikat Saya
| Method | Endpoint | Access | Deskripsi / Fungsi |
|---|---|---|---|
| `GET` | `/api/v1/registrations/my-tickets` | 🔒 USER | Melihat daftar seluruh tiket yang telah dibeli. |
| `GET` | `/api/v1/registrations/{id}` | 🔒 USER | Melihat detail 1 tiket registrasi. |
| `GET` | `/api/v1/registrations/{id}/ticket-pdf` | 🔒 USER | **Mengunduh Tiket Digital PDF resmi lengkap dengan QR Code unik.** |
| `GET` | `/api/v1/certificates/my-certificates` | 🔒 USER | Melihat daftar sertifikat event yang dimiliki. |

---

# 3. 🎪 ROLE: ORGANIZER (Penyelenggara Event)

Endpoint khusus untuk penyelenggara acara dalam mengelola event, jenis tiket, metode pembayaran, dan verifikasi transaksi.

### 📊 A. Dashboard Organizer
| Method | Endpoint | Access | Deskripsi / Fungsi |
|---|---|---|---|
| `GET` | `/api/v1/dashboard/organizer` | 🔒 ORGANIZER | Ringkasan statistik (Total Event, Tiket Terjual, Total Pendapatan). |

### 👤 B. Profil Organizer
| Method | Endpoint | Access | Deskripsi / Fungsi |
|---|---|---|---|
| `GET` | `/api/v1/auth/me` | 🔒 ORGANIZER | Melihat data profil organizer. |
| `PATCH` | `/api/v1/users/{id}` | 🔒 ORGANIZER | Mengubah profil organizer (Nama Organisasi, Bio, Telepon, Avatar). |

### 📅 C. Kelola Event
| Method | Endpoint | Access | Deskripsi / Fungsi |
|---|---|---|---|
| `GET` | `/api/v1/events/my-events` | 🔒 ORGANIZER | Melihat daftar seluruh event yang dibuat oleh organizer ini. |
| `POST` | `/api/v1/uploads` | 🔒 ORGANIZER | Upload foto flyer / banner event. |
| `POST` | `/api/v1/events` | 🔒 ORGANIZER | Membuat acara/event baru. |
| `PATCH` | `/api/v1/events/{id}` | 🔒 ORGANIZER | Memperbarui data event. |
| `DELETE` | `/api/v1/events/{id}` | 🔒 ORGANIZER | Menghapus event. |

### 🎫 D. Kelola Jenis Tiket (Ticket Tiers)
| Method | Endpoint | Access | Deskripsi / Fungsi |
|---|---|---|---|
| `POST` | `/api/v1/events/{id}/ticket-tiers` | 🔒 ORGANIZER | Menambah jenis tiket baru (contoh: VIP, Regular, Early Bird). |
| `PATCH` | `/api/v1/events/ticket-tiers/{tierId}` | 🔒 ORGANIZER | Mengubah harga atau kuota jenis tiket. |
| `DELETE` | `/api/v1/events/ticket-tiers/{tierId}` | 🔒 ORGANIZER | Menghapus opsi jenis tiket. |

### 💳 E. Kelola Metode Pembayaran Manual
| Method | Endpoint | Access | Deskripsi / Fungsi |
|---|---|---|---|
| `POST` | `/api/v1/payment-methods` | 🔒 ORGANIZER | Menambah nomor rekening bank / e-wallet penerima transfer. |
| `GET` | `/api/v1/payment-methods/my-methods` | 🔒 ORGANIZER | Melihat daftar rekening/e-wallet miliknya sendiri. |
| `PATCH` | `/api/v1/payment-methods/{id}` | 🔒 ORGANIZER | Mengubah / Mengaktifkan / Menonaktifkan rekening bank atau e-wallet. |
| `DELETE` | `/api/v1/payment-methods/{id}` | 🔒 ORGANIZER | Menghapus metode pembayaran. |

### 💰 F. Verifikasi Pembayaran Masuk
| Method | Endpoint | Access | Deskripsi / Fungsi |
|---|---|---|---|
| `GET` | `/api/v1/registrations/organizer/payments` | 🔒 ORGANIZER | Melihat daftar semua transaksi pembayaran masuk dari pembeli. |
| `PATCH` | `/api/v1/registrations/{id}/verify-payment` | 🔒 ORGANIZER | Menyetujui (*Approve*) atau menolak (*Reject*) bukti bayar pembeli. |

### 📜 G. Penerbitan Sertifikat
| Method | Endpoint | Access | Deskripsi / Fungsi |
|---|---|---|---|
| `POST` | `/api/v1/certificates` | 🔒 ORGANIZER | Menerbitkan sertifikat digital untuk peserta event. |

---

# 4. 🛡️ ROLE: ADMIN (Pengelola Platform)

Endpoint dengan hak akses tertinggi untuk mengontrol seluruh platform Eventix.

### 📊 A. Dashboard Admin
| Method | Endpoint | Access | Deskripsi / Fungsi |
|---|---|---|---|
| `GET` | `/api/v1/dashboard/admin` | 🔒 ADMIN | Statistik seluruh platform (Total User, Organizer, Event, Tiket, Revenue). |

### 👥 B. Manajemen User & Organizer
| Method | Endpoint | Access | Deskripsi / Fungsi |
|---|---|---|---|
| `GET` | `/api/v1/users` | 🔒 ADMIN | Melihat daftar seluruh pengguna terdaftar di platform. |
| `GET` | `/api/v1/users/organizers` | 🔒 ADMIN | Melihat khusus daftar semua akun Organizer. |
| `PATCH` | `/api/v1/users/{id}/verify-organizer` | 🔒 ADMIN | Memverifikasi akun Organizer (memberi status sah / centang hijau). |
| `DELETE` | `/api/v1/users/{id}` | 🔒 ADMIN | Menghapus akun pengguna dari database. |

### 📅 C. Manajemen Event Platform
| Method | Endpoint | Access | Deskripsi / Fungsi |
|---|---|---|---|
| `PATCH` | `/api/v1/events/{id}/approve` | 🔒 ADMIN | Menyetujui (*approve*) event yang dibuat organizer agar terbit resmi. |
| `DELETE` | `/api/v1/events/{id}` | 🔒 ADMIN | Menghapus event yang melanggar aturan. |

### 📂 D. Manajemen Kategori Event
| Method | Endpoint | Access | Deskripsi / Fungsi |
|---|---|---|---|
| `POST` | `/api/v1/categories` | 🔒 ADMIN | Menambah kategori event baru. |
| `PATCH` | `/api/v1/categories/{id}` | 🔒 ADMIN | Mengubah nama/deskripsi kategori event. |
| `DELETE` | `/api/v1/categories/{id}` | 🔒 ADMIN | Menghapus kategori event. |

---

## 🔄 Alur Integrasi Lengkap Sistem (System Flow)

```
1. 🌐 UNAUTHENTICATED
   ├── User/Organizer Registrasi & Login ──► (Mendapatkan JWT Token 🔒)

2. 🛡️ ROLE ADMIN
   ├── Verifikasi Akun Organizer ─────────► (PATCH /users/{id}/verify-organizer)
   └── Setujui Event Organizer ───────────► (PATCH /events/{id}/approve)

3. 🎪 ROLE ORGANIZER
   ├── Atur Rekening Pembayaran ──────────► (POST /payment-methods)
   ├── Buat Event & Upload Banner ────────► (POST /events)
   ├── Tambah Jenis Tiket (VIP/Reg) ──────► (POST /events/{id}/ticket-tiers)
   └── Verifikasi Pembayaran Pembeli ─────► (PATCH /registrations/{id}/verify-payment)

4. 👤 ROLE USER (PEMBELI)
   ├── Cari & Lihat Event ────────────────► (GET /events/{id})
   ├── Pemesanan Tiket (Checkout) ────────► (POST /registrations)
   ├── Upload Bukti Transfer ─────────────► (PATCH /registrations/{id}/payment-proof)
   └── Unduh Tiket Digital PDF + QR Code ──► (GET /registrations/{id}/ticket-pdf)
```
