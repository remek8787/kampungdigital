// Password lama tidak pernah dapat dipulihkan atau ditampilkan.
// Sampai kanal reset token/OTP tersedia, endpoint ini hanya memberi instruksi aman.
export const requestPasswordReset = async (req, res) => {
  const { username } = req.body || {};
  if (!username || typeof username !== "string") {
    return res.status(400).json({ success: false, message: "Username atau nomor HP wajib diisi" });
  }
  return res.status(202).json({
    success: true,
    message: "Jika akun terdaftar, hubungi admin KampungDigital untuk verifikasi dan pembuatan password baru.",
  });
};
