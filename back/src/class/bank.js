// Головний клас для управління банківськими рахунками.
class Bank {
  // Приватне поле для зберігання списку всіх банківських рахунків.
  static #list = [];

  // Статичний метод для створення нового банківського рахунку.
  static create(user) {
    const bankAccount = new BankAccount(user);
    this.#list.push(bankAccount);
    return bankAccount;
  }

  // Статичний метод для отримання об'єкта BankAccount за користувацьким іменем.
  static getAccountByUser(user) {
    return this.#list.find(account => account.accountUser === user);
  }
}

// Клас, який представляє банківський рахунок окремого користувача.
class BankAccount {
  // Приватне поле для ведення запису транзакцій рахунку.
  #transactions = [];
  // Лічильник для присвоєння унікальних ID кожній транзакції.
  #transactionIdCounter = 1;
  
  constructor(accountUser, initialBalance = 0) {
    // Ім'я власника рахунку.
    this.accountUser = accountUser;
    // Початковий баланс рахунку.
    this.balance = initialBalance;
  }

  // Метод для зміни електронної пошти власника рахунку.
  updateEmail(newEmail) {
    this.accountUser = newEmail;
    this.#transactions.forEach(transaction => {
      if (transaction.email === this.accountUser) {
        transaction.email = newEmail;
      }
    });
    return this;
  }

  // Метод для отримання поточного балансу рахунку.
  getBalance() {
    return this.balance;
  }

  // Метод для отримання всієї історії транзакцій рахунку.
  getTransactionHistory() {
    return this.#transactions;
  }

  // Метод для отримання конкретної транзакції за ID.
  getTransactionById(transactionId) {
    return this.#transactions.find(transaction => transaction.id === transactionId);
  }

  // Метод для обробки вхідної транзакції (додавання коштів на рахунок).
  receive(amount, paymentSystem) {
    if (amount > 0) {
      const transaction = {
        id: this.#transactionIdCounter++,
        type: 'Receive',
        amount,
        paymentSystem,
        time: new Date(),
      };
      this.balance += amount;
      this.#transactions.push(transaction);
      return transaction.id;
    } else {
      // Якщо сума непозитивна, фіксуємо помилку і повертаємо null.
      console.error('Недійсна сума отримання.');
      return null;
    }
  }

  // Метод для обробки вихідної транзакції (відправлення коштів з рахунку).
  send(amount, email) {
    if (amount > 0 && amount <= this.balance) {
      const transaction = {
        id: this.#transactionIdCounter++,
        type: 'Send',
        amount,
        email,
        time: new Date(),
      };
      this.balance -= amount;
      this.#transactions.push(transaction);
      return transaction.id;
    } else {
      // Якщо сума для відправлення некоректна або недостатня, реєструємо помилку і повертаємо null.
      console.error('Недійсна сума відправлення або недостатньо коштів.');
      return null;
    }
  }
}

// Експортуємо класи для подальшого використання в інших модулях.
module.exports = {
  Bank,
  BankAccount,
};