// Підключаємо технологію express для back-end сервера.
const express = require('express');
// Cтворюємо роутер - місце, куди ми підключаємо визначені маршрути.
const router = express.Router();

// Підключаємо модулі користувача, сесії, банківського рахунку, сповіщень.
const { User } = require('../class/user');
const { Session } = require('../class/session');
const { Bank } = require('../class/bank');
const { Notification } = require('../class/notification');

// Створення тестового користувача при ініціалізації.
User.create({
  email: 'user@mail.com',
  password: '123qweQWE',
});

// ============================================================

// Маршрут для отримання списку всіх користувачів.
router.post('/user-list-data', function (req, res) {
  const list = User.getList();
 
  // Якщо список користувачів порожній, повертаємо відповідний статус та повідомлення.
  if (list.length === 0) {
    return res.status(400).json({
      message: 'Список користувачів порожній',
    });
  }

  // Якщо список існує, повертаємо його з даними про ID та email користувачів.
  return res.status(200).json({
    list: list.map(({ id, email }) => ({
      id,
      email,
    })),
  });
});

// ============================================================

// Маршрут для перевірки, чи зайнятий email.
router.post('/check-email', async (req, res) => {
  const { email } = await req.body;

  // Перевіряємо наявність email.
  if (!email) {
    return res.status(400).json({
      message: "Помилка. Ім'я користувача не вказано",
    });
  }

  // Спроба знайти користувача з таким email.
  try {
    const user = await User.getByEmail(email);

    // Якщо користувач знайдений, відправляємо повідомлення про те, що email вже існує.
    if (user) {
      return res.status(200).json({
        exists: true,
        message: 'Користувач з таким іменем вже існує',
      });
    } else {
      // Якщо користувач не знайдений, повідомляємо, що ім'я доступне.
      return res.status(200).json({
        exists: false,
        message: "Ім'я користувача доступне для реєстрації",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: 'Помилка сервера при перевірці імені користувача',
    });
  }
});

// ============================================================

// Маршрут для отримання та управління балансом користувача.
router.post('/balance', function (req, res) {
  const { session } = req.body;
  
  const user = session.user.email;
  const userAccount = Bank.getAccountByUser(user);

  try {   
    // Якщо банківський рахунок для користувача не існує - створюємо його.
    if (!userAccount) {
      Bank.create(user);
    }

    // Отримання поточного балансу.
    let currentBalance = Number(userAccount.getBalance());

    // Отримання історії транзакцій.
    const transactionHistory = userAccount.getTransactionHistory();

    // Перевірка типу запиту і виконання відповідної операції: отримання балансу, надходження або відправлення коштів.
    if (req.body.type === 'balance') {
      return res.status(200).json({
        currentBalance,
        transactionHistory,
      });
    } else if (req.body.type === 'Receive') {
      const { paymentSystem, amountReceive } = req.body;
      const newBalance = userAccount.receive(Number(amountReceive), paymentSystem);
      currentBalance = newBalance;

      return res.status(200).json({
        paymentSystem,
        currentBalance,
        transactionHistory,
        redirectUrl: '/balance',
      });
    } else if (req.body.type === 'Send') {
      const { amountSend, email } = req.body;
      const newBalance = userAccount.send(Number(amountSend), email);
      currentBalance = newBalance;

      return res.status(200).json({
        currentBalance,
        transactionHistory,
        redirectUrl: '/balance',
      });
    }
    
  } catch (err) {
    return res.status(500).json({
      message: 'Помилка сервера при перевірці балансу користувача',
    });
  }
});

// ============================================================

// Маршрут для перегляду окремої транзакції.
router.post('/transaction/:transactionId', function (req, res) {
  
  const { session, transactionId } = req.body;
  
  const user = session.user.email;
  const bankAccount = Bank.getAccountByUser(user);
  const id = Number(transactionId);

  try {
    // Отримання інформації про транзакцію за його ідентифікатором.
    const transaction = bankAccount.getTransactionById(id);

    if (transaction) {
      return res.status(200).json({ 
        transaction,
        redirectUrl: '/transaction/:transactionId',
      });
    } else {
      return res.status(404).json({ message: 'Транзакція не знайдена' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Внутрішня помилка сервера при спробі отримати транзакцію' });
  }
});

// ============================================================
// Маршрут для зміни email користувача.
router.post('/settings/email', function (req, res) {
  const { newEmail, password, session } = req.body;
  // Перевіряємо, чи новий email та пароль були надані у запиті.
  if (!newEmail || !password) {
    // Якщо одне з полів відсутнє, повертаємо помилку з відповідним повідомленням.
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    });
  }

  // Витягнення поточного email з об'єкта сесії.
  const email = session.user.email;
  // Отримання даних поточного користувача.
  const user = User.getByEmail(email);
  
  // Перевіряємо, чи існує користувач із таким email.
  if (!user) {
    // Якщо користувача не знайдено, повертаємо помилку з повідомленням.
    return res.status(400).json({
      message: 'Користувач з таким email не існує',
    });
  }

  // Перевіряємо, чи email користувача сесії співпадає з email, що був зареєстрований.
  if (user.email !== session.user.email) {
    // Якщо не співпадають, повертаємо помилку.
    return res.status(300).json({
      message: 'користувач сесії не співпадає з користувачем реєстрації',
    });
  }

  // Перевіряємо правильність введеного пароля.
  if (user.password !== password) {
    // Якщо пароль невірний, повертаємо помилку.
    return res.status(300).json({
      message: 'Пароль не вірний',
    });
  }
  
  try {
    // Змінюємо електронну пошту користувача на нову.
    user.email = newEmail;
    
    // Створюємо нову сесію для користувача з оновленою електронною адресою.
    const newSession = Session.create(user);
    
    // Отримання поточного банківського рахунку.
    const account = Bank.getAccountByUser(email);
    
    // Оновлюємо email банківського рахунку.
    const newAccountBank = account.updateEmail(newEmail);
    
    // Отримання сповіщень користувача.
    let userNotification = Notification.getNotificationByUser(email);
   
    // Якщо сповіщень не знайдено, створюємо нове.
    if (!userNotification) {
      userNotification = Notification.create(newEmail);
    }
    
    // Оновлюємо email для сповіщень.
    const newAccountNotification = userNotification.updateEmail(newEmail);
    
    // Створюємо нове сповіщення про зміну email.
    const newNotification = userNotification.addNotification('Ви змінили пошту', 'email');
    
    // Відправляємо відповідь з повідомленням про успішну зміну пошти та новою сесією.
    return res.status(200).json({
      message: 'Email змінено',
      newSession, // нова сесія
      redirectUrl: '/balance', // URL для переадресації
      newAccountBank, // оновлений банківський рахунок
      newNotification, // нове сповіщення
    });
  } catch (err) {
    // Повертаємо помилку, якщо виникає проблема на сервері під час зміни email.
    return res.status(500).json({
      message: 'Помилка сервера при зміні імені користувача',
    });
  }
});

// ============================================================
// Маршрут для зміни паролю користувача.
router.post('/settings/password', async function (req, res) {
  // Отримуємо старий пароль, новий пароль та email з тіла запиту.
  const { oldPassword, newPassword, email } = req.body;

  // Перевіряємо, чи надано всі необхідні дані.
  if (!oldPassword || !newPassword) {
    // Якщо ні, повертаємо помилку з повідомленням, що поля обов’язкові.
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    });
  }

  // Спроба знайти користувача за допомогою email.
  const user = User.getByEmail(email);

  // Якщо користувача не знайдено, повертаємо помилку.
  if (!user) {
    return res.status(400).json({
      message: 'Користувач з таким email не існує',
    });
  }

  // Перевіряємо, чи співпадає старий пароль з паролем у базі даних.
  if (user.password !== oldPassword) {
    // Якщо паролі не співпадають, повідомляємо користувача про помилку.
    return res.status(300).json({
      message: 'Старий пароль не вірний',
    });
  }

  try {
    // Запис нового пароля у дані користувача.
    user.password = newPassword;

    // Створення нової сесії для користувача з оновленим паролем.
    const newSession = Session.create(user);

    // Отримання повідомлень користувача.
    let userNotification = Notification.getNotificationByUser(email);

    // Якщо не існує облікового запису повідомлень для користувача, створюємо новий.
    if (!userNotification) {
      userNotification = Notification.create(email);
    }

    // Додавання нового повідомлення про зміну паролю.
    const newNotification = userNotification.addNotification('Ви успішно змінили пароль', 'password');

    // Повертаємо відповідь з повідомленням про успішне оновлення паролю.
    return res.status(200).json({
      message: 'Пароль успішно змінено',
      newSession, // нова сесія
      redirectUrl: '/balance', // URL для переадресації
      newNotification, // нове повідомлення
    });

  } catch (err) {
    // У разі помилки на сервері повертаємо повідомлення про помилку.
    return res.status(500).json({
      message: 'Помилка сервера при зміні паролю користувача',
    });
  }

});

// ============================================================
// Маршрут для управління сповіщеннями користувача.
router.post('/notifications', function (req, res) {
  // Отримуємо об'єкт користувача з тіла запиту.
  const { user } = req.body;

  try {
    // Отримуємо дані сповіщень для користувача.
    const userNotification = Notification.getNotificationByUser(user);
    
    // Якщо обліковий запис сповіщень для користувача відсутній, створюємо новий.
    if (!userNotification) {
      Notification.create(user); // Створення нових повідомлень для користувача
    }

    // Отримання історії сповіщень користувача.
    const list = userNotification.getNotificationHistory();

    // Надсилання історії сповіщень клієнту у відповіді.
    return res.status(200).json({
      list, // Список сповіщень
    }); 

  } catch (err) {
    // Якщо в процесі виникає помилка, повертаємо помилку сервера.
    return res.status(500).json({
      message: 'Помилка сервера при перевірці історії сповіщень користувача',
    }); 
  }
});



// Підключаємо визначені маршрути до бек-енду.
module.exports = router;