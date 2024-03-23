import "./index.css";

// NotificationList.js
import React, {useState, useEffect} from 'react';
import BackButton from "../../component/back-button";
import Header from '../../component/Header';

const NotificationList = () => {
	const [list, setList] = useState([]);


	const notificationData = async () => {
    try {
			const user = window.session.user.email;
			// console.log(user, 'user-=-=-=-=')

      const res = await fetch('http://localhost:4000/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({user}),
      });

			const data = await res.json()

			console.log(data.list, 'notificationPage.data.list-=-=-=-=')

			if(res.ok) {

				const newList = data.list;
        setList(newList);
        window.newList = newList;
			} else {
				console.log('Error balance operation')
			}      


    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

	function timeAgo(timestamp) {
		const currentTimestamp = new Date();
		const eventTimestamp = new Date(timestamp);
		const difference = currentTimestamp - eventTimestamp;
		const seconds = Math.floor(difference / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
	
		if (days > 0) {
			return `${days} day${days > 1 ? 's' : ''} ago`;
		} else if (hours > 0) {
			return `${hours} hour${hours > 1 ? 's' : ''} ago`;
		} else if (minutes > 0) {
			return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
		} else {
			return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
		}
	}
	

	useEffect(() => {
    notificationData();
  }, []); 

	if(list.length > 0) {
		return (
			<div className="notification__page">
								
				<header className="notification__header ">
					<BackButton/>						
					<div onClick={notificationData}>
						<Header	text='Notifications'	/>
					</div>
					<div style={{width: '24px'}}></div>
				</header>	
				
				<div className="notification__content" >
				{list.sort((a, b) => new Date(b.time) - new Date(a.time))
				.map((notification) => (
					<div key={notification.id} className="notification__content--unit">
						<img 
							alt="img" 
							className="notification__image"
							src={notification.type === 'login' ? "/svg/bell.svg" : "/svg/warning.svg"}
						/>
						<div className="unit__content">
							<div className="unit__content--message">{notification.message}</div>
							<div className="unit__content--mini">
								<div>{timeAgo(notification.time)}</div>
								<img src="/svg/point.svg" alt="point"/>
								<div>{notification.type}</div>
							</div>
						</div>
					</div>
				))}
			</div>	
		</div>
		);
	} else {
		return (
			<div className="notification__page">
				<div className="notification__top">
					<header className="notification__header ">
						<BackButton/>
						<h3 onClick={notificationData}>Notifications</h3>
						<div></div>
					</header>
				</div>
				<div className="notification__content notification__content--unit" style={{fontFamily:"jost", alignItems:"center"}}>
					There are no notifications
				</div>
			</div>
		)
	}

  
};

export default NotificationList;


