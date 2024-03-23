// Класи та методи для управління нотифікаціями користувачів.

// Основний клас для управління системою нотифікацій.
class Notification {
  // Приватне статичне поле для зберігання всіх облікових записів нотифікацій.
  static #list = [];

  // Статичний метод для створення нового облікового запису нотифікацій для користувача.
  static create(user) {
    const notificationAccount = new NotificationAccount(user);
    this.#list.push(notificationAccount); // Додавання облікового запису до списку.
    return notificationAccount; // Повернення створеного облікового запису.
  }

  // Статичний метод для отримання облікового запису нотифікацій за ім’ям користувача.
  static getNotificationByUser(user) {
    return this.#list.find(account => account.user === user); // Пошук в списку за ім’ям користувача.
  }
}

// Клас для роботи з індивідуальним обліковим записом нотифікацій.
class NotificationAccount {
  // Приватні поля для історії нотифікацій та лічильника ID.
  #notifications = [];
  #notificationIdCounter = 0;

  // Конструктор класу, який ініціалізує нотифікації для користувача.
  constructor(user) {
    this.user = user; // Зберігаємо користувача, якому належать нотифікації.
  }

  // Метод для оновлення email в усіх нотифікаціях користувача.
  updateEmail(newEmail) {
    this.user = newEmail; // Оновлення email в обліковому записі.
    this.#notifications.forEach(notification => {
      if (notification.email === this.user) {
        notification.email = newEmail; // Оновлення email в кожній нотифікації.
      }
    });
    return this; // Повертаємо оновлений обліковий запис.
  }

  // Метод для додавання нової нотифікації в історію.
  addNotification(message, type) {
    const notification = {
      id: this.#notificationIdCounter++, // Присвоєння унікального ID.
      message, // Текст повідомлення.
      time: new Date(), // Час створення нотифікації.
      type, // Тип нотифікації (наприклад: "email", "password").
    };
    this.#notifications.push(notification); // Додавання нотифікації до історії.
    return notification; // Повертаємо створену нотифікацію.
  }

  // Метод для отримання всієї історії нотифікацій.
  getNotificationHistory() {
    // Повернення копії массиву, для забезпечення імутабельності приватного поля.
    return [...this.#notifications];
  }
}

// Експорт класів для можливості їх використання в інших модулях.
module.exports = {
  Notification,
  NotificationAccount,
};