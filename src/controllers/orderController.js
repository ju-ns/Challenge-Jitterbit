import Order from "../models/Order.js";

class OrderController {

  static async findAll(req, res) {
    try {
      const orders = await Order.findAll();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async findById(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { value } = req.body;
      const order = await Order.create(value);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { orderId } = req.params;
      const { value } = req.body;

      const order = await Order.update(orderId, value);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.delete(orderId);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

export default OrderController;