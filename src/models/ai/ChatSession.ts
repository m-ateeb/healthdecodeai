import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: { 
    type: String, 
    enum: ["user", "assistant", "system"], 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

const chatSessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    default: "New Chat"
  },
  type: {
    type: String,
    enum: ["report", "medication"],
    default: "report"
  },
  messages: [messageSchema],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

chatSessionSchema.pre('save', function() {
  this.updatedAt = new Date();
});

const ChatSession = mongoose.models.ChatSession || mongoose.model("ChatSession", chatSessionSchema);

export default ChatSession;

export interface IChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface IChatSession {
  _id: string;
  userId: string;
  sessionId: string;
  title: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
