import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    url: { type: String, required: true },
    cardNumber: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const File = mongoose.model('File', fileSchema);
export default File;
