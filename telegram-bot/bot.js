require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { addOrUpdateUser, addStatistic, addDownload, getStatistics, getUserStats } = require('./database');
const { downloadYouTube, downloadTikTok, downloadInstagram, detectPlatform, cleanupFile } = require('./videoDownloader');
const { recognizeMusic, isValidAudioFormat } = require('./musicRecognizer');
const fs = require('fs');
const path = require('path');

// Konfiguratsiya
const token = process.env.BOT_TOKEN;
const adminId = parseInt(process.env.ADMIN_ID);
const auddApiKey = process.env.AUDD_API_KEY;

if (!token) {
  console.error('❌ Xato: BOT_TOKEN topilmadi!');
  process.exit(1);
}

// Bot yaratish
const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Professional Bot ishga tushdi!');
console.log('📊 Tayyorlik: Video yuklovchi, Musiqa topuvchi va boshqalar');

// Inline klaviatura - Asosiy menyu
const mainMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '📹 Video Yuklab Olish', callback_data: 'menu_video' },
        { text: '🎵 Musiqa Topish', callback_data: 'menu_music' }
      ],
      [
        { text: '📊 Statistika', callback_data: 'menu_stats' },
        { text: 'ℹ️ Yordam', callback_data: 'menu_help' }
      ]
    ]
  }
};

// Video platformalar menyusi
const videoPlatformsMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '▶️ YouTube', callback_data: 'platform_youtube' },
        { text: '📱 TikTok', callback_data: 'platform_tiktok' }
      ],
      [
        { text: '📷 Instagram', callback_data: 'platform_instagram' },
        { text: '👥 Facebook', callback_data: 'platform_facebook' }
      ],
      [{ text: '🔙 Orqaga', callback_data: 'back_main' }]
    ]
  }
};

// /start komandasi
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || '';
  const firstName = msg.from.first_name || '';
  const lastName = msg.from.last_name || '';

  // Foydalanuvchini bazaga qo'shish
  addOrUpdateUser(userId, username, firstName, lastName);
  addStatistic(userId, 'start');

  const welcomeMessage = `
🎉 <b>Xush kelibsiz, ${firstName}!</b>

Men professional Telegram botman va sizga quyidagi xizmatlarni taklif etaman:

📹 <b>Video Yuklovchi:</b>
• YouTube
• TikTok
• Instagram
• Facebook

🎵 <b>Musiqa Topuvchi:</b>
• Ovoz yozuvidan musiqa topish
• Qo'shiq ma'lumotlari
• Spotify/Apple Music havolalari

📊 <b>Statistika va boshqalar!</b>

Boshlash uchun quyidagi tugmalardan birini tanlang! 👇
  `;

  bot.sendMessage(chatId, welcomeMessage, {
    parse_mode: 'HTML',
    ...mainMenu
  });
});

// Callback query handler
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;

  // Tugmani bosganligini tasdiqlash
  bot.answerCallbackQuery(query.id);

  if (data === 'back_main') {
    bot.editMessageText('Asosiy menyu:', {
      chat_id: chatId,
      message_id: query.message.message_id,
      ...mainMenu
    });
  } else if (data === 'menu_video') {
    addStatistic(userId, 'menu_video');
    const message = `
📹 <b>Video Yuklab Olish</b>

Quyidagi platformalardan video yuklab olishingiz mumkin:

<b>Qanday ishlatish:</b>
1. Platformani tanlang
2. Video havolasini yuboring
3. Video yuklanishini kuting

<b>E'tibor:</b> Ba'zi videolar mualliflik huquqi sababli yuklanmasligi mumkin.
    `;
    bot.editMessageText(message, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML',
      ...videoPlatformsMenu
    });
  } else if (data === 'menu_music') {
    addStatistic(userId, 'menu_music');
    const message = `
🎵 <b>Musiqa Topish</b>

Ovoz yozuvidan musiqa topish:

<b>Qanday ishlatish:</b>
1. Musiqa chalaётgan audio fayl yuboring
2. Yoki voice message yozing
3. Men musiqani topaman!

<b>Format:</b> MP3, WAV, OGG, M4A, FLAC

Ovoz yozuvini yuboring! 🎧
    `;
    bot.editMessageText(message, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: '🔙 Orqaga', callback_data: 'back_main' }]]
      }
    });
  } else if (data === 'menu_stats') {
    const stats = getUserStats(userId);
    const message = `
📊 <b>Sizning statistikangiz:</b>

📥 Yuklab olingan videolar: ${stats.downloads}
🔧 Umumiy amallar: ${stats.actions}

Davom eting! 💪
    `;
    bot.editMessageText(message, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: '🔙 Orqaga', callback_data: 'back_main' }]]
      }
    });
  } else if (data === 'menu_help') {
    const message = `
ℹ️ <b>Yordam Bo'limi</b>

<b>📹 Video yuklab olish:</b>
Shunchaki video havolasini yuboring:
• youtube.com/watch?v=...
• tiktok.com/@user/video/...
• instagram.com/p/...

<b>🎵 Musiqa topish:</b>
Audio fayl yoki voice message yuboring

<b>💡 Maslahatlar:</b>
• Sifatli audio yuborish yaxshiroq natija beradi
• Ba'zi videolar yuklanmasligi mumkin (mualliflik huquqi)
• Muammolar bo'lsa, /start ni bosing

<b>👨‍💻 Texnik yordam:</b>
Muammo yuzaga kelsa, admin bilan bog'laning.
    `;
    bot.editMessageText(message, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: '🔙 Orqaga', callback_data: 'back_main' }]]
      }
    });
  } else if (data.startsWith('platform_')) {
    const platform = data.replace('platform_', '');
    const message = `
✅ ${platform.toUpperCase()} tanlandi!

Endi menga video havolasini yuboring. Masalan:
${getPlatformExample(platform)}

⏳ Yuklash bir necha daqiqa vaqt olishi mumkin...
    `;
    bot.sendMessage(chatId, message, {
      parse_mode: 'HTML'
    });
  }
});

// Video havolasini qabul qilish
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  // Foydalanuvchini yangilash
  addOrUpdateUser(userId, msg.from.username || '', msg.from.first_name || '', msg.from.last_name || '');

  // Agar komanda yoki callback bo'lsa, o'tkazib yuborish
  if (!text || text.startsWith('/')) return;

  // Video havolasini tekshirish
  const platform = detectPlatform(text);
  
  if (platform) {
    const waitMsg = await bot.sendMessage(chatId, '⏳ Video yuklanmoqda, iltimos kuting...');
    
    try {
      if (platform === 'youtube') {
        addStatistic(userId, 'download_youtube');
        
        const result = await downloadYouTube(text, chatId);
        
        if (result.success && fs.existsSync(result.filePath)) {
          const fileSize = fs.statSync(result.filePath).size;
          const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
          
          bot.deleteMessage(chatId, waitMsg.message_id);
          
          // Telegram limit: 50MB
          if (fileSize > 50 * 1024 * 1024) {
            bot.sendMessage(chatId, `❌ Video juda katta (${fileSizeMB} MB). Telegram limit: 50 MB\n\nIltimos qisqaroq video tanlang.`);
          } else {
            await bot.sendVideo(chatId, result.filePath, {
              caption: `✅ <b>${result.title}</b>\n\n👁 Ko'rishlar: ${result.views}\n⏱ Davomiyligi: ${Math.floor(result.duration / 60)} daqiqa`,
              parse_mode: 'HTML'
            });
            
            addDownload(userId, text, 'youtube');
          }
          
          // Faylni o'chirish
          cleanupFile(result.filePath);
        }
      } else if (platform === 'tiktok') {
        addStatistic(userId, 'download_tiktok');
        
        const result = await downloadTikTok(text);
        bot.deleteMessage(chatId, waitMsg.message_id);
        
        if (result.success && result.videoUrl) {
          await bot.sendVideo(chatId, result.videoUrl, {
            caption: `✅ <b>${result.title}</b>\n\n👤 Muallif: ${result.author}`,
            parse_mode: 'HTML'
          });
          
          addDownload(userId, text, 'tiktok');
        }
      } else if (platform === 'instagram') {
        addStatistic(userId, 'download_instagram');
        
        const result = await downloadInstagram(text);
        bot.deleteMessage(chatId, waitMsg.message_id);
        
        if (result.success && result.videoUrl) {
          await bot.sendVideo(chatId, result.videoUrl, {
            caption: `✅ ${result.title}`,
            parse_mode: 'HTML'
          });
          
          addDownload(userId, text, 'instagram');
        }
      } else {
        bot.editMessageText('❌ Bu platforma hozircha qo\'llab-quvvatlanmaydi.', {
          chat_id: chatId,
          message_id: waitMsg.message_id
        });
      }
    } catch (error) {
      console.error('Video yuklashda xato:', error);
      bot.editMessageText(`❌ Xatolik yuz berdi: ${error.message}\n\nIltimos qayta urinib ko'ring.`, {
        chat_id: chatId,
        message_id: waitMsg.message_id
      });
    }
  }
});

// Audio/Voice message qabul qilish
bot.on('audio', async (msg) => {
  await handleMusicRecognition(msg, msg.audio);
});

bot.on('voice', async (msg) => {
  await handleMusicRecognition(msg, msg.voice);
});

// Musiqa topish funksiyasi
async function handleMusicRecognition(msg, audioObj) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!auddApiKey || auddApiKey === 'SIZNING_AUDD_API_KEY') {
    bot.sendMessage(chatId, '❌ Musiqa topish funksiyasi faol emas. Admin API kalitni sozlashi kerak.');
    return;
  }

  const waitMsg = await bot.sendMessage(chatId, '🎵 Musiqa tanilmoqda, iltimos kuting...');
  addStatistic(userId, 'recognize_music');

  try {
    // Audio faylni yuklab olish
    const fileId = audioObj.file_id;
    const file = await bot.getFile(fileId);
    const filePath = path.join(__dirname, 'downloads', `${chatId}_${Date.now()}.ogg`);
    
    // Downloads papkasini yaratish
    if (!fs.existsSync(path.join(__dirname, 'downloads'))) {
      fs.mkdirSync(path.join(__dirname, 'downloads'));
    }
    
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
    const writer = fs.createWriteStream(filePath);
    
    const axios = require('axios');
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream'
    });
    
    response.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    
    // Musiqani topish
    const result = await recognizeMusic(filePath, auddApiKey);
    
    bot.deleteMessage(chatId, waitMsg.message_id);
    
    if (result.success) {
      let message = `
🎵 <b>Musiqa topildi!</b>

🎤 <b>Qo'shiq:</b> ${result.title}
👨‍🎤 <b>Artist:</b> ${result.artist}
${result.album ? `💿 <b>Albom:</b> ${result.album}\n` : ''}
${result.releaseDate ? `📅 <b>Chiqarilgan:</b> ${result.releaseDate}\n` : ''}
      `;
      
      const keyboard = [];
      if (result.spotifyUrl) {
        keyboard.push([{ text: '🎵 Spotify da ochish', url: result.spotifyUrl }]);
      }
      if (result.appleMusicUrl) {
        keyboard.push([{ text: '🍎 Apple Music da ochish', url: result.appleMusicUrl }]);
      }
      
      bot.sendMessage(chatId, message, {
        parse_mode: 'HTML',
        reply_markup: keyboard.length > 0 ? { inline_keyboard: keyboard } : undefined
      });
    } else {
      bot.sendMessage(chatId, `❌ ${result.message}`);
    }
    
    // Faylni o'chirish
    cleanupFile(filePath);
    
  } catch (error) {
    console.error('Musiqa topishda xato:', error);
    bot.editMessageText('❌ Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.', {
      chat_id: chatId,
      message_id: waitMsg.message_id
    });
  }
}

// Admin komandalar
bot.onText(/\/admin/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (userId !== adminId) {
    bot.sendMessage(chatId, '❌ Bu komanda faqat admin uchun!');
    return;
  }

  const stats = getStatistics();
  const message = `
👨‍💻 <b>ADMIN PANEL</b>

📊 <b>Umumiy Statistika:</b>

👥 Jami foydalanuvchilar: ${stats.totalUsers}
📥 Jami yuklanmalar: ${stats.totalDownloads}
📅 Bugungi yuklanmalar: ${stats.todayDownloads}

⚡ Bot holati: Faol
  `;

  bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
});

// Platform misollari
function getPlatformExample(platform) {
  const examples = {
    youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tiktok: 'https://www.tiktok.com/@user/video/1234567890',
    instagram: 'https://www.instagram.com/p/ABC123/',
    facebook: 'https://www.facebook.com/watch?v=1234567890'
  };
  return examples[platform] || '';
}

// Xatolarni tutish
bot.on('polling_error', (error) => {
  console.error('❌ Polling xatosi:', error.message);
});

// Jarayonni to'xtatish
process.on('SIGINT', () => {
  console.log('\n👋 Bot to\'xtatilmoqda...');
  bot.stopPolling();
  process.exit(0);
});

console.log('✅ Bot tayyor! Foydalanuvchilarni kutmoqda...');
