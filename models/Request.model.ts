import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    sendMethod: {
      type: String,
      required: true,
    },
    sendAccountNumber: {
      type: String,
      required: true,
    },
    sendAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    receiveMethod: {
      type: String,
      required: true,
    },
    receiveAccountNumber: {
      type: String,
      required: true,
    },
    receiveAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    fullName: {
      type: String,
      required: true,
      minlength: 3,
    },
    cancelReason: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const Request = mongoose.model('Request', requestSchema);
export default Request;
