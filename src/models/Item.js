import db from "../config/database.js";

class Item {

  static async create(orderId, productId, quantity, price) {
    const result = await db.query(
      `INSERT INTO items ("orderId", "productId", quantity, price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [orderId, productId, quantity, price]
    );

    return result.rows[0];
  }

  static async findByProductId(productId) {
    const result = await db.query(
      `SELECT * FROM items WHERE "productId" = $1`,
      [productId]
    );

    return result.rows;
  }

  static async deleteByOrderId(orderId) {
    await db.query(
      `DELETE FROM items WHERE "orderId" = $1`,
      [orderId]
    );
  }

}

export default Item;