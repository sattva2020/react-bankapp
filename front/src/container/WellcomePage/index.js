import "./index.css";

import { React, useEffect } from 'react';
import { Link  } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {

	const navigate = useNavigate()
	
	useEffect(() => {
    document.addEventListener("DOMContentLoaded", () => {
			const token = window.session.token
			const confirm = window.session.user.isConfirm;
			
      if (token) {  
        if (confirm === true) {
					navigate('/balance')
        } else {
					navigate('/signup-confirm')
        }
      } else {
				navigate('/')
      }
    });
  }, []);

  return (
    <div className="welcome__page">

				<div className="welcome__top">
					<div className="welcome__text">
						<div></div>
						<div>
							<h2 className="welcome__title">Hello!</h2>
							<p className="welcome__description">Welcome to bank app</p>
						</div>
						<div></div>
					</div>

					<div className="image__welcome">
						<img src="/png/money.png" alt="money" className="image__welcom--money" />
					</div>
				</div>

				<div className="welcome__bottom">
					<div className="welcome__button--block">
						<Link to="/signup" className="welcome__button welcome__button--up">Sign Up</Link>
						<Link to="/signin" className="welcome__button welcome__button--in">Sign In</Link>
					</div>
				</div>
    </div>
		
  );
};

export default WelcomePage;