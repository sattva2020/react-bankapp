// front/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Компоненти контексту та маршрутизації
import { AuthContextProvider } from './component/AuthContextProvider';
import AuthRoute from './component/AuthRoute';
import PrivateRoute from './component/PrivateRoute';

// Контейнери сторінок
import WellcomePage from './container/WellcomePage';
import SignupPage from './container/SignupPage';
import SignupConfirmPage from './container/SignupConfirmPage';
import SigninPage from './container/SigninPage';
import RecoveryPage from './container/RecoveryPage';
import RecoveryConfirmPage from './container/RecoveryConfirmPage';
import BalancePage from './container/BalancePage';
import SettingsPage from './container/SettingsPage';
import ReceivePage from './container/ReceivePage';
import SendPage from './container/SendPage';
import TransactionPage from './container/TransactionPage';
import NotificationPage from './container/NotificationPage';
import ErrorPage from './component/ErrorPage';

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        {/* Обгортка всіх маршрутів у Providera контексту аутентифікації */}
        <Routes>
          {/* Стартова сторінка з вітанням */}
          <Route 
            index 
            element={
              <AuthRoute>
                <WellcomePage />
              </AuthRoute>
            } 
          />

          {/* Тут і далі ідуть маршрути для авторизації, відновлення доступу та інші приватні розділи */}
          {/* Деталі впровадження перевірок автентичності та редиректів додаєте за потребою */}

          {/* Сторінка реєстрації */}
          <Route path="/signup" element={ <AuthRoute><SignupPage /></AuthRoute> } />

          {/* Сторінка підтвердження реєстрації */}
          <Route path="/signup-confirm" element={ <PrivateRoute><SignupConfirmPage /></PrivateRoute> } />

          {/* Сторінка входу */}
          <Route path="/signin" element={ <AuthRoute><SigninPage /></AuthRoute> } />

          {/* Сторінка відновлення паролю */}
          <Route path="/recovery" element={ <AuthRoute><RecoveryPage /></AuthRoute> } />

          {/* Сторінка підтвердження відновлення паролю */}
          <Route path="/recovery-confirm" element={ <AuthRoute><RecoveryConfirmPage /></AuthRoute> } />

          {/* Сторінка балансу користувача */}
          <Route path="/balance" element={ <PrivateRoute><BalancePage /></PrivateRoute> } />

          {/* Сторінка налаштувань користувача */}
          <Route path="/settings" element={ <PrivateRoute><SettingsPage /></PrivateRoute> } />

          {/* Сторінка поповнення рахунку */}
          <Route path="/receive" element={ <PrivateRoute><ReceivePage /></PrivateRoute> } />

          {/* Сторінка відправлення коштів іншому користувачу */}
          <Route path="/send" element={ <PrivateRoute><SendPage /></PrivateRoute> } />

          {/* Сторінка деталів транзакції */}
          <Route path="/transaction/:transactionId" element={ <PrivateRoute><TransactionPage /></PrivateRoute> } />

          {/* Сторінка сповіщень */}
          <Route path="/notifications" element={ <PrivateRoute><NotificationPage /></PrivateRoute> } />
          
          {/* Сторінка помилок */}
          <Route path="*" element={ <ErrorPage /> } />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}
     
export default App;
