import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // ID пользователя, создавшего заявку
      ref: 'User',
      required: false,
    },
    sendMethod: {
      type: Object, // Метод отправки средств (например, карта, СБП)
      required: true,
    },
    sendAccountNumber: {
      type: String, // Номер счета или карты, с которого отправляются средства
      required: false,
    },
    sendAmount: {
      type: Number, // Сумма для отправки
      required: true,
      min: 0,
    },
    receiveMethod: {
      type: Object, // Метод получения средств (например, карта, СБП)
      required: true,
    },
    receiveAccountNumber: {
      type: String, // Номер счета или карты для получения средств
      required: true,
    },
    receiveAmount: {
      type: Number, // Сумма для получения
      required: true,
      min: 0,
    },
    email: {
      type: String, // Электронная почта для связи
      required: true,
      minlength: 3,
    },
    status: {
      type: String, // Статус заявки (например, CREATED, APPROVED, CANCELED)
      default: 'CREATED',
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId, // ID менеджера, обрабатывающего заявку
      ref: 'User',
      required: false,
    },
    cancelReason: {
      type: String, // Причина отмены заявки (если применимо)
      required: false,
    },
    phoneNumber: {
      type: String, // Номер телефона для оплаты по СБП
      required: false,
    },
    recipientName: {
      type: String, // Имя получателя средств
      required: false,
      minlength: 3,
    },
    telegramLink: {
      type: String, // Ссылка на Telegram для связи
      required: false,
    },
  },
  { timestamps: true }, // Автоматическое добавление полей createdAt и updatedAt
);

const Request = mongoose.model('Request', requestSchema);
export default Request;
