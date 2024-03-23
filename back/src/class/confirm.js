// Клас для управління підтвердженнями.
class Confirm {
  // Приватне поле для зберігання всіх об'єктів Confirm.
  static #list = []

  constructor(data) {
    // Генеруємо код для підтвердження та зберігаємо дані.
    this.code = Number(Confirm.generateCode());
    this.data = data;
  }

  // Статичний метод для генерації випадкового коду підтвердження.
  static generateCode = () => Math.floor(Math.random() * 9000) + 1000;

  // Статичний метод для створення нового підтвердження.
  static create = (data) => {
    const confirmation = new Confirm(data);
    this.#list.push(confirmation);	

    // Встановлюємо таймер для автоматичного видалення підтвердження через 24 години.
    setTimeout(() => {
      this.delete(confirmation.code);
    }, 24 * 60 * 60 * 1000); // 24 години у мілісекундах

    // Виводимо код підтвердження у консолі.
    console.log(confirmation.code, ':path = back/class/confirm.js,20');

    // Повертаємо код підтвердження.
    return confirmation.code;
  };

  // Статичний метод для видалення підтвердження за критерієм коду.
  static delete = (code) => {
    const length = this.#list.length;

    // Фільтруємо список, видаляючи об'єкт із зазначеним кодом.
    this.#list = this.#list.filter(
      (item) => item.code !== code,
    );

    // Повертаємо true або false в залежності від того, чи було здійснено видалення.
    return length > this.#list.length;
  };

  // Статичний метод для отримання даних за кодом підтвердження.
  static getData = (code) => {		
    const obj = this.#list.find(
      (item) => item.code === code,
    );

    // Якщо об'єкт із таким кодом існує, повертаємо його дані, інакше - null.
    return obj ? obj.data : null;
  }
}

// Експортуємо клас Confirm для використання в інших модулях.
module.exports = Confirm;