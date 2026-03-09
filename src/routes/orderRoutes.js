import express from "express";
import OrderController from "../controllers/orderController.js";

/*
Responsável por cada rota e endereço
*/
const router = express.Router();

router.get("/order/list", OrderController.findAll);
router.get("/order/:orderId", OrderController.findById);
router.post("/order", OrderController.create);
router.put("/order/:orderId", OrderController.update);
router.delete("/order/:orderId", OrderController.delete);

export default router;