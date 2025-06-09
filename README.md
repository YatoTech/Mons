<div align="center">
  <h1>Mons 📋 - Manajer Proyek Kanban</h1>
  <img src="https_placeholder_for_your_app_screenshot.png" alt="Mons Project Manager Screenshot" width="800"/>
</div>

<p align="center">
  Aplikasi manajer proyek bergaya Kanban yang modern, intuitif, dan dapat disesuaikan, dibangun dengan Next.js, TypeScript, dan Tailwind CSS. Dirancang untuk berjalan dalam mode demo tanpa database atau terhubung ke database Neon untuk persistensi data.
</p>

<p align="center">
  <a href="https://nextjs.org/"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"></a>
  <a href="https://tailwindcss.com/"><img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"></a>
  <a href="https://ui.shadcn.com/"><img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white"></a>
  <a href="https://opensource.org/licenses/MIT"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge"></a>
</p>

<hr>

<h2>✨ Fitur Utama</h2>
<ul>
  <li><strong>Papan Kanban Interaktif</strong>: Atur tugas Anda dengan mudah menggunakan fungsionalitas <em>drag-and-drop</em>.</li>
  <li><strong>Manajemen Tugas Lengkap</strong>: Buat, lihat detail, perbarui, dan hapus tugas melalui modal yang intuitif.</li>
  <li><strong>Otentikasi</strong>: Sistem login berbasis email/password dan opsi "Continue with Google" (OAuth).</li>
  <li><strong>Mode Demo</strong>: Aplikasi dapat berjalan sepenuhnya di sisi klien tanpa memerlukan konfigurasi database.</li>
  <li><strong>Koneksi Database (Opsional)</strong>: Terintegrasi dengan Neon (PostgreSQL Serverless) untuk menyimpan data Anda.</li>
  <li><strong>Desain Modern & Responsif</strong>: Dibangun dengan komponen UI dari <strong>shadcn/ui</strong> dan <strong>Radix UI</strong>.</li>
  <li><strong>Fitur Tambahan</strong>: Termasuk modal untuk Bantuan, Pengaturan, Profil, Tim, dan fungsionalitas Backup.</li>
</ul>

<h2>🛠️ Dibangun Dengan</h2>
<ul>
  <li><a href="https://nextjs.org/">Next.js</a> 14 (dengan App Router)</li>
  <li><a href="https://www.typescriptlang.org/">TypeScript</a></li>
  <li><a href="https://tailwindcss.com/">Tailwind CSS</a></li>
  <li><a href="https://ui.shadcn.com/">shadcn/ui</a> & <a href="https://www.radix-ui.com/">Radix UI</a></li>
  <li><a href="https://dndkit.com/">dnd-kit</a></li>
  <li><a href="https://lucide.dev/">Lucide React</a></li>
  <li><a href="https://neon.tech/">Neon Serverless Postgres</a> (Opsional)</li>
  <li>ESLint & Prettier</li>
</ul>

<h2>🚀 Memulai</h2>
<p>Ikuti langkah-langkah di bawah ini untuk menjalankan salinan lokal dari proyek ini.</p>

<h3>Prasyarat</h3>
<p>Pastikan Anda telah menginstal <strong>Node.js versi 18 atau yang lebih baru</strong>.</p>
<pre><code>node --version
npm --version</code></pre>

<h3>Instalasi</h3>
<p>Ada dua cara untuk menyiapkan proyek ini: menggunakan skrip otomatis atau secara manual.</p>

<h4>1. Menggunakan Skrip Setup Otomatis (Direkomendasikan)</h4>
<p>Skrip <code>setup.sh</code> akan mengotomatiskan seluruh proses instalasi dependensi dan pembuatan struktur file.</p>
<ol>
  <li>Berikan izin eksekusi pada skrip:
    <pre><code>chmod +x setup.sh</code></pre>
  </li>
  <li>Jalankan skrip:
    <pre><code>./setup.sh</code></pre>
  </li>
</ol>
<p>Skrip akan membuat direktori <code>mons-project-manager/</code> dan melakukan semua penyiapan yang diperlukan di dalamnya.</p>

<h4>2. Instalasi Manual</h4>
<p>Jika Anda tidak dapat menggunakan skrip atau lebih suka melakukannya secara manual:</p>
<ol>
  <li><strong>Buat proyek Next.js baru:</strong>
    <pre><code>npx create-next-app@latest mons-project-manager --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
cd mons-project-manager</code></pre>
  </li>
  <li><strong>Instal semua dependensi:</strong>
    <pre><code>npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-switch @radix-ui/react-avatar @radix-ui/react-alert-dialog @radix-ui/react-separator lucide-react class-variance-authority clsx tailwind-merge @neondatabase/serverless
npm install -D @types/node</code></pre>
  </li>
  <li><strong>Inisialisasi dan tambahkan komponen shadcn/ui:</strong>
    <pre><code>npx shadcn-ui@latest init
npx shadcn-ui@latest add button input textarea card badge dialog dropdown-menu select tabs switch avatar alert-dialog separator</code></pre>
  </li>
</ol>

<h3>Langkah Terakhir: Salin Kode Sumber</h3>
<blockquote>
  <p><strong>PENTING</strong>: Salin semua file dan folder dari kode sumber <code>v0</code> Anda ke dalam direktori proyek <code>mons-project-manager/</code> yang baru dibuat, sesuai dengan struktur foldernya (<code>app/</code>, <code>components/</code>, <code>lib/</code>).</p>
</blockquote>

<h3>Konfigurasi Variabel Lingkungan (Opsional)</h3>
<p>Aplikasi ini dapat berjalan tanpa file <code>.env</code>. Namun, jika Anda ingin menghubungkannya ke database Neon:</p>
<ol>
  <li>Buat salinan dari file <code>.env.local.example</code>:
    <pre><code>cp .env.local.example .env.local</code></pre>
  </li>
  <li>Buka file <code>.env.local</code> dan isi <code>NEON_DATABASE_URL</code> dengan URL koneksi database Anda.</li>
</ol>

<h2>💻 Penggunaan</h2>
<p>Setelah instalasi selesai dan kode sumber telah disalin, jalankan server pengembangan:</p>
<pre><code>npm run dev</code></pre>
<p>Buka <a href="http://localhost:3000">http://localhost:3000</a> di browser Anda.</p>

<h3>Kredensial Demo</h3>
<p>Gunakan kredensial berikut untuk login:</p>
<ul>
  <li><strong>Email</strong>: <code>alice@example.com</code> | <strong>Password</strong>: <code>password123</code></li>
  <li><strong>Email</strong>: <code>bob@example.com</code> | <strong>Password</strong>: <code>password123</code></li>
</ul>
<p>Atau, klik <strong>"Continue with Google"</strong> untuk mencoba alur otentikasi Google (dalam mode demo).</p>

<h2>🔧 Pengaturan VSCode (Direkomendasikan)</h2>
<p>Untuk pengalaman pengembangan terbaik, instal ekstensi VSCode berikut:</p>
<ul>
  <li><code>bradlc.vscode-tailwindcss</code></li>
  <li><code>ms-vscode.vscode-typescript-next</code></li>
  <li><code>esbenp.prettier-vscode</code> (atur sebagai formatter default)</li>
  <li><code>ms-vscode.vscode-eslint</code></li>
  <li><code>formulahendry.auto-rename-tag</code></li>
  <li><code>christian-kohler.path-intellisense</code></li>
</ul>
<p>Skrip <code>setup.sh</code> secara otomatis membuat file <code>.vscode/settings.json</code> dengan konfigurasi yang direkomendasikan.</p>

<h2>🤝 Berkontribusi</h2>
<p>Kontribusi membuat komunitas open source menjadi tempat yang luar biasa untuk belajar, menginspirasi, dan berkreasi. Setiap kontribusi yang Anda buat sangat kami hargai.</p>
<p>Jika Anda memiliki saran untuk perbaikan, silakan <em>fork</em> repositori ini dan buat <em>pull request</em>. Anda juga bisa membuka <em>issue</em> dengan tag "enhancement". Jangan lupa untuk memberikan bintang pada proyek ini! Terima kasih sekali lagi!</p>
<ol>
  <li>Fork Proyek ini</li>
  <li>Buat Branch Fitur Anda (<code>git checkout -b feature/AmazingFeature</code>)</li>
  <li>Commit Perubahan Anda (<code>git commit -m 'Add some AmazingFeature'</code>)</li>
  <li>Push ke Branch (<code>git push origin feature/AmazingFeature</code>)</li>
  <li>Buka sebuah Pull Request</li>
</ol>

<h2>📄 Lisensi</h2>
<p>Didistribusikan di bawah Lisensi MIT. Lihat <code>LICENSE.txt</code> untuk informasi lebih lanjut.</p>

<h2>📧 Kontak</h2>
<p>Nama Anda – <a href="https://twitter.com/akun_twitter">@akun_twitter</a> – email@example.com</p>
<p>Tautan Proyek: <a href="https://github.com/username/mons-project-manager">https://github.com/username/mons-project-manager</a></p>
