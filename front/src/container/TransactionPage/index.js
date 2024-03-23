import './index.css'

// TransactionPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../../component/back-button';



const TransactionPage = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
			const session = window.session
      try {

				const res = await fetch(`http://localhost:4000/transaction/${transactionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({session, transactionId}),
      });

       
        const data = await res.json();

        if (res.ok) {
          setTransaction(data.transaction);
        } else {
          console.error('Error fetching transaction:', data.message);
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  if (!transaction) {
    return <div style={{padding: '40px'}}>Loading...</div>;
  }

  return (
    <div className='transaction__page--body'>

      <header className="transaction__header">
				<BackButton/>
				<h2>Transaction</h2>
				<div></div>
			</header>

      <div className='transaction__change'>
       
        <div 
					className='transaction__amount' 
					style={{ color: transaction.type === 'Send' ? '#1D1D1F' : '#24B277' }}
				>
					<p>{transaction.type === 'Send' ? '-' : '+'}</p>
					<p>$</p>
					<p>{transaction.amount}</p>
				</div>

				<div className='transaction__block ' >
					<div  className='transaction__block--sub '>
						<span>Date: </span>
						<span>{new Date(transaction.time).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
					</div>	

					<div className='divider'/>		
					
					<div className={"transaction__block--sub " + (transaction.type === 'Receive' ? 'none' : '')}>
						<span>Address:</span>
						<span> {transaction.email}</span>
						
					</div>

					<div className={"divider" + (transaction.type === 'Receive' ? ` none` : '')} />

					<div  className='transaction__block--sub'>
						<span className='transaction__text'>Type:</span> 
						<span>{transaction.type}</span>
					</div>
				</div>
      </div>
    </div>
  );
};

export default TransactionPage;
