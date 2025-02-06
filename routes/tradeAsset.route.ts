import { Router } from 'express';
import { getCryptoPrices, createTradeAsset, getTradeAssets } from '@controllers/crypto';

const router = Router();

router.get('/prices', getCryptoPrices);
router.get('/trade-assets', getTradeAssets);
router.post('/create', createTradeAsset);

export default router;
