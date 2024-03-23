import "./index.css";

// BalanceTopUpForm.js
import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';

const BalancePage  = () => {
	const navigate = useNavigate()

	const [balance, setBalance] = useState(0); // Приклад початкового балансу
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    try {
			const session = window.session;
			// console.log(session, 'session-=-=-=-=')

      // Отримуємо баланс
      const res = await fetch('http://localhost:4000/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({session, type:'balance'}),
      });

			const data = await res.json()

			// console.log(data.transactionHistory, 'data-=-=-=-=')

			if(res.ok) {
				const newBalance = data.currentBalance;
				setBalance(newBalance);

				const transactionHistory = data.transactionHistory
				setTransactions(transactionHistory)

				window.transactionHistory = transactionHistory

				
			} else {
				console.log('Error balance operation')
			}      


    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []); 

  return (
    <div className="balance__page">
			<div className="balance__top">
	
				<header className="balance__bord">
	
					<div className="balance__bord--href">
						<a
							href="http://localhost:3000/settings"
							className="balanse__href"
						>
							<img src="./svg/settings.svg" alt="settings"/>
						</a>	
	
						<h3 className="balance__title">Main wallet</h3>
	
						<a
							href="http://localhost:3000/notifications"
							className="balanse__href"
						>
							<img src="./svg/notification.svg" alt="notification"/>
						</a>
					</div>
	
					
					<h1 onClick={fetchData} className="balance__description">
						<p>$</p> 
						<span >{balance}</span>
						<p className="balance__description--thin"></p>
					</h1>
				</header>
	
				<div className="balance__operation">
					<div className="operation__receive">
						<a
							href="http://localhost:3000/receive"
							className="receive__href operation"
						>
							<img src="./svg/recieve.svg" alt="receive" className="operation--img"/>
						</a>
					</div>
	
					<div className="operation__send">
						<a
							href="http://localhost:3000/send"
							className="send__href operation"
						>
							<img src="./svg/send.svg" alt="send" className="operation--img"/>
						</a>
					</div>
				</div>

			</div>
		
			

			<div className="balance__content"  onClick={fetchData}>
				{transactions.sort((a, b) => new Date(b.time) - new Date(a.time))
				.map((transactionHistory) => (
					<div 
						key={transactionHistory.id}
						className="balance__item" 
						onClick={() => navigate(`/transaction/${transactionHistory.id}`)}
					>

						<div className="balance__person">
							
							{ 
								<img 
									alt="type"
									src={
										transactionHistory.paymentSystem === 'coinbase'
											? "/svg/coinbase.svg"
											: transactionHistory.paymentSystem === 'stripe'
											? "/svg/stripe.svg"
											: "/svg/amount.svg"
									}
								/>
							}
						</div>

						<div className="balance__value">
							<div className="balance__info">
								<h3 className="balance__nameOperation">
									{transactionHistory.paymentSystem ? transactionHistory.paymentSystem : transactionHistory.email}
								</h3>
								<div className="balance__infoOperation">									
									<div className="balance__time-type">
										{new Date(transactionHistory.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
									</div>

									<div className="balance__point"></div>
									<p className="balance__time-type">{transactionHistory.type}</p>
								</div>
							</div>
							<div 
								className="balance__valueOperation" 
								style={{ color: transactionHistory.type === 'Send' ? '#1D1D1F' : '#24B277' }}
							>	
							{transactionHistory.type === 'Send' ? '-' : '+'}
							{transactionHistory.amount}
							</div>
						</div>

					</div>
				))}

			</div>

		</div>
  );
};

export default BalancePage ;
