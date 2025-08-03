const db = require("../configs/config");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const createUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const user = await db
      .insert({
        name,
        email,
        password,
        role: "buyer",
      })
      .into("users")
      .returning({
        id: "id",
        name: "name",
        email: "email",
        role: "role",
        created_at: "created_at",
        updated_at: "updated_at",
      });

    return user[0];
  } catch (error) {
    console.log(error);
  }
};

const createAdmin = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const user = await db
      .insert({
        name,
        email,
        password,
        role: "admin",
      })
      .into("users")
      .returning({
        id: "id",
        name: "name",
        email: "email",
        role: "role",
        created_at: "created_at",
        updated_at: "updated_at",
      });

    return user[0];
  } catch (error) {
    console.log(error);
  }
};

const userByEmail = async (email: { email: string }) => {
  try {
    const user = await db.select("*").from("users").where({ email: email });
    console.log(user, "di service");

    return user[0];
  } catch (error) {
    console.log(error);
  }
};

const userById = async (id: { id: number }) => {
  try {
    const user = await db.select("*").from("users").where({ id });

    return user[0];
  } catch (error) {
    console.log(error);
  }
};

const forgotPassword = async ({
  email,
  resetLink,
}: {
  email: string;
  resetLink: string;
}) => {
  try {
    const mailOptions = {
      from: "armayogaganssssss@gmail.com",
      to: email,
      subject: "Reset Password Request",
      text: `Click the link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async ({
  password,
  email,
}: {
  password: string;
  email: string;
}) => {
  try {
    const user = await db
      .update({ password })
      .into("users")
      .where({ email })
      .returning({
        id: "id",
        name: "name",
        email: "email",
        role: "role",
        created_at: "created_at",
        updated_at: "updated_at",
      });

    return user[0];
  } catch (error) {
    console.log(error);
  }
};

const userByRole = async (role: string) => {
  try {
    const user = await db.select("*").from("users").where({ role });

    return user.map(
      (item: {
        id: number;
        name: string;
        email: string;
        role: string;
        created_at: Date;
        updated_at: Date;
      }) => {
        return {
          id: item.id,
          name: item.name,
          email: item.email,
          role: item.role,
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createUser,
  createAdmin,
  userByEmail,
  userById,
  forgotPassword,
  resetPassword,
  userByRole,
};
