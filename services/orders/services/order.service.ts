const db = require("../configs/config");

const createOrder = async (body: {
  user_id: number;
  product_id: number;
  quantity: number;
  total: number;
}) => {
  try {
    const order = await db
      .insert({
        user_id: body.user_id,
        product_id: body.product_id,
        quantity: body.quantity,
        total: body.total,
      })
      .into("orders")
      .returning("*");

    return order[0];
  } catch (error) {
    console.log(error);
  }
};

const orderByUser = async (user_id: { user_id: number }) => {
  try {
    const order = await db.select("*").from("orders").where({ user_id });

    return order;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createOrder,
  orderByUser,
};
