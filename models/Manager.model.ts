import mongoose from 'mongoose';

const managerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: 3,
    },
    login: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      match: /^[A-Za-z]+$/,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
  },
  { timestamps: true },
);

const Manager = mongoose.model('Manager', managerSchema);
export default Manager;
