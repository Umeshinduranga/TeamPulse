import { Schema, model, type InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['member', 'manager'],
      default: 'member',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type User = InferSchemaType<typeof userSchema>;
const User = model('User', userSchema);
export default User; // <-- Ensure it is exported as default