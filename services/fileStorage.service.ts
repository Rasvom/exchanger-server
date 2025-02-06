import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: 'https://storage.yandexcloud.net', // URL Yandex Object Storage
  region: 'ru-central1',
  credentials: {
    accessKeyId: process.env.YANDEX_ACCESS_KEY || '',
    secretAccessKey: process.env.YANDEX_SECRET_KEY || '',
  },
});

export const uploadFileToYandex = async (
  buffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: process.env.YANDEX_BUCKET_NAME || '',
    Key: fileName,
    Body: buffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);

  // Возвращаем URL загруженного файла
  return `https://${process.env.YANDEX_BUCKET_NAME}.storage.yandexcloud.net/${fileName}`;
};
