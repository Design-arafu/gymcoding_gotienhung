import mongoose from 'mongoose';

export type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  provider: string;
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    isAdmin: { 
      type: Boolean,
      required: true,
      default: false 
    },
    provider: {
      type: String,
      default: "credentials"
    }
  },
  { timestamps: true },
);

const UserModel = mongoose.models?.User || mongoose.model('User', UserSchema);

export default UserModel;
