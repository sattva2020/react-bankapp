import "./index.css";



import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, saveSession } from '../../script/session';

const PrivateRoute = ({ element }) => {
  // const token = localStorage.getItem('sessionAuth'); 

	const navigate = useNavigate();

	useEffect ( () => {
		const checkToken = async () => {
			// const token = getSession().token === true ? getSession().token : null;
			const token = (window.session.token === true || getSession().token === true) ? getSession().token : null
			if (!token ) {
					// navigate('/'); // Перенаправлення на головну сторінку, можливо, змініть шлях відповідно до ваших потреб
				return null; // або інша логіка для відображення сторінки з помилкою або логіном
			} else {
				navigate('/balance')
				saveSession()
			}
		};
		
		checkToken();
  }, [navigate]);
  

  // Якщо токен існує, повертайте переданий елемент Route
  return element;
};

export default PrivateRoute;

