import axios from 'axios';
import { CRYPTO_API_URL } from '@config/crypto';
import Crypto from '@models/TradeAsset.model'; // Подключаем модель Crypto

type CoinGeckoResponse = Record<string, Record<string, number>>;

let cachedPrices: Record<string, number> = {};

// Функция для получения актуальных данных о криптовалютах
export const fetchCryptoPrices = async () => {
  try {
    // Получаем список активных криптовалют из базы данных
    const activeCryptos = await Crypto.find({
      active: true,
      symbol: { $ne: 'rub' }, // Исключить записи, где symbol равен 'rub'
    })
      .select('symbol -_id')
      .lean();

    const ids = activeCryptos.map((crypto) => crypto.symbol).join(',');

    if (!ids) {
      console.warn('Нет активных криптовалют для обновления курсов.');
      return;
    }

    // Отправляем запрос в CoinGecko API
    const response = await axios.get<CoinGeckoResponse>(CRYPTO_API_URL, {
      params: {
        ids, // Список криптовалют
        vs_currencies: 'rub', // Валюты для конвертации
      },
    });

    // Обновляем кэш
    cachedPrices = Object.entries(response.data).reduce(
      (acc, [key, value]) => {
        acc[key] = parseFloat(value['rub'].toFixed(2)); // Сохраняем цену в рублях с двумя знаками
        return acc;
      },
      {} as Record<string, number>,
    );

    console.log('Курсы обновлены:', cachedPrices);
  } catch (error) {
    console.error('Ошибка при обновлении курсов:', error);
  }
};

// Функция для получения кэшированных данных
export const getCachedPrices = () => cachedPrices;
