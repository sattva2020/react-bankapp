// SignupPage

import "./index.css";
import "../../style/authentication.css"

import React, { useState } from 'react';
import BackButton from "../../component/back-button";
import { useAuth } from '../../component/AuthContextProvider';
import { REG_EXP_EMAIL, REG_EXP_PASSWORD } from '../../script/form';
import { saveSession } from "../../script/session";
import Field from "../../component/Field";
import Header from '../../component/Header'
import Button from "../../component/Button";
import { useNavigate } from "react-router-dom";

 
const SignUpPage = ({ history }) => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userExistsMessage, setUserExistsMessage] = useState('');
  const { dispatch } = useAuth();

	const navigate = useNavigate()

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!REG_EXP_EMAIL.test(email)) {
      setUserExistsMessage('Недійсний формат електронної пошти. Будь ласка, введіть дійсну адресу електронної пошти.');
      return;
    }

    if (!REG_EXP_PASSWORD.test(password)) {
      setUserExistsMessage('Пароль має містити не менше 8 символів, включаючи літери та цифри.');
      return;
    }

    const response = await fetch('http://localhost:4000/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

		

    if (response.ok) {
      const data = await response.json();

      if (data.exists) {
        setUserExistsMessage('Користувач з таким іменем вже існує');
      } else {
        setUserExistsMessage('');

        if (data.url) {
      		navigate(data.url);
					// window.location.assign(data.url);
        } else {
          try {
            const signupResponse = await fetch('http://localhost:4000/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            });

            if (signupResponse.ok) {
              const signupData = await signupResponse.json();

              saveSession(signupData.session);

              dispatch({ type: 'LOGIN', payload: { token: signupData.token, user: signupData.user } });
							// navigate('/signup-confirm');
              window.location.assign('/signup-confirm');
            } else {
              const errorData = await signupResponse.json();
              console.error('Не вдалося зареєструватися. Помилка серверу:', errorData);
            }
          } catch (error) {
            console.error('Помилка під час реєстрації:', error);
          }
        }
      }
    } else {
      const errorData = await response.json();
      console.error('Не вдалося перевірити існування користувача. Помилка серверу:', errorData);
    }
  };

  return (
    <div className='authentication__page '>
      <div className="authentication__header">
        <BackButton />
				<Header
					text='Sign Up'
					description="Choose a registration method"
				/>
        
      </div>
      

      <form onSubmit={handleFormSubmit}  className='authentication__body'>
   
				<Field
					text = 'Email:'
					type = 'email'
					placeholder="Email"
					value={email}
					onChange={handleUsernameChange}		
				/>

				<Field
					text = 'Password:'
					type = 'password'
					placeholder="Password"
					value={password}
					onChange={handlePasswordChange}						
				/>					

				<span >
					Already have an account? 
					<a href="http://localhost:3000/signin" className="href">
						Sign In
					</a>
				</span>
				<Button
					type="submit"
					text="Sign Up"
				/>        

				{userExistsMessage && 
					<div className="alert">
						<p className="alert__text">{userExistsMessage}</p>
					</div>
				} 
       
      </form>

			
    </div>
  );
};

export default SignUpPage;
