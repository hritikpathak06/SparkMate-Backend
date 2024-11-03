import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: "male" | "female";
  genderPreference: "male" | "female" | "both";
  bio?: string;
  image?: string;
  likes: mongoose.Types.ObjectId[];
  dislikes: mongoose.Types.ObjectId[];
  matches: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  matchPassword(password: string): Promise<boolean>;
}

export interface IMessage extends Document {
  content: string;
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
