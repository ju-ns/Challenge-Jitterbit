import express from "express";
import OrderController from "../controllers/orderController.js";

const router = express.Router();

router.get("/order/list", OrderController.findAll);
router.get("/:orderId", OrderController.findById);
router.post("/order", OrderController.create);
router.put("/:orderId", OrderController.update);
router.delete("/:orderId", OrderController.delete);

export default router;