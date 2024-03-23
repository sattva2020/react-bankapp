import "./index.css";

// ReceivePage.js
import BackButton from '../../component/back-button';
import Header from '../../component/Header';
import Field from "../../component/Field";
import { useNavigate } from "react-router-dom";

import React, { useState } from 'react';

const ReceivePage = () => {
	
	const navigate = useNavigate();
  
  const [amountReceive, setAmountReceive] = useState('');
	

  const handleAmountChange = (e) => {
    setAmountReceive(e.target.value);
  };
	
  const handlePayment  = async(paymentSystem) => {
		
    try {			
			const session = window.session
		
			const res = await fetch('http://localhost:4000/balance', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ session, amountReceive, paymentSystem, type: 'Receive' }),
			});

			const data = await res.json()		

			// console.log(data, '=============++++++++++++++++++++++')


			if(res.ok) {
				window.location.assign(data.redirectUrl)
				// navigate('/balance')
				
			} else {
        console.error('Failed to receive amount:', data.message, 'path: front/component/receive.41');
			}
			
			
			
		} catch(err) {
			console.log(err)
		}
  };

  return (
    <div className='receive__page--body'>

			<header className="receive__header">
				<BackButton/>
				<Header	text='Receive'/>
				<div style={{width: '24px'}}></div>
			</header>
      
      <form className="receive__change">

			<Field
					text = 'Receive amount'
					type = 'number'
					placeholder="Sum"
					value={amountReceive}
					onChange={handleAmountChange}
				/>        

        <div className="receive__buttons">
					<span className="receive__text--mini">Payment system</span>
					
					<button 
						type="submit" 
						onClick={() => handlePayment('stripe')}
						className="receive__button"
					>						
						<img src='./svg/stripe.svg' alt='Stripe'/>
						<div className="receive__text--mini receive__color">Stripe</div>						
						<img src='./svg/stripe2.svg' alt='Stripe'/>						
					</button>
	
					<button 
						type="submit" 
						onClick={() => handlePayment('coinbase')} 
						className="receive__button"
					>						
						<img src='./svg/coinbase.svg' alt='Coinbase'/>
						<div className="receive__text--mini receive__color">Coinbase</div>						
						<img src='./svg/coinbase2.svg' alt='Coinbase'/>
						
					</button>
				</div>				
				
			</form>
    </div>
  );
};

export default ReceivePage;
