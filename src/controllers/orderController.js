import Order from "../models/Order.js";

/*
Responsável pela lógica por trás de cada chamada a API
Utiliza o model para acessar aos dados do banco
*/
class OrderController {

  // GET /order/list
  static async findAll(req, res) {
    try {
      const orders = await Order.findAll();
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /order/:orderId
  static async findById(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }

      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // POST /order
  static async create(req, res) {
    try {
      const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

      if (!numeroPedido || !valorTotal || !dataCriacao || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Payload inválido." });
      }

      const order = await Order.create(numeroPedido, valorTotal, dataCriacao, items);
      return res.status(201).json(order);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // PUT /order/:orderId
  static async update(req, res) {
    try {
      const { orderId } = req.params;
      const { valorTotal } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }

      const updated = await Order.update(orderId, valorTotal);
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE /order/:orderId
  static async delete(req, res) {
    try {
      const { orderId } = req.params;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }

      await Order.delete(orderId);
      return res.status(200).json({ message: "Pedido deletado com sucesso!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default OrderController; // ✅