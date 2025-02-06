import mongoose from 'mongoose';

const tradeAssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  img: { type: String, required: true },
  active: { type: Boolean, required: true },
  assetType: { type: String, required: true, enum: ['crypto', 'bank'] },
});

const TradeAsset = mongoose.model('TradeAsset', tradeAssetSchema);
export default TradeAsset;
