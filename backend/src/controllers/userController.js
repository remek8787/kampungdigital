// backend/controllers/userController.js
import { pool } from "../config/database.js"
import { hashPassword, verifyPassword } from "../utils/password.js"


// Change password for Warga
export const changeWargaPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const idWarga = req.user?.id;
    if (!idWarga || !currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Password lama dan password baru wajib diisi" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password baru minimal 8 karakter" });
    }
    const [rows] = await pool.query(
      "SELECT password_custom FROM warga WHERE id_warga = ? AND status_aktif = 'Aktif'", [idWarga]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Warga tidak ditemukan atau tidak aktif" });
    const check = await verifyPassword(currentPassword, rows[0].password_custom);
    if (!check.valid) return res.status(401).json({ success: false, message: "Password lama tidak sesuai" });
    await pool.query("UPDATE warga SET password_custom = ?, updated_at = NOW() WHERE id_warga = ?", [await hashPassword(newPassword), idWarga]);
    return res.json({ success: true, message: "Password berhasil diubah" });
  } catch (error) {
    console.error("Error change warga password:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengubah password" });
  }
};

// Change password for Petugas/Admin/SuperAdmin
export const changePetugasPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const idPetugas = req.user?.id;
    if (!idPetugas || !currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Password lama dan password baru wajib diisi" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password baru minimal 8 karakter" });
    }
    const [rows] = await pool.query(
      "SELECT password FROM petugas WHERE id_petugas = ? AND status = 'Aktif'", [idPetugas]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Petugas tidak ditemukan atau tidak aktif" });
    const check = await verifyPassword(currentPassword, rows[0].password);
    if (!check.valid) return res.status(401).json({ success: false, message: "Password lama tidak sesuai" });
    await pool.query("UPDATE petugas SET password = ?, updated_at = NOW() WHERE id_petugas = ?", [await hashPassword(newPassword), idPetugas]);
    return res.json({ success: true, message: "Password berhasil diubah" });
  } catch (error) {
    console.error("Error change petugas password:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengubah password" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { id, role, nama, email, phone, alamat } = req.body

    console.log("=== UPDATE PROFILE ===")
    console.log("ID:", id, "Role:", role)

    if (!id || !role) {
      return res.status(400).json({
        success: false,
        message: "ID dan role wajib diisi"
      })
    }

    let query = ""
    let params = []

    if (role === "warga") {
      query = `
        UPDATE warga
        SET nama_lengkap = ?,
            email = ?,
            alamat = ?
        WHERE id_warga = ?
      `
      params = [nama, email, alamat, id]
    } else {
      // Update untuk petugas/admin/superadmin
      query = `
        UPDATE warga w
        INNER JOIN petugas p ON w.id_warga = p.id_warga
        SET w.nama_lengkap = ?,
            w.email = ?,
            w.alamat = ?
        WHERE p.id_petugas = ?
      `
      params = [nama, email, alamat, id]
    }

    await pool.query(query, params)

    console.log("Profile berhasil diupdate untuk ID:", id)

    res.json({
      success: true,
      message: "Profile berhasil diperbarui"
    })

  } catch (error) {
    console.error("Error update profile:", error)
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengupdate profile",
      error: error.message
    })
  }
}
