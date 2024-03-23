// Клас для управління сесіями користувачів в системі.

class Session {
  // Приватне статичне поле для зберігання активних сесій.
  static #list = [];

  // Конструктор класу, який створює новий екземпляр сесії.
  constructor(user) {
    this.token = Session.generateCode(); // Генерація токена для сесії.
    // Зберігання лише необхідної інформації про користувача.
    this.user = {
            id: user.id,
      email: user.email,
      isConfirm: user.isConfirm,      
    };		
  }

  // Метод для генерації унікального токена сесії.
  static generateCode = () => {
    const length = 6; // Довжина токена.
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Набір можливих символів.

    let result = '';

    // Формування рядка токену шляхом випадкового вибору символів.
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
       
    return result; // Повернення сформованого токена.
  };

  // Статичний метод для створення нової сесії.
  static create = (user) => {
    const session = new Session(user); // Створення екземпляру сесії.

    this.#list.push(session); // Додавання сесії до списку активних сесій.

    return session; // Повернення об’єкту нової сесії.
  };

  // Статичний метод для отримання сесії за токеном.
  static get = (token) => {
    // Пошук сесії у списку; повертаємо знайдену сесію або null, якщо такої немає.
    return this.#list.find((item) => item.token === token) || null;
  };
}

// Експорт класу Session, щоб інші частини програми могли його використовувати.
module.exports = Session;