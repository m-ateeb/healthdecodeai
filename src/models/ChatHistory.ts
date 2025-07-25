import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  messages: [
    {
      role: { type: String, enum: ["user", "assistant"], required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const ChatHistory = mongoose.models.ChatHistory || mongoose.model("ChatHistory", chatHistorySchema);

export default ChatHistory;
export type ChatHistoryType = {
  _id: string;
  userId: string;
  messages: {
    role: "user" | "assistant";
    content: string;
    createdAt: Date;
  }[];
};