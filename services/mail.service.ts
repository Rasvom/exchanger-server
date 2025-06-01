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

const sendRequestEmail = async (email: string, requestId: string) => {
  const requestLink = `${process.env.FRONTEND_URL}/requests/${requestId}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Ваша заявка создана',
    text: `Ваша заявка успешно создана. Вы можете просмотреть её по ссылке: ${requestLink}`,
    html: `<p>Ваша заявка успешно создана.</p><p>Вы можете просмотреть её <a href="${requestLink}">по ссылке</a>.</p>`,
  });
};

export { sendConfirmationEmail, sendRequestEmail };
