import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      lowercase: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;
