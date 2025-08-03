import axios = require("axios");

const { GlobalResponse } = require("../globals/responses/res");
const {
  productLists,
  productByName,
  createProduct,
  productById,
  updateProduct,
  deleteProduct,
  stockUpdate,
  softDelete,
} = require("../services/product.service");

class ProductController {
  static async productList(req, reply) {
    try {
      const products = await productLists();

      reply.send(GlobalResponse(products, "Success get products", "Success"));
    } catch (error) {
      console.log(error);
    }
  }

  static async productCreate(req, reply) {
    try {
      const { name, description, price, stock } = req.body;

      const product = await productByName(name);

      if (product) {
        return reply.send(
          GlobalResponse(null, "Error", "Product already exists")
        );
      }

      const newProduct = await createProduct({
        name,
        description,
        price,
        stock,
      });

      reply.send(
        GlobalResponse(newProduct, "Product created successfully", "Success")
      );
    } catch (error) {
      console.log(error);
    }
  }

  static async productDetail(req, reply) {
    try {
      const { id } = req.params;

      const product = await productById(id);

      if (!product) {
        return reply.send(GlobalResponse(null, "Error", "Product not found"));
      }

      reply.send(GlobalResponse(product, "Success get product", "Success"));
    } catch (error) {
      console.log(error);
    }
  }

  static async productUpdate(req, reply) {
    try {
      const { id } = req.params;
      const { name, description, price, stock } = req.body;

      const product = await productById(id);

      if (!product) {
        return reply.send(GlobalResponse(null, "Error", "Product not found"));
      }

      const productExists = await productByName(name);

      if (productExists) {
        return reply.send(
          GlobalResponse(
            null,
            "Error",
            "Product already exists, please change product name and try again"
          )
        );
      }

      const productUpdate = await updateProduct({
        id,
        name,
        description,
        price,
        stock,
      });

      reply.send(
        GlobalResponse(productUpdate, "Product updated successfully", "Success")
      );
    } catch (error) {
      console.log(error);
    }
  }

  static async productDelete(req, reply) {
    try {
      const { id } = req.params;

      const product = await productById(id);

      if (!product) {
        return reply.send(GlobalResponse(null, "Error", "Product not found"));
      }

      const productDelete = await deleteProduct(id);

      reply.send(
        GlobalResponse(productDelete, "Product deleted successfully", "Success")
      );
    } catch (error) {
      console.log(error);
    }
  }

  static async productStockUpdate(req, reply) {
    try {
      const { stock, id } = req.body;

      const product = await productById(id);

      if (!product) {
        return reply.send(GlobalResponse(null, "Error", "Product not found"));
      }

      const productUpdate = await stockUpdate({
        id,
        stock,
      });

      console.log(productUpdate, "productUpdate");

      reply.send(
        GlobalResponse(
          productUpdate,
          "Product stock updated successfully",
          "Success"
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  static async softDelete(req, reply) {
    try {
      const { id } = req.params;

      const product = await productById(id);

      if (!product) {
        return reply.send(GlobalResponse(null, "Error", "Product not found"));
      }

      if (product.status === false) {
        return reply.send(GlobalResponse(null, "Error", "Product not found"));
      }

      const response = await axios.get(
        `${process.env.ORDER_URL}/api/orders/product-list/${id}`,
        {
          headers: {
            // "Content-Type": "application/json",
            Authorization: `${req.headers.authorization}`,
          },
        }
      );

      const order = response.data.data;

      if (order) {
        return reply.send(
          GlobalResponse(
            null,
            "Error",
            "Can not delete product because it has order"
          )
        );
      }

      const productDelete = await softDelete(id);

      reply.send(
        GlobalResponse(productDelete, "Product deleted successfully", "Success")
      );
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ProductController;
