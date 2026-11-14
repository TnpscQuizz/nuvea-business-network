/**
 * HOSTINGER REMOTE MYSQL INTEGRATION SERVICE
 * Allows NBN platform to persist and sync all Business Owners, Users,
 * Memberships, Validity, Payments, and Google Maps records directly into Hostinger MySQL.
 */

const mysql = require('mysql2/promise');
const db = require('../database/db');

class HostingerService {
  constructor() {
    this.pool = null;
  }

  getConfig() {
    const settings = db.getSettings() || {};
    return {
      host: process.env.HOSTINGER_DB_HOST || settings.hostingerDbHost || '',
      port: Number(process.env.HOSTINGER_DB_PORT || settings.hostingerDbPort || 3306),
      user: process.env.HOSTINGER_DB_USER || settings.hostingerDbUser || '',
      password: process.env.HOSTINGER_DB_PASSWORD || settings.hostingerDbPassword || '',
      database: process.env.HOSTINGER_DB_NAME || settings.hostingerDbName || '',
      enabled: settings.hostingerDbEnabled === true || process.env.HOSTINGER_DB_ENABLED === 'true'
    };
  }

  saveConfig(newConfig) {
    const settings = db.getSettings();
    const updated = {
      ...settings,
      hostingerDbHost: newConfig.host || '',
      hostingerDbPort: Number(newConfig.port || 3306),
      hostingerDbUser: newConfig.user || '',
      hostingerDbPassword: newConfig.password || '',
      hostingerDbName: newConfig.database || '',
      hostingerDbEnabled: newConfig.enabled === true
    };
    db.saveSettings(updated);
    this.pool = null; // Reset connection pool
    return this.getConfig();
  }

  async getPool() {
    const cfg = this.getConfig();
    if (!cfg.enabled || !cfg.host || !cfg.user || !cfg.database) {
      return null;
    }

    if (!this.pool) {
      this.pool = mysql.createPool({
        host: cfg.host,
        port: cfg.port,
        user: cfg.user,
        password: cfg.password,
        database: cfg.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 5000
      });
    }
    return this.pool;
  }

  async testConnection(customConfig = null) {
    const cfg = customConfig || this.getConfig();
    if (!cfg.host || !cfg.user || !cfg.database) {
      return {
        success: false,
        message: 'ஹோஸ்டிங்கர் MySQL விபரம் முழுமையாக வழங்கப்படவில்லை (Host, User & Database required)'
      };
    }

    let tempConn = null;
    try {
      tempConn = await mysql.createConnection({
        host: cfg.host,
        port: Number(cfg.port || 3306),
        user: cfg.user,
        password: cfg.password,
        database: cfg.database,
        connectTimeout: 7000
      });

      await tempConn.ping();
      await tempConn.end();

      return {
        success: true,
        message: 'ஹோஸ்டிங்கர் MySQL தரவுத்தளத்துடன் நேரலை இணைப்பு வெற்றிகரமாக முடிந்தது! (Hostinger Remote MySQL Connected Successfully)'
      };
    } catch (err) {
      if (tempConn) {
        try { await tempConn.end(); } catch (e) {}
      }
      return {
        success: false,
        error: err.message,
        message: `இணைப்பு தோல்வி: ${err.message}`
      };
    }
  }

  async initTables() {
    const pool = await this.getPool();
    if (!pool) return false;

    try {
      // 1. Users Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS nbn_users (
          id VARCHAR(64) PRIMARY KEY,
          username VARCHAR(100) UNIQUE,
          name VARCHAR(150),
          email VARCHAR(150),
          phone VARCHAR(20) UNIQUE,
          role VARCHAR(50) DEFAULT 'business_owner',
          account_type VARCHAR(50) DEFAULT 'networking_marketplace',
          password_hash VARCHAR(255),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 2. Business Profiles Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS nbn_business_profiles (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64),
          business_name VARCHAR(255),
          owner_name VARCHAR(150),
          category_id VARCHAR(100),
          taluk_id VARCHAR(100),
          chapter_id VARCHAR(100),
          forum_type VARCHAR(100),
          package_type VARCHAR(100),
          phone VARCHAR(20),
          email VARCHAR(150),
          address TEXT,
          map_embed_url TEXT,
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          logo_url TEXT,
          cover_url TEXT,
          status VARCHAR(50) DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 3. Membership Validity Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS nbn_membership_validity (
          id INT AUTO-INCREMENT PRIMARY KEY,
          business_id VARCHAR(64),
          validity_days INT DEFAULT 365,
          fee_amount DECIMAL(10,2) DEFAULT 1.00,
          start_date DATETIME,
          expiry_date DATETIME,
          is_expired BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 4. Payments Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS nbn_payments (
          id VARCHAR(64) PRIMARY KEY,
          business_id VARCHAR(64),
          amount DECIMAL(10,2) DEFAULT 1.00,
          currency VARCHAR(10) DEFAULT 'INR',
          razorpay_order_id VARCHAR(100),
          razorpay_payment_id VARCHAR(100),
          status VARCHAR(50) DEFAULT 'captured',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      return true;
    } catch (e) {
      console.error('[Hostinger MySQL] Table Init Error:', e.message);
      return false;
    }
  }

  async syncOwnerRecord(ownerData) {
    const pool = await this.getPool();
    if (!pool) {
      return { synced: false, reason: 'Hostinger MySQL not enabled or credentials pending' };
    }

    try {
      await this.initTables();

      // Insert or Update User
      await pool.query(`
        INSERT INTO nbn_users (id, username, name, email, phone, role, account_type, password_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          name = VALUES(name),
          email = VALUES(email),
          role = VALUES(role),
          account_type = VALUES(account_type);
      `, [
        ownerData.userId || `usr_${Date.now()}`,
        ownerData.username || ownerData.phone,
        ownerData.ownerName,
        ownerData.email || `${ownerData.phone}@nbn.in`,
        ownerData.phone,
        'business_owner',
        ownerData.accountType || 'networking_marketplace',
        ownerData.passwordHash || ''
      ]);

      // Insert Business Profile with Map
      await pool.query(`
        INSERT INTO nbn_business_profiles 
        (id, user_id, business_name, owner_name, category_id, taluk_id, chapter_id, forum_type, package_type, phone, email, address, map_embed_url, latitude, longitude, logo_url, cover_url, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          business_name = VALUES(business_name),
          owner_name = VALUES(owner_name),
          category_id = VALUES(category_id),
          taluk_id = VALUES(taluk_id),
          chapter_id = VALUES(chapter_id),
          address = VALUES(address),
          map_embed_url = VALUES(map_embed_url);
      `, [
        ownerData.businessId,
        ownerData.userId || `usr_${Date.now()}`,
        ownerData.businessName,
        ownerData.ownerName,
        ownerData.categoryId,
        ownerData.talukId || 'harur',
        ownerData.chapterId || 'harur_titans',
        ownerData.forumType || 'Executive Forum',
        ownerData.accountType || 'networking_marketplace',
        ownerData.phone,
        ownerData.email || `${ownerData.phone}@nbn.in`,
        ownerData.address || '',
        ownerData.mapEmbedUrl || '',
        ownerData.latitude || 12.0621,
        ownerData.longitude || 78.4975,
        ownerData.logo || '',
        ownerData.cover || '',
        'active'
      ]);

      // Insert 1-Year Validity Record
      const now = new Date();
      const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      await pool.query(`
        INSERT INTO nbn_membership_validity 
        (business_id, validity_days, fee_amount, start_date, expiry_date, is_expired)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        ownerData.businessId,
        365,
        1.00,
        now,
        oneYearLater,
        false
      ]);

      return { synced: true };
    } catch (e) {
      console.error('[Hostinger MySQL] Sync Error:', e.message);
      return { synced: false, error: e.message };
    }
  }
}

module.exports = new HostingerService();
