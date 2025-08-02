import axios = require("axios");

const { GlobalResponse } = require("../globals/responses/res");
const {
  createOrder,
  orderByUser,
  orderByProductId,
} = require("../services/order.service");

class OrderController {
  static async orderLists(req, reply) {
    try {
      reply.send(GlobalResponse(null, "Success", "Success get data"));
    } catch (error) {
      console.log(error);
    }
  }

  static async createOrder(req, reply) {
    try {
      const { id: user_id } = req.user;
      const { product_id, quantity } = req.body;
      console.log(product_id, "product_id dari order");

      const response = await axios.get(
        `${process.env.PRODUCT_URL}/api/products/list/${product_id}`
      );
      const product = response.data.data;

      console.log(product, "product");

      if (!product) {
        return reply.send(GlobalResponse(null, "Error", "Product not found"));
      }

      if (product.stock < quantity) {
        return reply.send(
          GlobalResponse(null, "Error", "Product stock not enough")
        );
      }

      const totalPrice = product.price * quantity;

      await axios.patch(
        `${process.env.PRODUCT_URL}/api/products/stock/${product.id}`,
        {
          stock: product.stock - quantity,
          id: product.id,
        }
      );

      const order = await createOrder({
        user_id,
        product_id,
        quantity,
        total: totalPrice,
      });

      reply.send(
        GlobalResponse(order, "Success", "Order created successfully")
      );
    } catch (error) {
      console.log(error);
    }
  }

  static async orderByUser(req, reply) {
    try {
      const { id: user_id } = req.user;

      const order = await orderByUser(user_id);

      if (!order) {
        return reply.send(GlobalResponse(null, "Error", "Order not found"));
      }

      reply.send(GlobalResponse(order, "Success", "Success get data"));
    } catch (error) {
      console.log(error);
    }
  }

  static async orderByProductId(req, reply) {
    try {
      const { id: product_id } = req.params;

      const order = await orderByProductId(product_id);

      if (!order) {
        return reply.send(GlobalResponse(null, "Error", "Order not found"));
      }

      reply.send(GlobalResponse(order, "Success", "Success get data"));
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = OrderController;
