// Dotenv Configuration
import dotenv from "dotenv";
dotenv.config();

import path from "path";
import express from "express";
import { connectDB } from "./Utills/mongooseConn.js";
import routes from "./Routes/routes.js";

const app = express();
import cors from "cors";
// Middleware
app.use(cors())
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.query.email) {
    console.log('Query email:', req.query.email);
  }
  next();
});

// Routes
app.use('/api',routes);
// To store pic locally
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Start server only after DB connects
const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
