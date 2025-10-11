require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Bot tokenni .env faylidan olish
const token = process.env.BOT_TOKEN;

if (!token) {
  console.error('❌ Xato: BOT_TOKEN topilmadi. .env faylida BOT_TOKEN ni belgilang.');
  process.exit(1);
}

// Botni yaratish
const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Bot ishga tushdi...');

// /start komandasi
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name;
  
  const welcomeMessage = `
Salom ${firstName}! 👋

Men oddiy Telegram botman. Sizga qanday yordam bera olaman?

📋 Mavjud komandalar:
/start - Botni ishga tushirish
/help - Yordam
/salom - Salom aytish
/info - Bot haqida ma'lumot
  `;
  
  bot.sendMessage(chatId, welcomeMessage);
});

// /help komandasi
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = `
📚 Yordam bo'limi:

Komandalar ro'yxati:
/start - Botni ishga tushirish
/help - Bu yordam xabarini ko'rsatish
/salom - Salom aytish
/info - Bot haqida ma'lumot

Shuningdek, menga oddiy xabar yuborsangiz, men sizga javob beraman! 💬
  `;
  
  bot.sendMessage(chatId, helpMessage);
});

// /salom komandasi
bot.onText(/\/salom/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name;
  
  bot.sendMessage(chatId, `Salom ${firstName}! 👋 Bugun qanday?`);
});

// /info komandasi
bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  
  const infoMessage = `
ℹ️ Bot haqida ma'lumot:

📝 Nom: Oddiy Telegram Bot
🔧 Versiya: 1.0.0
💻 Dasturlash tili: Node.js
📦 Kutubxona: node-telegram-bot-api

Bu bot oddiy shablon sifatida yaratilgan. Siz uni o'z ehtiyojlaringizga moslashtira olasiz!
  `;
  
  bot.sendMessage(chatId, infoMessage);
});

// Barcha matnli xabarlarga javob
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  // Agar xabar komanda bo'lmasa
  if (text && !text.startsWith('/')) {
    bot.sendMessage(chatId, `Siz yozdingiz: "${text}"\n\nMen oddiy botman, lekin sizning xabaringizni qabul qildim! ✅`);
  }
});

// Xatolarni ushlab qolish
bot.on('polling_error', (error) => {
  console.error('❌ Polling xatosi:', error.message);
});

// Jarayonni to'xtatishda
process.on('SIGINT', () => {
  console.log('\n👋 Bot to\'xtatilmoqda...');
  bot.stopPolling();
  process.exit(0);
});
