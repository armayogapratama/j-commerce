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

const invitationLists = async () => {
  try {
    const invitations = await db.select("*").from("invitations").returning("*");

    return invitations;
  } catch (error) {
    console.log(error);
  }
};

const sendInvitation = async (body: {
  email: string;
  token: string;
  id: number;
}) => {
  try {
    const { email, token, id } = body;

    await db
      .insert({
        token,
        user_id: id,
      })
      .into("invitations")
      .returning("*");

    const mailOptions = {
      from: "armayogaganssssss@gmail.com",
      to: email,
      subject: "Invitation Register Admin",
      text: `Token for your registration: ${token}`,
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  invitationLists,
  sendInvitation,
};
