# Supabase Kurulum Talimatları

## 1. .env.local Dosyasını Oluşturun

Projenizin ana dizininde `.env.local` dosyası oluşturun ve aşağıdaki bilgileri ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://prxhjyahasxndkqseino.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByeGhqeWFoYXN4bmRrcXNlaW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzgwMzEsImV4cCI6MjA3OTMxNDAzMX0.s8lyM86GqfWA6MyipjOv7CwxegA_Lmh3aEgI23tiXHo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByeGhqeWFoYXN4bmRrcXNlaW5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzczODAzMSwiZXhwIjoyMDc5MzE0MDMxfQ.M-Y9v4Dd16BnjoYxczut_ZVFibDfFu_m8qk5eoUpeKk
```

**Dosya yolu:** `C:\Users\barut\OneDrive\Desktop\Sahibinden.next\.env.local`

## 2. Supabase Storage Bucket Oluşturun

1. [Supabase Dashboard](https://app.supabase.com/project/prxhjyahasxndkqseino/storage/buckets)'a gidin
2. **Storage** > **New Bucket** tıklayın
3. Bucket adı: `listings`
4. **Public bucket** seçeneğini aktif edin ✅
5. **Create bucket** tıklayın

## 3. Dev Server'ı Yeniden Başlatın

```bash
# Mevcut dev server'ı durdurun (Ctrl+C)
# Ardından tekrar başlatın:
npm run dev -- --turbo
```

## 4. Test Edin

1. Giriş yapın (login)
2. `/post-listing` sayfasına gidin
3. Formu doldurun ve resim yükleyin
4. İlanı yayınlayın

✅ **Başarılı olursa:** İlan detay sayfasına yönlendirileceksiniz
❌ **Hata alırsanız:** Browser console'da hata mesajını kontrol edin
