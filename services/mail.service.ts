import nodemailer, { createTransport, createTestAccount } from 'nodemailer';

const YANDEX_SMTP = {
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

async function sendMail(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
  from?: string;
}) {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = createTransport(YANDEX_SMTP);
      
      const info = await transporter.sendMail({
        from: `"${process.env.YANDEX_SENDER_NAME || 'Exchanger'}" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      
      console.log('Email sent via Yandex 360:', info.messageId);
      return info;
    } catch (error) {
      console.error('Yandex 360 SMTP error:', error);
      throw error;
    }
  }
  
  try {
    const testAccount = await createTestAccount();
    const testTransporter = createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await testTransporter.sendMail({
      from: options.from || 'noreply@ethereal.email',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log('Ethereal test email sent:', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Ethereal email error:', error);
    throw error;
  }
}

const sendConfirmationEmail = async (email: string, code: string) => {
  try {
    const info = await sendMail({
      from: process.env.EMAIL_FROM || '@rasvom',
      to: email,
      subject: 'Код подтверждения',
      text: `Ваш код подтверждения: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Подтверждение email</h2>
          <p>Ваш код подтверждения:</p>
          <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; padding: 20px; background: #f5f5f5; text-align: center;">
            ${code}
          </div>
          <p>Используйте этот код для подтверждения вашего email.</p>
          <p>Если вы не запрашивали это письмо, просто проигнорируйте его.</p>
        </div>
      `,
    });
    
    return info;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

const sendRequestEmail = async (email: string, requestId: string) => {
  try {
    const requestLink = `${process.env.FRONTEND_URL}/requests/${requestId}`;
    
    const info = await sendMail({
      from: process.env.EMAIL_FROM || '@rasvom',
      to: email,
      subject: 'Ваша заявка создана',
      text: `Ваша заявка успешно создана. Вы можете просмотреть её по ссылке: ${requestLink}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Ваша заявка успешно создана!</h2>
          <p>Номер вашей заявки: <strong>${requestId}</strong></p>
          <p>Вы можете отслеживать статус заявки по ссылке ниже:</p>
          <p>
            <a href="${requestLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
              Открыть заявку
            </a>
          </p>
          <p>Или скопируйте ссылку: ${requestLink}</p>
          <hr>
          <p style="font-size: 0.9em; color: #666;">
            Это письмо отправлено автоматически, пожалуйста, не отвечайте на него.
          </p>
        </div>
      `,
    });
    
    return info;
  } catch (error) {
    console.error('Error sending request email:', error);
    throw error;
  }
};

export { sendConfirmationEmail, sendRequestEmail };
