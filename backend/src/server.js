import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { authenticate } from "./middleware/middleware.jwt.js";

// ✅ Import semua routes
import authRoutes from "./routes/authRoutes.js";
import petugasRoutes from "./routes/petugasRoutes.js";
import wargaRoutes from "./routes/wargaRoutes.js";
import rumahRoutes from "./routes/rumahRoutes.js";
import kelompokRondaRoutes from "./routes/kelompokRondaRoutes.js";
import jenisDanaRoutes from "./routes/jenisDanaRoutes.js";
import transaksiRoutes from "./routes/transaksiRoutes.js";
import presensiRoutes from "./routes/presensiRoutes.js";
import laporanRoutes from "./routes/laporanRoutes.js";
import wargaRondaRoutes from "./routes/wargaRondaRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import forgotPasswordRoutes from "./routes/forgotPasswordRoutes.js";
import logger from "./config/logger.js";
import { errorMiddleware } from "./middleware/error-middleware.js";
import { pinoHttp } from "pino-http";
import {testConnection} from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5006;
const HOST = process.env.HOST || "127.0.0.1";
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET wajib diisi minimal 32 karakter");
}
const API_PREFIX = (process.env.API_PREFIX || "/api").replace(/\/$/, "");
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// logger
app.use(pinoHttp({logger}))

// Baseline HTTP hardening
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin tidak diizinkan"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.use(bodyParser.json({ limit: process.env.JSON_BODY_LIMIT || "1mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: process.env.JSON_BODY_LIMIT || "1mb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number.parseInt(process.env.AUTH_RATE_LIMIT || "20", 10),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Terlalu banyak percobaan. Silakan coba lagi nanti." },
});

// ✅ Register API routes
app.use(`${API_PREFIX}/auth`, authLimiter, authRoutes);
app.use(`${API_PREFIX}/petugas`, authenticate, petugasRoutes);
app.use(`${API_PREFIX}/warga`, authenticate, wargaRoutes);
app.use(`${API_PREFIX}/rumah`, authenticate, rumahRoutes);
app.use(`${API_PREFIX}/kelompok-ronda`, authenticate, kelompokRondaRoutes);
app.use(`${API_PREFIX}/jenis-dana`, authenticate, jenisDanaRoutes);
app.use(`${API_PREFIX}/transaksi`, authenticate, transaksiRoutes);
app.use(`${API_PREFIX}/presensi`, authenticate, presensiRoutes);
app.use(`${API_PREFIX}/laporan`, authenticate, laporanRoutes);
app.use(`${API_PREFIX}/warga-ronda`, authenticate, wargaRondaRoutes);
app.use(`${API_PREFIX}/user`, authenticate, userRoutes);
app.use(`${API_PREFIX}/dashboard`, authenticate, dashboardRoutes);
app.use(`${API_PREFIX}/forgot-password`, authLimiter, forgotPasswordRoutes);

// ✅ Default API root info
app.get(API_PREFIX, (req, res) => {
  res.json({
    success: true,
    message: "KampungDigital API",
  });
});

// ✅ Health check route
app.get(`${API_PREFIX}/health`, (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Error handling middleware
app.use(errorMiddleware)
// app.use((err, req, res, next) => {
//   console.error("[Server Error]:", err);
//   res.status(500).json({
//     success: false,
//     message: "Internal server error",
//     error: process.env.NODE_ENV === "development" ? err.message : undefined,
//   });
// });

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    errors: "Route not found",
  });
});

// ✅ Jalankan koneksi database & server
const startServer = async () => {
  try {
    app.listen(PORT, HOST, () => {
      testConnection();
      console.log(`KampungDigital API aktif di ${HOST}:${PORT}`)
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();
