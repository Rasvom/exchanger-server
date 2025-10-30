import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: 'https://storage.yandexcloud.net',
  region: 'ru-central1',
  credentials: {
    accessKeyId: process.env.YANDEX_ACCESS_KEY || '',
    secretAccessKey: process.env.YANDEX_SECRET_KEY || '',
  },
});

export const uploadFile = async (file: Express.Multer.File, fileName: string) => {
  const command = new PutObjectCommand({
    Bucket: process.env.YANDEX_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);

  return `https://${process.env.YANDEX_BUCKET_NAME}.storage.yandexcloud.net/${fileName}`;
};
