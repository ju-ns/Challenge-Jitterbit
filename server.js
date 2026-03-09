import "dotenv/config";
import express from "express";
import orderRoutes from "./src/routes/orderRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/", orderRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});