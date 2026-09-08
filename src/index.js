import express from "express";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

// Hanya load .env jika tidak sedang berjalan di Vercel (Production)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
app.use(express.json());

// Root route untuk memastikan API berjalan
app.get("/", (req, res) => {
  res.json({ message: "API is running successfully" });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/reports", reportRoutes);

// Jalankan app.listen HANYA saat pengembangan di lokal
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Export default app agar Vercel dapat mengeksekusinya
export default app;