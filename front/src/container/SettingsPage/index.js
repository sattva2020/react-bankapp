import "./index.css";

import React, { useState } from 'react';
import BackButton from "../../component/back-button";
import { useAuth } from '../../component/AuthContextProvider';
import { deleteSession, saveSession } from "../../script/session";

import { useNavigate } from 'react-router-dom';

import Field from '../../component/Field';
import Header from '../../component/Header';
import Button from "../../component/Button";

const SettingsPage = () => {

	const navigate = useNavigate();

	const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');	

  const [oldPassword, setOldPassword] = useState('');	
  const [newPassword, setNewPassword] = useState('');

	const { dispatch } = useAuth();

	const [alert, setAlert] = useState({
    type: 'disabled',
    message: '',
  });	

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
		try { 
			const session = window.session
			
			// console.log(session, 'path:front/container/settingsPage.32') 
			const res = await fetch('http://localhost:4000/settings/email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				
				body: JSON.stringify({ password, newEmail, session}),
			});

			const data = await res.json();			

			// console.log(data, 'path:front/container/SettingsPage.44') 

			if (res.ok) {				
				saveSession(data.newSession)

				setAlert({
					type: 'success',
					message: data.message,
				});				

				navigate(data.redirectUrl);
			} else {
				console.log('error', data.message, 'path:front/container/SettingsPage.50');
			}
		} catch (error) {
			console.log('error', error.message, 'path:front/container/SettingsPage.53');
		}
    
  };



  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    try {
			const email = window.session.user.email
			const res = await fetch('http://localhost:4000/settings/password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ oldPassword, newPassword, email }),
			});

			const data = await res.json();

			if (res.ok) {

				saveSession(data.newSession)

				console.log(data)

				setAlert({
					type: 'success',
					message: data.message,
				});				

				navigate(data.redirectUrl);
			} else {
				console.log('error', data.message, 'path:front/container/SettingsPage.138');
			}
		} catch (error) {
			alert('error', error.message, 'path:front/container/SettingsPage.97');
		}

		
  };

	const logout = () => {
		deleteSession();
		dispatch({type: 'LOGOUT'});
		window.transactionHistory = null;
		
	 	// window.location.assign('/');

		navigate('/')
	}



  return (
    <div className='settings__page--body'>

			<header className="settings__header">
				<BackButton/>
				<Header	text='Settings'/>
				<div style={{width: '24px'}}></div>
			</header>


			<form  onSubmit={handleSubmitEmail} className="settings__change">
				<span className="settings__change--name ">Change email</span>
							

				<Field
					gray
					text = "Email:"
					type = "email"
					placeholder="example@gmail.com"
					value={newEmail}
					onChange={(e) => setNewEmail(e.target.value)}
				/>

				<Field
					gray
					text = 'Password:'
					type = 'password'
					placeholder="********"
					value={password}
					onChange={(e) => setPassword(e.target.value)}	
				/>

				<Button
					type="submit"
					text='Save Email'
					purple
				/>				
			</form>		

			<form onSubmit={handleSubmitPassword} className="settings__change">
				<span className="settings__change--name ">Change email</span> 
				
				<Field
					gray
					text = 'Old Password::'
					type = 'password'
					placeholder="********"
					value={oldPassword}
					onChange={(e) => setOldPassword(e.target.value)}
				/>
			
				<Field
					gray
					text = 'New Password:'
					type = 'password'
					placeholder="********"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
				/>

				<Button
					type="submit"
					text='Save Password'
					purple
				/>					
				
			</form>

			<Button
				text='Logout'
				onClick={logout}
				red
			/>      
      
    </div>
  );
};

export default SettingsPage;
















