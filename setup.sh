#!/bin/bash

# Hentikan skrip jika terjadi error
set -e

# === Variabel Warna untuk Output ===
C_RESET='\033[0m'
C_RED='\033[0;31m'
C_GREEN='\033[0;32m'
C_YELLOW='\033[0;33m'
C_CYAN='\033[0;36m'
C_BOLD='\033[1m'

# === Nama Proyek ===
PROJECT_NAME="mons-project-manager"

echo -e "${C_CYAN}${C_BOLD}🚀 Memulai Setup Otomatis untuk Aplikasi Mons...${C_RESET}"
echo "-----------------------------------------------------"

# --- Langkah 0: Pengecekan Prasyarat ---
echo -e "\n${C_YELLOW}LANGKAH 0: Memeriksa Prasyarat (Node.js & npm)...${C_RESET}"
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo -e "${C_RED}Error: Node.js dan/atau npm tidak ditemukan.${C_RESET}"
    echo "Silakan install Node.js (versi 18 atau lebih baru) dari https://nodejs.org/ dan coba lagi."
    exit 1
fi
echo -e "${C_GREEN}✅ Node.js dan npm ditemukan.${C_RESET}"
node --version
npm --version

# --- Langkah 1: Inisialisasi Proyek Next.js ---
echo -e "\n${C_YELLOW}LANGKAH 1: Membuat direktori dan proyek Next.js...${C_RESET}"
if [ -d "$PROJECT_NAME" ]; then
    echo -e "${C_YELLOW}Direktori '$PROJECT_NAME' sudah ada. Proses setup akan dilakukan di dalam direktori tersebut.${C_RESET}"
else
    mkdir $PROJECT_NAME
    echo -e "${C_GREEN}✅ Direktori '$PROJECT_NAME' berhasil dibuat.${C_RESET}"
fi
cd $PROJECT_NAME

# Inisialisasi Next.js jika belum ada file package.json
if [ ! -f "package.json" ]; then
    npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
    echo -e "${C_GREEN}✅ Proyek Next.js berhasil diinisialisasi.${C_RESET}"
else
    echo -e "${C_YELLOW}✅ File 'package.json' sudah ada, langkah inisialisasi Next.js dilewati.${C_RESET}"
fi

# --- Langkah 2: Instalasi Semua Dependensi ---
echo -e "\n${C_YELLOW}LANGKAH 2: Menginstal semua dependensi yang dibutuhkan...${C_RESET}"
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities \
            @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select \
            @radix-ui/react-tabs @radix-ui/react-switch @radix-ui/react-avatar \
            @radix-ui/react-alert-dialog @radix-ui/react-separator \
            lucide-react class-variance-authority clsx tailwind-merge \
            @neondatabase/serverless
npm install -D @types/node
echo -e "${C_GREEN}✅ Semua dependensi berhasil diinstal.${C_RESET}"

# --- Langkah 3: Setup shadcn/ui ---
echo -e "\n${C_YELLOW}LANGKAH 3: Mengkonfigurasi dan menginstal komponen shadcn/ui...${C_RESET}"
# Inisialisasi non-interaktif
npx shadcn-ui@latest init -y

# Tambahkan semua komponen dalam satu perintah
npx shadcn-ui@latest add button input textarea card badge dialog dropdown-menu select tabs switch avatar alert-dialog separator
echo -e "${C_GREEN}✅ Komponen shadcn/ui berhasil ditambahkan.${C_RESET}"

# --- Langkah 4: Membuat Struktur File & Direktori ---
echo -e "\n${C_YELLOW}LANGKAH 4: Membuat struktur file dan direktori yang diperlukan...${C_RESET}"
# Hapus file page.tsx dan layout.tsx default untuk digantikan nanti
rm -f app/page.tsx app/layout.tsx

# Membuat file placeholder agar mudah diisi
touch app/loading.tsx
mkdir -p lib
touch lib/actions.ts lib/auth.ts lib/db.ts lib/init-db.ts lib/types.ts lib/utils.ts
touch components/account-dropdown.tsx components/add-task-modal.tsx \
      components/auth-guard.tsx components/backup-modal.tsx components/help-modal.tsx \
      components/kanban-column.tsx components/login-page.tsx components/profile-modal.tsx \
      components/settings-modal.tsx components/task-card.tsx components/task-detail-modal.tsx \
      components/team-modal.tsx components/welcome-screen.tsx
echo -e "${C_GREEN}✅ Struktur file dan direktori berhasil dibuat.${C_RESET}"

# --- Langkah 5: Membuat Konfigurasi VSCode & Contoh .env ---
echo -e "\n${C_YELLOW}LANGKAH 5: Membuat file konfigurasi tambahan...${C_RESET}"
# Membuat folder dan file settings.json untuk VSCode
mkdir -p .vscode
cat <<EOF > .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\\\s*\\\\(([^)]*)\\\\)", "[\"'\\\`]([^\"'\\\`]*).*?[\"'\\\`]"],
    ["cx\\\\s*\\\\(([^)]*)\\\\)", "(?:'|\\\"|\\\`)([^']*)(?:'|\\\"|\\\`)"]
  ]
}
EOF
echo -e "${C_GREEN}✅ File '.vscode/settings.json' berhasil dibuat.${C_RESET}"

# Membuat file .env.local.example
cat <<EOF > .env.local.example
# Ganti dengan URL koneksi database Neon Anda (jika digunakan)
# Format: postgresql://user:password@host/dbname?sslmode=require
NEON_DATABASE_URL=your_database_url_here

# Untuk production (sesuaikan jika perlu)
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
echo -e "${C_GREEN}✅ File '.env.local.example' berhasil dibuat.${C_RESET}"
echo -e "${C_YELLOW}   -> Salin '.env.local.example' menjadi '.env.local' jika Anda ingin menggunakan database.${C_RESET}"


# --- Selesai ---
echo -e "\n-----------------------------------------------------"
echo -e "${C_GREEN}${C_BOLD}🎉 SETUP SELESAI! 🎉${C_RESET}"
echo "-----------------------------------------------------"
echo -e "\n${C_BOLD}Langkah Terakhir yang Perlu Anda Lakukan:${C_RESET}"
echo -e "1. ${C_CYAN}Salin kode dari project v0 Anda${C_RESET} ke dalam folder yang sesuai:"
echo "   - Isi dari folder \`app/\` -> ke \`$PROJECT_NAME/app/\`"
echo "   - Isi dari folder \`components/\` -> ke \`$PROJECT_NAME/components/\`"
echo "   - Isi dari folder \`lib/\` -> ke \`$PROJECT_NAME/lib/\`"
echo -e "\n2. Setelah menyalin semua file, jalankan aplikasi dengan perintah:"
echo -e "   ${C_BOLD}cd $PROJECT_NAME${C_RESET}"
echo -e "   ${C_BOLD}npm run dev${C_RESET}"
echo -e "\nBuka browser dan akses ${C_BOLD}http://localhost:3000${C_RESET}"
echo -e "-----------------------------------------------------\n"
