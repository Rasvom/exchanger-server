import { S3Client } from '@aws-sdk/client-s3';

export const yandexClient = new S3Client({
  region: 'ru-central1',
  endpoint: 'https://storage.yandexcloud.net',
  credentials: {
    accessKeyId: process.env.YANDEX_ACCESS_KEY!,
    secretAccessKey: process.env.YANDEX_SECRET_KEY!,
  },
});
