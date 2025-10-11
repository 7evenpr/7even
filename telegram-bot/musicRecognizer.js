const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// AudD API orqali musiqa topish
const recognizeMusic = async (audioFilePath, apiKey) => {
  try {
    const form = new FormData();
    form.append('audio', fs.createReadStream(audioFilePath));
    form.append('return', 'apple_music,spotify');
    form.append('api_token', apiKey);

    const response = await axios.post('https://api.audd.io/', form, {
      headers: {
        ...form.getHeaders()
      }
    });

    if (response.data.status === 'success' && response.data.result) {
      const result = response.data.result;
      return {
        success: true,
        title: result.title,
        artist: result.artist,
        album: result.album,
        releaseDate: result.release_date,
        label: result.label,
        appleMusicUrl: result.apple_music?.url,
        spotifyUrl: result.spotify?.external_urls?.spotify,
        lyrics: result.lyrics?.lyrics,
        timecode: result.timecode,
        songLink: result.song_link
      };
    } else {
      return {
        success: false,
        message: 'Musiqa topilmadi. Yana bir bor urinib ko\'ring.'
      };
    }
  } catch (error) {
    console.error('Musiqa tanib olishda xato:', error);
    return {
      success: false,
      message: 'Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.'
    };
  }
};

// ACRCloud API orqali musiqa topish (alternativ)
const recognizeWithACRCloud = async (audioFilePath, config) => {
  try {
    // Bu yerda ACRCloud API integratsiya qilish mumkin
    // Hozircha faqat AudD ishlatamiz
    return {
      success: false,
      message: 'Bu funksiya hali ishga tushirilmagan'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Audio formatini tekshirish
const isValidAudioFormat = (filename) => {
  const validFormats = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac'];
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return validFormats.includes(ext);
};

module.exports = {
  recognizeMusic,
  recognizeWithACRCloud,
  isValidAudioFormat
};
