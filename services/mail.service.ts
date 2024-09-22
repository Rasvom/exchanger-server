import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendConfirmationEmail = async (email: string, code: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Код подтверждения',
    text: `Ваш код подтверждения ${code}`,
  });
};

export { sendConfirmationEmail };
