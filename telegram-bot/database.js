const Database = require('better-sqlite3');
const path = require('path');

// Ma'lumotlar bazasini yaratish
const db = new Database(path.join(__dirname, 'bot.db'));

// Jadvallarni yaratish
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS statistics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
  );

  CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    url TEXT,
    platform TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
  );
`);

// Foydalanuvchini qo'shish yoki yangilash
const addOrUpdateUser = (userId, username, firstName, lastName) => {
  const stmt = db.prepare(`
    INSERT INTO users (user_id, username, first_name, last_name)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      username = excluded.username,
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      last_active = CURRENT_TIMESTAMP
  `);
  stmt.run(userId, username, firstName, lastName);
};

// Statistika qo'shish
const addStatistic = (userId, actionType) => {
  const stmt = db.prepare('INSERT INTO statistics (user_id, action_type) VALUES (?, ?)');
  stmt.run(userId, actionType);
};

// Yuklab olish tarixini saqlash
const addDownload = (userId, url, platform) => {
  const stmt = db.prepare('INSERT INTO downloads (user_id, url, platform) VALUES (?, ?, ?)');
  stmt.run(userId, url, platform);
};

// Umumiy statistika
const getStatistics = () => {
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const totalDownloads = db.prepare('SELECT COUNT(*) as count FROM downloads').get().count;
  const todayDownloads = db.prepare(`
    SELECT COUNT(*) as count FROM downloads 
    WHERE DATE(created_at) = DATE('now')
  `).get().count;
  
  return { totalUsers, totalDownloads, todayDownloads };
};

// Foydalanuvchi statistikasi
const getUserStats = (userId) => {
  const downloads = db.prepare('SELECT COUNT(*) as count FROM downloads WHERE user_id = ?').get(userId).count;
  const actions = db.prepare('SELECT COUNT(*) as count FROM statistics WHERE user_id = ?').get(userId).count;
  
  return { downloads, actions };
};

module.exports = {
  db,
  addOrUpdateUser,
  addStatistic,
  addDownload,
  getStatistics,
  getUserStats
};
