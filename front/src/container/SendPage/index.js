import "./index.css";

// SendPage.js
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

import BackButton from "../../component/back-button";
import Field from "../../component/Field";
import Button from "../../component/Button"
import Header from '../../component/Header'


const SendPage = () => {

	const [email, setEmail] = useState('');
	const [amountSend, setAmountSend] = useState('');

	const navigate = useNavigate()


	const handleUsernameChange = (e) => {
    setEmail(e.target.value);
  };

	const handleAmountChange = (e) => {
    setAmountSend(e.target.value);
  };


	const handleSubmit = async() => {
    try {
			const session = window.session
			const res = await fetch('http://localhost:4000/balance', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ amountSend, session, type: 'Send', email }),
			});

			const data = await res.json()
			


			if(res.ok) {
				navigate(data.redirectUrl)
			} else {
        console.error('Failed to receive amount:', data.message, 'path: front/component/receive.41');
			}
			
		} catch(err) {
			console.log(err)
		}
  };

  return (
    <div className='send__page'>			
            
			<header className="send__header">
				<BackButton />					
				<Header	text='Send'	/>
				<div style={{width: '24px'}}></div>
			</header>      

		  <form onSubmit={handleSubmit} className='send__block'>  
				<Field
					text = 'Email'
					type = 'email'
					placeholder="Email"
					value={email}
					onChange={handleUsernameChange}		
				/>

				<Field
					text = 'Sum'
					type = 'number'
					placeholder="Sum"
					value={amountSend}
					onChange={handleAmountChange}
				/>         

				<Button
					text = 'Send'
					type="submit"
				/> 	
      </form>
    </div>
  );
};

export default SendPage;
