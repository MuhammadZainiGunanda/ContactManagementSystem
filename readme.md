# Contacts Management System API

## Description
Aplikasi ini adalah sebuah RESTful API yang memberikan pengguna kemampuan untuk mengelola daftar kontak mereka dengan efisien dan aman. Dengan mudah digunakan dan fungsionalitas yang kuat, aplikasi ini menjadi alat yang berguna dalam mengatur dan mengakses informasi kontak. Melalui API ini, pengguna dapat melakukan berbagai operasi seperti membuat, membaca, memperbarui, dan menghapus kontak. Setiap endpoint dijelaskan dengan jelas dalam struktur OpenAPI, memungkinkan integrasi yang mudah dengan aplikasi atau sistem lainnya. Dengan adanya keamanan yang diimplementasikan melalui penggunaan token JWT untuk otentikasi, API ini memberikan perlindungan yang andal terhadap akses yang tidak sah terhadap data kontak pengguna.

## Key Features

* Registrasi
     - Pengguna dapat mendaftar dengan memberikan username, email, dan password.
     - Input yang dimasukkan akan divalidasi, dan pengguna akan mendapatkan respons sesuai dengan hasil validasi.

* Log in
     - Pengguna dapat melakukan autentikasi untuk masuk ke dalam aplikasi.
     - Autentikasi dilakukan dengan menggunakan token JWT yang divalidasi.
     - Setelah masuk, pengguna akan diberikan token JWT untuk otorisasi di setiap permintaan selanjutnya.

* User Profile
     - Pengguna dapat melihat profil mereka sendiri setelah masuk ke dalam aplikasi.
     - Informasi yang ditampilkan mencakup username dan nama pengguna.

* Update User Profile
     - Pengguna dapat memperbarui informasi profil mereka.
     - Informasi yang dapat diperbarui meliputi username dan password.

* Log out
     - Pengguna dapat keluar dari aplikasi untuk mengakhiri sesi mereka.
     - Setelah keluar, token JWT akan dinonaktifkan untuk mencegah akses yang tidak sah.

* Create Contact
     - Pengguna dapat membuat kontak baru dengan menyediakan informasi seperti nama depan, nama belakang, email, dan nomor telepon.

* Get Contact
     - Pengguna dapat mengakses kontak yang tersimpan dalam aplikasi.
     - Kontak dapat ditemukan berdasarkan nama, nomor telepon, atau email.

* Update Contact
     - Pengguna dapat memperbarui informasi kontak yang sudah ada.
     - Informasi yang dapat diperbarui meliputi nama depan, nama belakang, email, dan nomor telepon.

* Delete Contact
     - Pengguna dapat menghapus kontak yang tidak diperlukan lagi dari daftar kontak mereka.

* Seacrh Contact
     - Pengguna dapat mencari kontak berdasarkan nama, nomor telepon, atau email.
     - Hasil pencarian akan ditampilkan dalam bentuk daftar kontak yang sesuai dengan kriteria pencarian pengguna.

* Create Address
     - Pengguna dapat menambahkan alamat baru dengan menyediakan informasi seperti alamat, kota, kode pos, negara, dan informasi tambahan jika diperlukan.

* Get Address
     - Pengguna dapat melihat detail dari alamat yang tersimpan dalam aplikasi.
     - Informasi yang ditampilkan mencakup alamat lengkap, kota, kode pos, negara, dan informasi tambahan jika ada.

* Update Address
     - Pengguna dapat memperbarui informasi dari alamat yang sudah ada.
     - Informasi yang dapat diperbarui meliputi alamat, kota, kode pos, negara, dan informasi tambahan.

* Delete Address
     - Pengguna dapat menghapus alamat yang tidak diperlukan lagi dari daftar alamat mereka.

* Search Address
     - Pengguna dapat mencari alamat berdasarkan berbagai kriteria seperti nama kota, kode pos, atau negara.
     - Hasil pencarian akan ditampilkan dalam bentuk daftar alamat yang sesuai dengan kriteria pencarian pengguna.


## Development requirements
Jika developer ingin menjalankan dan merevisi source code, maka perlu dilakukan langkah-langkah berikut:

### Technical Requirements
    - Languages: TypeScript
    - Frameworks: Express, Prisma, Zod, JSONwebtoken, Cookieparser, Bcrypt

### Running the Application

    git clone https://github.com/zennsketchy/ContactManagementSystem.git

### Set Up

     - `npm install` untuk menginstal dependensi back-end.

     - `npx prisma migrate dev` untuk melakukan migrasi basis data dengan Prisma.

     - `npx prisma generate`untuk genereate kode Prisma.

     - `npm run build` untuk membangun proyek.
     
     - `npm run start` untuk memulai server.