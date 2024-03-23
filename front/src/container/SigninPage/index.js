import "./index.css";
import "../../style/authentication.css"


import React, { useState } from 'react';
import BackButton from "../../component/back-button";
import { useAuth } from '../../component/AuthContextProvider';
import { REG_EXP_EMAIL, REG_EXP_PASSWORD } from '../../script/form';
import { saveSession } from "../../script/session";
import { useNavigate } from 'react-router-dom';

import Field from '../../component/Field';
import Header from '../../component/Header';
import Button from "../../component/Button";

 
const SigninPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userExistsMessage, setUserExistsMessage] = useState('');
  const { dispatch } = useAuth();
	const [error, setError] = useState('');

	const navigate = useNavigate();




  const handleUsernameChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

		setError('');

    if (!REG_EXP_EMAIL.test(email)) {
      setUserExistsMessage('Недійсний формат електронної пошти. Будь ласка, введіть дійсну адресу електронної пошти.');
      return;
    }

    if (!REG_EXP_PASSWORD.test(password)) {
      setUserExistsMessage('Пароль має містити не менше 8 символів, включаючи літери та цифри.');
      return;
    }

		try {
			const session = window.session
			const res = await fetch('http://localhost:4000/signIn', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password, session }),
			});

			if (res.ok) {

				const signInData = await res.json();

				const session = signInData.session;
				
				saveSession(session)

				// console.log(signInData,'===============')

				if (signInData.session.user.isConfirm === false) {
					navigate('/signup-confirm');								
				} else {
					
					saveSession(signInData.session);
					dispatch({ type: 'LOGIN', payload: { token: signInData.token, user: signInData.user } });
					navigate('/balance');
				}
			} else {
				const errorData = await res.json();
				console.error('Не вдалося увійти. Помилка серверу:', errorData);
				setError( errorData.message); 
			}
		} catch (error) {
			console.error('Помилка під час входу:', error);
			setError( error.message); 
		}
  };



  return (
		
		<div className="authentication__page">
       <div className="authentication__header">
        <BackButton />
				<Header
					text='Sign in'
					description='Select login method'
				/>
       
      </div>

      {userExistsMessage && <p style={{ color: 'red', textAlign: 'center', fontSize: '20px' }}>{userExistsMessage}</p>}
     
		  <form onSubmit={handleFormSubmit} className="authentication__body">
                 
				<Field				
					text = "Email:"
					type = "email"
					placeHolder = "email"
					value = {email}
					onChange = {handleUsernameChange}
				/>

				<Field
					text = 'Password:'
					type = 'password'
					placeholder="Password"
					value={password}
					onChange={handlePasswordChange}		
				/>


				<span className="signIn__span">
					Forgot your password? {` `}
					<a href="http://localhost:3000/recovery" className="signIn__span--href">
					Restore
					</a>
				</span>
				<Button
					type="submit"
					text='Sign In'
				/>   

				<span className="error-message">
					{error}
				</span>       
        
      </form>
    </div>
  );
};

export default SigninPage;
