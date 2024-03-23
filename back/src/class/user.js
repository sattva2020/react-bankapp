// Клас для роботи з даними користувачів.

class User {
  // Статичне поле для збереження списку всіх користувачів.
  static #list = [];

  // Статичний лічильник для автоматичного присвоєння унікального ID користувачам.
  static #count = 1;

  // Конструктор класу для створення нового користувача.
  constructor({ email, password }) {
    this.id = User.#count++; // Автоматичне присвоєння ID новому користувачу.
    this.email = String(email).toLowerCase(); // Збереження email у нижньому регістрі.
    this.password = String(password); // Збереження пароля.
    this.isConfirm = false; // Прапорець підтвердження електронної адреси користувача.
  }

  // Статичний метод для отримання користувача за електронною поштою.
  static getByEmail(email) {
    // Пошук користувача у списку по електронній пошті.
    return (
      this.#list.find(
        (user) => user.email === String(email).toLowerCase(),
      ) || null // Якщо користувач не знайдений, повертаємо null.
    );
  }

  // Статичний метод для створення нового користувача.
    static create(data) {
        const existUser = this.getByEmail(data.email); // Перевірка наявності користувача з таким email.
    
        if (existUser) {
            return existUser; // Повертаємо існуючого користувача.
        }
    
        const user = new User(data); // Створення нового користувача.
        this.#list.push(user); // Додавання нового користувача до списку.
    
        return user; // Повернення об'єкта створеного користувача.
    }  
}

// Експорт класу User, щоб його можна було використовувати в інших місцях програми.
module.exports = User;