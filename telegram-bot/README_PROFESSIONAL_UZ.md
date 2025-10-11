# 🚀 Professional Telegram Bot - O'zbek tilida

Bu professional Telegram bot quyidagi funksiyalarga ega:

## ✨ Xususiyatlari

### 📹 Video Yuklovchi
- ✅ **YouTube** - Har qanday YouTube videosini yuklab olish
- ✅ **TikTok** - TikTok videolarini watermark'siz yuklab olish
- ✅ **Instagram** - Instagram reels va videolarini yuklab olish  
- ✅ **Facebook** - Facebook videolarini yuklab olish

### 🎵 Musiqa Topuvchi (Shazam kabi)
- ✅ **Ovoz orqali topish** - Audio fayl yoki voice message yuborib musiqa topish
- ✅ **To'liq ma'lumot** - Qo'shiq nomi, artist, albom, chiqarilgan sana
- ✅ **Streaming havolalar** - Spotify va Apple Music havolalari
- ✅ **Yuqori aniqlik** - AudD API yordamida

### 📊 Qo'shimcha Funksiyalar
- ✅ **Ma'lumotlar bazasi** - Barcha amallar va statistika saqlanadi
- ✅ **Admin panel** - To'liq statistika va boshqaruv
- ✅ **Inline klaviaturalar** - Qulay foydalanish uchun
- ✅ **Xatoliklarni boshqarish** - Professional xatolik xabarlari

## 📋 Talablar

- Node.js v18+ 
- npm
- Telegram akkaunt
- AudD API key (musiqa topish uchun - BEPUL)
- FFmpeg (video konvertatsiya uchun, ixtiyoriy)

## 🚀 O'rnatish

### 1-qadam: Telegram Bot yaratish

1. [@BotFather](https://t.me/botfather) ga o'ting
2. `/newbot` ni yuboring
3. Bot nomi va username kiriting
4. Tokenni saqlang

### 2-qadam: AudD API Key olish (BEPUL)

1. https://audd.io/ saytiga kiring
2. Ro'yxatdan o'ting (bepul)
3. Dashboard'dan API key'ni oling
4. Kuniga 200 marta bepul foydalanish mumkin!

### 3-qadam: O'zingizning Telegram ID ni oling

1. [@userinfobot](https://t.me/userinfobot) ga o'ting
2. `/start` ni bosing
3. O'z ID'ingizni ko'ring va saqlang

### 4-qadam: Loyihani sozlash

```bash
# Paketlarni o'rnatish
cd telegram-bot
npm install

# .env faylini sozlash
# .env faylini oching va quyidagilarni to'ldiring:
```

**`.env` fayli:**
```env
# Telegram Bot Token (BotFather dan)
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# Sizning Telegram ID (userinfobot dan)
ADMIN_ID=123456789

# AudD API Key (audd.io dan)
AUDD_API_KEY=abc123def456

# Sozlamalar
MAX_VIDEO_SIZE_MB=50
```

### 5-qadam: Botni ishga tushirish

```bash
npm start
```

Agar hammasi to'g'ri bo'lsa:
```
🤖 Professional Bot ishga tushdi!
📊 Tayyorlik: Video yuklovchi, Musiqa topuvchi va boshqalar
✅ Bot tayyor! Foydalanuvchilarni kutmoqda...
```

## 📱 Foydalanish

### Video yuklab olish:
1. Botda `/start` ni bosing
2. "📹 Video Yuklab Olish" ni tanlang
3. Platformani tanlang (YouTube, TikTok, ...)
4. Video havolasini yuboring
5. Video yuklanishini kuting!

### Musiqa topish:
1. Botda `/start` ni bosing
2. "🎵 Musiqa Topish" ni tanlang
3. Audio fayl yoki voice message yuboring
4. Natijani oling!

### Admin panel:
- `/admin` - To'liq statistika (faqat admin uchun)

## 🛠️ Texnik Ma'lumotlar

### Arxitektura:
```
telegram-bot/
├── bot.js              # Asosiy bot logikasi
├── database.js         # Ma'lumotlar bazasi (SQLite)
├── videoDownloader.js  # Video yuklovchi modullar
├── musicRecognizer.js  # Musiqa topuvchi modul
├── package.json        # Paketlar va sozlamalar
├── .env               # Konfiguratsiya (maxfiy!)
├── .gitignore         # Git uchun e'tiborsiz qoldiriladigan fayllar
├── bot.db             # SQLite bazasi (avtomatik yaratiladi)
└── downloads/         # Vaqtinchalik fayllar (avtomatik yaratiladi)
```

### Ishlatilgan kutubxonalar:
- `node-telegram-bot-api` - Telegram bot API
- `@distube/ytdl-core` - YouTube yuklovchi
- `axios` - HTTP so'rovlar
- `better-sqlite3` - Ma'lumotlar bazasi
- `form-data` - Fayl yuklash
- `dotenv` - Konfiguratsiya

## 🔍 Muammolarni Hal Qilish

### Bot ishlamayapti?
- `.env` faylida tokenlar to'g'ri kiritilganini tekshiring
- `npm install` qayta ishga tushiring
- Internet aloqangizni tekshiring

### Video yuklanmayapti?
- URL to'g'ri ekanligini tekshiring
- Video mualliflik huquqi bilan himoyalanganmi?
- Video juda katta bo'lishi mumkin (50MB limit)

### Musiqa topilmayapti?
- Audio sifati yaxshi bo'lishi kerak
- Fon shovqini kam bo'lishi kerak
- AudD API key faol ekanligini tekshiring

### "API key" xatosi?
- AudD API key to'g'ri kiritilganini tekshiring
- Kunlik limit (200) tugaganmi?
- https://audd.io/ da hisobingizni tekshiring

## 🌟 Kelajakdagi Yangilanishlar

- [ ] Facebook video yuklovchi
- [ ] Twitter/X video yuklovchi
- [ ] Yuklab olingan videolarni kompressiya qilish
- [ ] Playlist yuklab olish (YouTube)
- [ ] Musiqa matni (lyrics) ko'rsatish
- [ ] Ko'p tilda qo'llab-quvvatlash
- [ ] Premium versiya (limitsiz)

## 📞 Yordam va Qo'llab-quvvatlash

### API Dokumentatsiyalar:
- Telegram Bot API: https://core.telegram.org/bots/api
- AudD API: https://docs.audd.io/
- ytdl-core: https://github.com/distubejs/ytdl-core

### Foydali Havolalar:
- Node.js o'rganish: https://nodejs.org/
- SQLite: https://www.sqlite.org/
- FFmpeg: https://ffmpeg.org/

## 🔒 Xavfsizlik

⚠️ **MUHIM:**
- `.env` faylini hech qachon ulashmang!
- Tokenlaringizni GitHub'ga yuklmang!
- `.gitignore` faylini o'chirmaslik!
- Admin ID ni to'g'ri sozlang

## 📄 Litsenziya

Bu loyiha shaxsiy va o'quv maqsadlarida foydalanish uchun yaratilgan.

## 🎉 Omad Tilaymiz!

Botingiz tayyor! Agar savollar bo'lsa, dokumentatsiyani o'qing yoki yordam so'rang.

**Enjoy coding! 🚀**
