import db from "../config/database.js";
/*
Responsável por acessar o banco e retornar as informações de cada
chamada
*/
class Order {

  /*
  Retorna todos os pedidos junto com os itens cadastrados
  */
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

  /*
  Retorna o pedido por id passado como parâmetro
  */
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

  /*
  Cria um novo pedido no banco, insere os dados do body na requisição POST
  */
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

  /*
  Atualiza o pedido com o id passado por parâmetro
  */
  static async update(orderId, value) {
    const result = await db.query(`
      UPDATE "order"
      SET value = $1
      WHERE "orderId" = $2
      RETURNING *
    `, [value, orderId]);
    return result.rows[0];
  }

  /*
  Deleta o pedido do qual o número do pedido foi passado como parâmetro
  */
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