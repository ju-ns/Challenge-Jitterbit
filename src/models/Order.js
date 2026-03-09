import db from "../config/database.js";

class Order {

  static async findAll() {
    const result = await db.query(`
      SELECT o.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'productId', i."productId",
              'quantity', i.quantity,
              'price', i.price
            )
          ) FILTER (WHERE i."productId" IS NOT NULL),
          '[]'
        ) AS items
      FROM "Order" o
      LEFT JOIN items i ON o."orderId" = i."orderId"
      GROUP BY o."orderId"
      ORDER BY o."creationDate" DESC
    `);

    return result.rows;
  }

  static async findById(orderId) {
    const result = await db.query(`
      SELECT o.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'productId', i."productId",
              'quantity', i.quantity,
              'price', i.price
            )
          ) FILTER (WHERE i."productId" IS NOT NULL),
          '[]'
        ) AS items
      FROM "Order" o
      LEFT JOIN items i ON o."orderId" = i."orderId"
      WHERE o."orderId" = $1
      GROUP BY o."orderId"
    `, [orderId]);

    return result.rows[0];
  }

   static async create(req, res) {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    if (!numeroPedido || !valorTotal || !dataCriacao || !Array.isArray(items)) {
      return res.status(400).json({
        error: "Payload inválido. Campos obrigatórios: numeroPedido, valorTotal, dataCriacao, items[]"
      });
    }

    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // 1) Insere o pedido
      const orderResult = await client.query(
        `
        INSERT INTO "Order" ("orderId", value, "creationDate")
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [numeroPedido, valorTotal, dataCriacao]
      );

      const order = orderResult.rows[0];

      // 2) Insere os itens
      const insertedItems = [];

      for (const item of items) {
        const { idItem, quantidadeItem, valorItem } = item;

        const itemResult = await client.query(
          `
          INSERT INTO items ("orderId", "productId", quantity, price)
          VALUES ($1, $2, $3, $4)
          RETURNING *
          `,
          [numeroPedido, idItem, quantidadeItem, valorItem]
        );

        insertedItems.push(itemResult.rows[0]);
      }

      await client.query("COMMIT");

      return res.status(201).json({
        numeroPedido: order.orderId,
        valorTotal: order.value,
        dataCriacao: order.creationDate,
        items: insertedItems
      });

    } catch (error) {
      await client.query("ROLLBACK");
      return res.status(500).json({ error: error.message });
    } finally {
      client.release();
    }
  }

  static async update(orderId, value) {
    const result = await db.query(`
      UPDATE "Order"
      SET value = $1
      WHERE "orderId" = $2
      RETURNING *
    `, [value, orderId]);

    return result.rows[0];
  }

  static async delete(orderId) {
    const result = await db.query(`
      DELETE FROM "Order"
      WHERE "orderId" = $1
      RETURNING *
    `, [orderId]);

    return result.rows[0];
  }

}

export default Order;