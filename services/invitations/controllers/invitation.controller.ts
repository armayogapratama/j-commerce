import axios = require("axios");

const { GlobalResponse } = require("../globals/responses/res");
const {
  invitationLists,
  sendInvitation,
} = require("../services/invitation.service");
const jwt = require("jsonwebtoken");

class InvitationController {
  static async invitationLists(req, reply) {
    try {
      const invitations = await invitationLists();

      reply.send(GlobalResponse(invitations, "Success get data", "Success"));
    } catch (error) {
      console.log(error);
    }
  }

  static async invitationCreate(req, reply) {
    try {
      const { email } = req.body;
      const { id } = req.user;

      const token = jwt.sign({ email: email, id: id }, process.env.JWT_SECRET);

      await sendInvitation({ email, token, id });

      reply.send(
        GlobalResponse(
          {
            email: email,
            token: token,
          },
          "Invitation sent successfully",
          "Success"
        )
      );
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = InvitationController;
