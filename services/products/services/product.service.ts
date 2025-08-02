const db = require("../configs/config");

const productLists = async () => {
  try {
    const products = await db.select("*").from("products").returning("*");

    return products;
  } catch (error) {
    console.log(error);
  }
};

const createProduct = async ({
  name,
  description,
  price,
  stock,
}: {
  name: string;
  description: string;
  price: number;
  stock: number;
}) => {
  try {
    const product = await db
      .insert({
        name,
        description,
        price,
        stock,
      })
      .into("products")
      .returning("*");

    return product[0];
  } catch (error) {
    console.log(error);
  }
};

const productByName = async (name: { name: string }) => {
  try {
    const product = await db
      .select("*")
      .from("products")
      .where({ name })
      .first();

    return product;
  } catch (error) {
    console.log(error);
  }
};

const productById = async (id: { id: number }) => {
  try {
    const product = await db.select("*").from("products").where({ id }).first();

    return product;
  } catch (error) {
    console.log(error);
  }
};

const updateProduct = async (body: {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}) => {
  try {
    const { id, ...rest } = body;
    const product = await db
      .update({ ...rest })
      .into("products")
      .where({ id })
      .returning("*");

    return product[0];
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (id: { id: number }) => {
  try {
    const product = await db
      .delete()
      .from("products")
      .where({ id })
      .returning("*");

    return product[0];
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  productLists,
  createProduct,
  productByName,
  productById,
  updateProduct,
  deleteProduct,
};
