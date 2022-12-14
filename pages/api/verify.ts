import { v4 as uuidv4 } from "uuid";
import { Session } from "next-iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { withSession, contractAddress } from "./utils";

export default withSession(async (req: NextApiRequest & {session: Session}, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {

      const message = { contractAddress, id: uuidv4() };
      req.session.set("message-session", message);
      console.log("[server:message-session]",req.session.get("message-session"));
      await req.session.save();
      console.log("[server:message-session]",req.session.get("message-session"));
      return res.json(message);

    } catch {
      res.status(422).send({message: "Cannot generate a message!"});
    }   
  } else {
    res.status(200).json({message: "Invalid api route"});
  }
})