// backend/controllers/authController.js
import { pool } from "../config/database.js";
import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../utils/password.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1d";

// Login function for both username and phone number
export const login = async (req, res) => {
  try {
    const { identifier, password, loginType } = req.body;

    if (!identifier || !password || !loginType) {
      return res.status(400).json({
        success: false,
        message: "Identifier, password, dan loginType wajib diisi",
      });
    }

    let user = null;
    let userQuery = "";
    let userParams = [];

    if (loginType === "phone") {
      // Login for Warga using phone number
      userQuery = `
        SELECT w.id_warga as id, w.nama_lengkap as nama, w.nomor_hp as nomorHp,
               'warga' as role, w.status_aktif as status,
               w.nomor_hp as identifier_field, w.password_custom,
               w.email, w.alamat
        FROM warga w
        WHERE w.nomor_hp = ? AND w.status_aktif = 'Aktif'
      `;
      userParams = [identifier];
    } else if (loginType === "username") {
      // Login for Petugas, Admin, Super Admin using username
      userQuery = `
        SELECT p.id_petugas as id, w.nama_lengkap as nama, p.username,
               p.role, p.jabatan,
               CASE
                 WHEN LOWER(p.role) = 'superadmin' OR LOWER(p.jabatan) LIKE '%superadmin%' OR LOWER(p.jabatan) LIKE '%super admin%' THEN 'super_admin'
                 WHEN LOWER(p.role) = 'admin' THEN 'admin'
                 WHEN LOWER(p.role) = 'petugas' THEN 'petugas'
                 ELSE LOWER(REPLACE(p.role, ' ', '_'))
               END as user_role,
               p.status, p.password as stored_password, p.username as identifier_field,
               kr.nama_kelompok as kelompokRonda,
               w.nomor_hp as nomorHp, w.email, w.alamat
        FROM petugas p
        LEFT JOIN warga w ON p.id_warga = w.id_warga
        LEFT JOIN kelompok_ronda kr ON p.id_kelompok_ronda = kr.id_kelompok_ronda
        WHERE p.username = ? AND p.status = 'Aktif'
      `;
      userParams = [identifier];
    } else {
      return res.status(400).json({
        success: false,
        message: "LoginType harus 'phone' atau 'username'",
      });
    }

    const [rows] = await pool.query(userQuery, userParams);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message:
          loginType === "phone"
            ? "Nomor HP tidak ditemukan atau tidak aktif"
            : "Username tidak ditemukan atau tidak aktif",
      });
    }

    user = rows[0];
    // Password verification. New hashes use bcrypt; legacy MD5/plaintext is upgraded on success.
    const storedPassword = loginType === "phone" ? user.password_custom : user.stored_password;
    if (!storedPassword) {
      return res.status(401).json({ success: false, message: "Akun belum memiliki password. Hubungi admin untuk reset." });
    }
    const verification = await verifyPassword(password, storedPassword);
    const isPasswordValid = verification.valid;

    if (isPasswordValid && verification.needsUpgrade) {
      const upgradedHash = await hashPassword(password);
      const table = loginType === "phone" ? "warga" : "petugas";
      const column = loginType === "phone" ? "password_custom" : "password";
      const idColumn = loginType === "phone" ? "id_warga" : "id_petugas";
      await pool.query(`UPDATE ${table} SET ${column} = ? WHERE ${idColumn} = ?`, [upgradedHash, user.id]);
      console.info("[AUTH] Legacy password upgraded", { userId: user.id, loginType });
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password salah",
      });
    }

    // Use the computed role
    const finalRole = user.user_role || user.role;

    // Generate JWT token
    const tokenPayload = {
      id: user.id,
      nama: user.nama,
      role: finalRole,
      identifier: user.identifier_field,
    };

    if (user.kelompokRonda) {
      tokenPayload.kelompokRonda = user.kelompokRonda;
    }

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Determine id_warga untuk global identifier (untuk tema, dll)
    let id_warga_global = null;
    if (loginType === "phone") {
      // Untuk warga, id_warga sama dengan id
      id_warga_global = user.id;
    } else {
      // Untuk petugas/admin/superadmin, gunakan id_warga dari relasi
      const [wargaRows] = await pool.query(
        "SELECT id_warga FROM petugas WHERE id_petugas = ?",
        [user.id]
      );
      id_warga_global = wargaRows.length > 0 ? wargaRows[0].id_warga : null;
    }

    // Return user data and token
    res.json({
      success: true,
      message: "Login berhasil",
      data: {
        user: {
          id: user.id.toString(),
          id_warga: id_warga_global ? id_warga_global.toString() : undefined,
          nama: user.nama,
          role: finalRole,
          username: user.username || undefined,
          nomorHp: user.nomorHp || undefined,
          email: user.email || undefined,
          alamat: user.alamat || undefined,
          kelompokRonda: user.kelompokRonda || undefined,
          isActive: true,
        },
        token,
      },
    });
  } catch (error) {
    console.error("[AUTH] Login error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Verify JWT token
export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Optionally verify user still exists and is active
    let userExists = false;
    if (decoded.role === "warga") {
      const [rows] = await pool.query(
        "SELECT id_warga FROM warga WHERE id_warga = ? AND status_aktif = 'Aktif'",
        [decoded.id]
      );
      userExists = rows.length > 0;
    } else {
      const [rows] = await pool.query(
        "SELECT id_petugas FROM petugas WHERE id_petugas = ? AND status = 'Aktif'",
        [decoded.id]
      );
      userExists = rows.length > 0;
    }

    if (!userExists) {
      return res.status(401).json({
        success: false,
        message: "User tidak ditemukan atau tidak aktif",
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: decoded.id.toString(),
          nama: decoded.nama,
          role: decoded.role,
          username: decoded.username || undefined,
          nomorHp: decoded.nomorHp || undefined,
          kelompokRonda: decoded.kelompokRonda || undefined,
          isActive: true,
        },
      },
    });
  } catch (error) {
    console.error("[AUTH] Token verification error:", error);
    res.status(401).json({
      success: false,
      message: "Token tidak valid",
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side by removing the token
    res.json({
      success: true,
      message: "Logout berhasil",
    });
  } catch (error) {
    console.error("[AUTH] Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat logout",
    });
  }
};
