import './index.css';
import "../../style/authentication.css"


// SignUpConfirmPage.js
import React, { useState } from 'react';
import { useAuth } from '../../component/AuthContextProvider';
import BackButton from '../../component/back-button';
import Field from '../../component/Field';
import Header from '../../component/Header'
import Button from "../../component/Button";
import { useNavigate } from 'react-router-dom';
import { getTokenSession, saveSession } from '../../script/session';

const SignUpConfirmPage = () => {
  const { dispatch } = useAuth();
  const [code, setcode] = useState('');
  const navigate = useNavigate();

  const handleConfirm = async (e) => {
    e.preventDefault();		
		const token = getTokenSession(); 

    try {
      const response = await fetch(`http://localhost:4000/signup-confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, token }),
      });

			

      if (response.ok) {
				const signupConfirmData = await response.json();
				
				// console.log(signupConfirmData, 'path: front/component/SignUpConfirmPage')

        dispatch({ type: 'LOGIN', payload: {
						token: signupConfirmData.session.token,
						user: signupConfirmData.session.user,
						isConfirm: signupConfirmData.session.user.isConfirm 
				} });
				saveSession(signupConfirmData.session)				
				navigate('/balance');

			
      } else {
				const errorData = await response.json();
        console.error('Не вдалося підтвердити реєстрацію', errorData);
      }
    } catch (error) {
      console.error('Помилка під час підтвердження реєстрації:', error);
    }
  };

  return (
    <div className='authentication__page'>		
			
			<div className="authentication__header">
				<BackButton />
				<Header
					text='Confirm account'
					description="Write the code you received"
				/>
			</div>			
     
      <form onSubmit={handleConfirm} className="authentication__body">
       
				<Field
					text = 'Code:'
					type = 'number'
					placeholder="Code"
					value={code}
					onChange={(e) => setcode(e.target.value)}	
				/>

				<Button
					text="Confirm"
					type="submit"
				/>				
      </form>
    </div>
  );
};

export default SignUpConfirmPage;


