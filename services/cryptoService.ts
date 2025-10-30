import axios from 'axios';
import { CRYPTO_API_URL } from '@config/crypto';
import Crypto from '@models/TradeAsset.model';

type CoinGeckoResponse = Record<string, Record<string, number>>;

let cachedPrices: Record<string, number> = {};

export const fetchCryptoPrices = async () => {
  try {
    const activeCryptos = await Crypto.find({
      active: true,
      symbol: { $ne: 'rub' },
    })
      .select('symbol -_id')
      .lean();

    const ids = activeCryptos.map((crypto) => crypto.symbol).join(',');

    if (!ids) {
      console.warn('Нет активных криптовалют для обновления курсов.');
      return;
    }

    const response = await axios.get<CoinGeckoResponse>(CRYPTO_API_URL, {
      params: {
        ids,
        vs_currencies: 'rub',
      },
    });

    cachedPrices = Object.entries(response.data).reduce(
      (acc, [key, value]) => {
        acc[key] = parseFloat(value['rub'].toFixed(2));
        return acc;
      },
      {} as Record<string, number>,
    );

    console.log('Курсы обновлены:', cachedPrices);
  } catch (error) {
    console.error('Ошибка при обновлении курсов:', error);
  }
};

export const getCachedPrices = () => cachedPrices;
