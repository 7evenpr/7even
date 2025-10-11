# 🤖 Telegram Bot - O'zbek tilida

Bu oddiy Telegram bot Node.js va `node-telegram-bot-api` kutubxonasi yordamida yaratilgan.

## 📋 Talablar

- Node.js (v18 yoki yuqori)
- npm (Node Package Manager)
- Telegram akkaunt

## 🚀 O'rnatish va ishga tushirish

### 1-qadam: Bot yaratish

1. Telegram'da [@BotFather](https://t.me/botfather) botini toping
2. `/newbot` komandasini yuboring
3. Bot uchun nom kiriting (masalan: "Mening Botim")
4. Bot uchun username kiriting (masalan: "MeningBotiBot")
5. BotFather sizga token beradi (masalan: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2-qadam: Paketlarni o'rnatish

```bash
cd telegram-bot
npm install
```

### 3-qadam: Token sozlash

1. `.env.example` faylini `.env` deb nomlang:
```bash
cp .env.example .env
```

2. `.env` faylini oching va BotFather'dan olgan tokenni kiriting:
```
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

### 4-qadam: Botni ishga tushirish

```bash
npm start
```

Agar hammasi to'g'ri bo'lsa, konsolda "🤖 Bot ishga tushdi..." yozuvi paydo bo'ladi.

## 📱 Botni ishlatish

Telegram'da botingizni toping va quyidagi komandalarni sinab ko'ring:

- `/start` - Botni ishga tushirish
- `/help` - Yordam
- `/salom` - Salom aytish
- `/info` - Bot haqida ma'lumot

Shuningdek, botga oddiy matn xabarlarini yuborsangiz, u javob beradi!

## 🛠️ Bot funksiyalarini kengaytirish

`bot.js` faylini tahrirlash orqali botga yangi komandalar va funksiyalar qo'shishingiz mumkin.

### Yangi komanda qo'shish misoli:

```javascript
bot.onText(/\/yangi_komanda/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Bu yangi komanda!');
});
```

## 📚 Qo'shimcha imkoniyatlar

Bot quyidagi funksiyalarni qo'shish uchun kengaytirilishi mumkin:

- ✅ Inline klaviaturalar
- ✅ Rasm va fayl yuborish
- ✅ Ma'lumotlar bazasi bilan ishlash
- ✅ API bilan integratsiya
- ✅ Admin paneli
- ✅ va boshqalar...

## 🔍 Muammolarni hal qilish

### Bot ishlamayapti?

1. `.env` faylida token to'g'ri kiritilganligini tekshiring
2. Internet aloqangizni tekshiring
3. BotFather'da bot o'chirilmaganligini tekshiring

### "polling_error" xatosi?

Bu odatda internet aloqasi yoki noto'g'ri token bilan bog'liq. Tokenni qayta tekshiring.

## 📞 Yordam

Agar savollaringiz bo'lsa, Telegram Bot API dokumentatsiyasiga murojaat qiling:
https://core.telegram.org/bots/api

## 📄 Litsenziya

Bu loyiha erkin foydalanish uchun taqdim etiladi.
