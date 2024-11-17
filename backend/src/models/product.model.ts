import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  tag: string[];
  image: string[];
  owner: Schema.Types.ObjectId;
}
const ProductSchema: Schema<IProduct> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tag: [
      {
        type: String,
        required: true,
      },
    ],
    image: [
      {
        type: String,
        required: true,
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
