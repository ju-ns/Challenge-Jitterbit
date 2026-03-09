import db from "../config/database.js";

class Order {

  static async findAll() {
    const result = await db.query(`
      SELECT o.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'idItem', i."productId",
              'quantidadeItem', i.quantity,
              'valorItem', i.price
            )
          ) FILTER (WHERE i."productId" IS NOT NULL),
          '[]'
        ) AS items
      FROM "order" o
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
              'idItem', i."productId",
              'quantidadeItem', i.quantity,
              'valorItem', i.price
            )
          ) FILTER (WHERE i."productId" IS NOT NULL),
          '[]'
        ) AS items
      FROM "order" o
      LEFT JOIN items i ON o."orderId" = i."orderId"
      WHERE o."orderId" = $1
      GROUP BY o."orderId"
    `, [orderId]);
    return result.rows[0];
  }

  static async create(numeroPedido, valorTotal, dataCriacao, items) {
    const orderResult = await db.query(
      `INSERT INTO "order" ("orderId", value, "creationDate")
       VALUES ($1, $2, $3)
       RETURNING *`,
      [numeroPedido, valorTotal, dataCriacao]
    );

    const insertedItems = [];

    for (const item of items) {
      const itemResult = await db.query(
        `INSERT INTO items ("orderId", "productId", quantity, price)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [numeroPedido, item.idItem, item.quantidadeItem, item.valorItem]
      );
      insertedItems.push(itemResult.rows[0]);
    }

    return {
      numeroPedido: orderResult.rows[0].orderId,
      valorTotal: orderResult.rows[0].value,
      dataCriacao: orderResult.rows[0].creationDate,
      items: insertedItems
    };
  }

  

  static async update(orderId, value) {
    const result = await db.query(`
      UPDATE "order"
      SET value = $1
      WHERE "orderId" = $2
      RETURNING *
    `, [value, orderId]);
    return result.rows[0];
  }

  static async delete(orderId) {
    await db.query(
      `DELETE FROM items WHERE "orderId" = $1`,
      [orderId]
    );
    const result = await db.query(`
      DELETE FROM "order" WHERE "orderId" = $1
      RETURNING *
    `, [orderId]);
    return result.rows[0];
  }
}

export default Order;