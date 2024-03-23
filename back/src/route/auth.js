// Підключаємо технологію express для back-end сервера
const express = require('express');
// Створюємо роутер - місце, куди ми підключаємо ендпоінти
const router = express.Router();

// Підключаємо модулі для роботи з даними користувачів, сесіями, підтвердженням, сповіщеннями та банком
const { User } = require('../class/user');
const { Confirm } = require('../class/confirm');
const { Session } = require('../class/session');
const { Notification } = require('../class/notification');
const { Bank } = require('../class/bank');

// Ініціалізація тестового користувача
User.create({
  email: 'user@mail.com',
  password: 'Qw12345678',
});

// ================================================================

// Маршрут для реєстрації користувачів
router.post('/signup', function (req, res) {
  const { email, password } = req.body;

  // Перевірка введення обов'язкових полів
  if (!email || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    });
  }

  try {
    // Спроба отримати користувача за електронною адресою
    const user = User.getByEmail(email);

    // Якщо користувач вже існує, повідомляємо про це
    if (user) {
      return res.status(400).json({
        message: 'Помилка. Такий користувач вже існує',
      });
    }

    // Створення нового користувача
    const newUser = User.create({ email, password });

    // Створення нової сесії для користувача
    const session = Session.create(newUser);

    // Створення токена для підтвердження реєстрації
    const token = Confirm.create({ email: newUser.email });

    // Отримання банківського рахунку користувача
    const userAccountBank = Bank.getAccountByUser(user);
    
    // Якщо рахунок не знайдено, створюємо новий
    if (!userAccountBank) {
      Bank.create(user);
    }

    // Отримання сповіщень для користувача
    let userNotification = Notification.getNotificationByUser(email);
    
    // Якщо сповіщення відсутні, створюємо нове
    if (!userNotification) {
      userNotification = Notification.create(email);
    }
  
    // Додавання нового сповіщення про реєстрацію
    const newNotification = userNotification.addNotification('Ви зареєструвалися', 'login');

    // Відповідь клієнту з даними про реєстрацію та сесії
    return res.status(200).json({
      message: 'Користувач успішно зареєстрований',
      session,
      token,
      userAccountBank,
      newNotification,
    });
    
  } catch (err) {
    // У разі помилки надсилаємо повідомлення про помилку
    return res.status(400).json({
      message: 'Помилка створення користувача',
    });
  }
});

// ===========================================================

// Маршрут для підтвердження email після реєстрації
router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body;

  // Конвертація коду в число
  const numericCode = parseInt(code, 10);

  // Перевірка, що код є числом
  if (!isNaN(numericCode)) {
  } else {
    // У випадку помилки спроби конвертації коду повідомляємо користувача
    console.log(req.body, 'Помилка при перетворенні `code` у число');
  }

  // Перевірка наявності обов'язкових полів
  if (!numericCode || !token) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    });
  }

  try {
    // Перевірка наявності коду
    if (!numericCode) {
      return res.status(400).json({
        message: 'Код не існує',
      });
    }

    // Отримання сесії за допомогою токена
    const session = Session.get(token);

    // Якщо сесію не знайдено, повідомляємо про це користувача
    if (!session) {
      return res.status(400).json({
        message: 'Помилка. Ви не увійшли в аккаунт',
      });
    }

    // Отримання email за допомогою коду підтвердження
    const email = Confirm.getData(numericCode);

    // Якщо email не знайдено, повідомляємо про помилку
    if (!email) {
      return res.status(400).json({
        message: 'Код не існує',
      });
    }

    // Перевірка, чи email сесії відповідає email підтвердження
    if (email.email !== session.user.email) {
      return res.status(400).json({
        message: 'Код не дійсний'
      });
    }

    // Отримання даних користувача
    const user = User.getByEmail(session.user.email);

    // Оновлення статусу підтвердження email користувача
    user.isConfirm = true;
    session.user.isConfirm = true;

    // Відповідь клієнту про успішне підтвердження email
    return res.status(200).json({
      message: 'Ви підтвердили свою пошту',
      session,     
    });
  } catch (err) {
    // Відправляємо повідомлення про помилку
    return res.status(400).json({
      message: err.message,
    });
  }
});

// ================================================================

// Маршрут для відновлення доступу користувача
router.post('/recovery', function (req, res) {
  const { email } = req.body;

  // Перевірка введення email
  if (!email) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    });
  }

  try {
    // Отримання даних користувача за email
    const user = User.getByEmail(email);

    // Якщо користувач не знайдений, повідомити про це
    if (!user) {
      return res.status(400).json({
        message: 'Користувач з таким email не існує',
      });
    }

    // Створення коду для відновлення
    Confirm.create(email);

    // Відправка коду користувачеві
    return res.status(200).json({
      message: 'Код для відновлення паролю відправлено',
    });
  } catch (err) {
    // У разі помилки відправити повідомлення про це
    return res.status(400).json({
      message: err.message,
    });
  }
});

// ================================================================

// Маршрут для підтвердження відновлення доступу користувача
router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body;

  // Перевірка введення обов'язкових даних
  if (!code || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    // Отримання email за кодом
    const email = Confirm.getData(Number(code));

    // Якщо email не знайдений, повідомити про це
    if (!email) {
      return res.status(400).json({
        message: 'Код не існує(recovery)',
      })
    }

    // Отримання даних користувача за email
    const user = User.getByEmail(email);

    // Перевірка на існування користувача
    if (!user) {
      return res.status(400).json({
        message: 'Користувач з таким email не існує',
      })
    }

    // Змінення паролю користувача
    user.password = password;
    user.isConfirm = true;

    // Створення нової сесії для користувача
    const session = Session.create(user);

    // Відправка відповіді про успішне відновлення доступу
    return res.status(200).json({
      message: 'Пароль змінено',
      session,
            redirectUrl: '/balance' // URL для переадресації користувача
    });
  } catch (err) {
    // У разі помилки відправити повідомлення про це
    return res.status(400).json({
      message: err.message,
    })
  }
});


// ================================================================

// Маршрут для входу в систему користувача
router.post('/signin', function (req, res) {
  const { email, password, session } = req.body;

  // Перевірка введення email та пароля
  if (!email || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  // Отримання даних користувача
  const user = User.getByEmail(String(email));

  try {
    // Якщо користувач не знайдений, повідомити про це
    if (!user) {
      return res.status(400).json({
        message: 'Помилка. Користувач з таким email не існує',
      });
    }
    
    // Перевірка паролю
    if (user.password !== password) {
      return res.status(400).json({
        message: 'Помилка. Пароль не підходить',
      });
    }
    
    // Отримання або створення сесії, залежно від того, чи вже існує сесія
    if (!session) {
      // Створення нової сесії
      const session = Session.create(user);

      // Створення коду для підтвердження
      const code = Confirm.create({ email });

      // Отримання або створення сповіщень для користувача
      let userNotification = Notification.getNotificationByUser(email);
      if (!userNotification) {
        userNotification = Notification.create(email);
      }

      // Додавання нового сповіщення про вхід у систему
      const newNotification = userNotification.addNotification('Ви увійшли в систему', 'login');

      // Відправка відповіді
      return res.status(200).json({
        message: 'Ви увійшли',
        session,
        code,
        newNotification,
      });
    } else if (session && session.user.isConfirm === true) {
      // Якщо сесія існує і користувач підтверджений
      const session = Session.create(user);
      return res.status(200).json({
        message: 'Ви увійшли',
        session,
      });
    } else if(session) {
      // Якщо сесія існує і користувач не підтверджений
      // Створення нової сесії та згенерованого коду для підтвердження
      const session = Session.create(user);
      const code = Confirm.create({ email });

      // Отримання або створення сповіщень для користувача
      let userNotification = Notification.getNotificationByUser(email);
      if (!userNotification) {
        userNotification = Notification.create(email);
      }

      // Додавання нового сповіщення про вхід у систему
      const newNotification = userNotification.addNotification('Ви увійшли в систему', 'login');

      return res.status(200).json({
        message: 'Ви увійшли',
        session,
        code,
        newNotification,
      });
    }
  } catch (err) {
    // У разі помилки відправити повідомлення про це
    return res.status(400).json({
      message: err.message,
    });
  }
});

  // Підключаємо роутер до бек-енду
  module.exports = router;