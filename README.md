# Sparse Ride

Modern bir Next.js tabanlı sınıflandırılmış ilanlar platformu (Next-generation classifieds platform)

## 🚀 Teknoloji Stack

### **Frontend**
- **Next.js 16.0.3** (App Router)
- **React 19.2.0**
- **TypeScript 5**
- **TailwindCSS 4**
- **Lucide React** (Icons)

### **Backend & Database**
- **Prisma ORM 5.22.0**
- **PostgreSQL** (via Supabase)
- **Supabase** (Database + Storage)
- **Server Actions** (Next.js)

### **Authentication**
- **Jose** (JWT)
- **bcryptjs**
- Custom middleware-based auth

### **Diğer Kütüphaneler**
- **Leaflet & React-Leaflet** (Harita)
- **CSV Parse** (Veri import)

---

## ✨ Özellikler

### **Ana Sayfa**
- Hero section (Animated background)
- Live stats (Gerçek zamanlı sayaçlar)
- 12+ farklı section (Recent listings, trending, hot deals, vs.)
- Premium showcase
- Testimonials

### **İlan Verme Akışı (Post Listing)**
6 adımlı form wizard:
1. **Kategori** - Kategori + araç hiyerarşisi seçimi
2. **Detaylar** - Başlık, fiyat, km, renk
3. **Durum** - Görsel hasar selector + Tramer
4. **Özellikler** - Donanım seçimi
5. **Fotoğraflar** - Drag-n-drop upload
6. **Yayınla** - Paket seçimi + onay

### **Kategori Sayfaları**
- Dynamic routing
- Hierarchical filtering
- Real database listings

### **İlan Detay**
- Image gallery
- Hasar gösterimi (read-only)
- Seller sidebar
- Map integration

### **Kullanıcı Sistemi**
- Login/Register
- JWT auth
- Protected routes
- User dashboard
- Corporate registration

---

## 🛠️ Kurulum

### **Gereksinimler**
- Node.js 18+
- PostgreSQL database (Supabase)

### **Adımlar**

1. **Dependencies yükleyin:**
```bash
npm install
```

2. **Environment variables:**
`.env` dosyası oluşturun ve Supabase bilgilerinizi ekleyin:
```env
DATABASE_URL="your-database-url"
DIRECT_URL="your-direct-url"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-key"
```

3. **Database setup:**
```bash
npx prisma migrate dev
npx prisma db seed
```

4. **Supabase Storage:**
- `listings` isimli bucket oluşturun (public)
- Detaylar için `SUPABASE_SETUP.md` dosyasına bakın

5. **Development server:**
```bash
npm run dev
```

6. **Production build:**
```bash
npm run build
npm start
```

---

## 📂 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Ana sayfa
│   ├── post-listing/      # İlan verme
│   ├── category/          # Kategori sayfaları
│   ├── listing/           # İlan detay
│   ├── account/           # Kullanıcı paneli
│   ├── admin/             # Admin paneli
│   └── corporate/         # Kurumsal kayıt
├── components/            # React components
│   ├── home/             # Ana sayfa componentleri
│   ├── listing/          # İlan componentleri
│   ├── category/         # Kategori componentleri
│   ├── layout/           # Layout componentleri
│   └── ui/               # UI componentleri
├── lib/
│   ├── actions/          # Server actions
│   ├── auth-edge.ts      # Auth utilities
│   ├── prisma.ts         # Prisma client
│   ├── supabase.ts       # Supabase client
│   └── storage.ts        # File storage
├── data/                  # Static data
├── types/                 # TypeScript types
└── middleware.ts          # Auth middleware

prisma/
├── schema.prisma         # Database schema
├── migrations/           # DB migrations
└── seed*.ts             # Seed scripts
```

---

## 🗄️ Database Schema

- **User** - Kullanıcı sistemi (Hierarchical consultant support)
- **DealerProfile** - Kurumsal kullanıcı profilleri
- **Listing** - Ana ilan modeli (Vasıta + Emlak fields)
- **Category** - Kategoriler (Hierarchical)
- **Image, Equipment, DamageReport** - İlan ilişkileri
- **SavedFilter, Favorite** - Kullanıcı tercihleri
- **SiteStats, CategoryStats** - Analytics

---

## 🎯 Proje Durumu

### **Tamamlanan**
- ✅ Ana sayfa ve tüm sections
- ✅ Post listing flow (Vasıta için full)
- ✅ Category pages
- ✅ Listing detail pages
- ✅ Authentication system
- ✅ Database schema & seed
- ✅ Image upload (Supabase)
- ✅ Admin ve Dashboard

### **Devam Eden / Planlanıyor**
- ⏳ Plaka sorgulama (Tramer API)
- ⏳ Emlak kategorisi için post listing
- ⏳ Payment integration
- ⏳ Messaging system
- ⏳ Email notifications
- ⏳ SEO optimization

---

## 📝 Scriptler

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Database
npx prisma studio          # Database GUI
npx prisma migrate dev     # Run migrations
npx prisma db seed         # Seed data
npx prisma generate        # Generate Prisma client

# Lint
npm run lint
```

---

## 📄 Lisans

Private project

---

## 👥 Geliştirici

Next.js 16 | React 19 | TypeScript | Prisma | Supabase
