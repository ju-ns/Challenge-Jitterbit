import express from "express";
import OrderController from "../controllers/orderController.js";

const router = express.Router();


/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Listar todos os pedidos
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *       500:
 *         description: Erro interno
 */
router.get("/order/list", OrderController.findAll);

/**
 * @swagger
 * /order/{orderId}:
 *   get:
 *     summary: Buscar pedido por ID
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "v10089015vdb-01"
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro interno
 */
router.get("/order/:orderId", OrderController.findById);

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Criar um novo pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numeroPedido:
 *                 type: string
 *                 example: "v10089015vdb-01"
 *               valorTotal:
 *                 type: number
 *                 example: 10000
 *               dataCriacao:
 *                 type: string
 *                 example: "2023-07-19T12:24:11.529Z"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idItem:
 *                       type: string
 *                       example: "2434"
 *                     quantidadeItem:
 *                       type: integer
 *                       example: 1
 *                     valorItem:
 *                       type: number
 *                       example: 1000
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Payload inválido
 *       500:
 *         description: Erro interno
 */
router.post("/order", OrderController.create);

/**
 * @swagger
 * /order/{orderId}:
 *   put:
 *     summary: Atualizar pedido por ID
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "v10089015vdb-01"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valorTotal:
 *                 type: number
 *                 example: 25000
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro interno
 */
router.put("/order/:orderId", OrderController.update);

/**
 * @swagger
 * /order/{orderId}:
 *   delete:
 *     summary: Deletar pedido por ID
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "v10089015vdb-01"
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro interno
 */
router.delete("/order/:orderId", OrderController.delete);

export default router;