const ytdl = require('@distube/ytdl-core');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// YouTube video yuklovchi
const downloadYouTube = async (url, chatId) => {
  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'videoandaudio' });
    
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '').substring(0, 50);
    const fileName = `${chatId}_${Date.now()}.mp4`;
    const filePath = path.join(__dirname, 'downloads', fileName);
    
    // Downloads papkasini yaratish
    if (!fs.existsSync(path.join(__dirname, 'downloads'))) {
      fs.mkdirSync(path.join(__dirname, 'downloads'));
    }
    
    return new Promise((resolve, reject) => {
      ytdl(url, { format: format })
        .pipe(fs.createWriteStream(filePath))
        .on('finish', () => {
          resolve({
            success: true,
            filePath: filePath,
            title: info.videoDetails.title,
            duration: info.videoDetails.lengthSeconds,
            views: info.videoDetails.viewCount
          });
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  } catch (error) {
    throw new Error(`YouTube yuklab olishda xato: ${error.message}`);
  }
};

// TikTok video yuklovchi
const downloadTikTok = async (url) => {
  try {
    // TikTok API - bu yerda bepul API ishlatamiz
    const response = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`);
    
    if (response.data && response.data.video) {
      return {
        success: true,
        videoUrl: response.data.video.noWatermark || response.data.video.watermark,
        title: response.data.title || 'TikTok Video',
        author: response.data.author?.nickname || 'Unknown'
      };
    } else {
      throw new Error('Video topilmadi');
    }
  } catch (error) {
    throw new Error(`TikTok yuklab olishda xato: ${error.message}`);
  }
};

// Instagram video yuklovchi
const downloadInstagram = async (url) => {
  try {
    // Instagram API - bu yerda bepul API ishlatamiz
    const response = await axios.get(`https://api.downloadgram.com/api/media?url=${encodeURIComponent(url)}`);
    
    if (response.data && response.data[0]) {
      return {
        success: true,
        videoUrl: response.data[0].url,
        title: 'Instagram Video',
        thumbnail: response.data[0].thumb
      };
    } else {
      throw new Error('Video topilmadi');
    }
  } catch (error) {
    throw new Error(`Instagram yuklab olishda xato: ${error.message}`);
  }
};

// URL turini aniqlash
const detectPlatform = (url) => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  } else if (url.includes('tiktok.com')) {
    return 'tiktok';
  } else if (url.includes('instagram.com')) {
    return 'instagram';
  } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return 'facebook';
  }
  return null;
};

// Faylni o'chirish
const cleanupFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Faylni o\'chirishda xato:', error);
  }
};

module.exports = {
  downloadYouTube,
  downloadTikTok,
  downloadInstagram,
  detectPlatform,
  cleanupFile
};
