import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "./routes/contact.js"; // default import

dotenv.config(); // load env variables

const app = express(); // create app first

app.use(cors());
app.use(express.json());

// attach routes
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("Portfolio API running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
