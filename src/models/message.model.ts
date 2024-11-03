import mongoose, { Model, Schema } from "mongoose";
import { IMessage } from "../@types/schema.types";

const messageSchema: Schema<IMessage> = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
