import "./index.css";
import "../../style/authentication.css"

// RecoveryPage.js
import BackButton from "../../component/back-button";
import { Component } from 'react';
import Field from "../../component/Field";
import Header from '../../component/Header'
import Button from "../../component/Button";


class RecoveryPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      disabled: false,
    };
  }

  handleChange = (e) => {
    this.setState({ email: e.target.value });
  };
	

  handleSubmit = async (e) => {
    e.preventDefault();

	

    const { email, disabled } = this.state;

    const validateAll = (FIELD_NAME) => {
      Object.values(FIELD_NAME).forEach((name) => {
        const error = this.validate(name, this.value[name]);

        if (error) {
          this.setError(name, error);
        }
      });
    };

    if (disabled === true) {
      validateAll(this.FIELD_NAME);
    } else {
      this.setAlert('progress', 'Завантаження...');

      try {
        const res = await fetch('http://localhost:4000/recovery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: this.convertData(),
        });

        const data = await res.json();

        if (res.ok) {
          this.setAlert('success', data.message);
          window.location.assign('http://localhost:3000/recovery-confirm');
        } else {
          this.setAlert('error', data.message);
        }
      } catch (error) {
        this.setAlert('error', error.message);
      }
    }

    console.log('Recovery email submitted:', email);
  };

  setAlert(type, message) {
		this.setState({ error: message }); 

    console.log(`${type}: ${message}`);
  }

	
	convertData() {    
    return JSON.stringify({ email: this.state.email });
  }

  render() {
		const { email, error } = this.state;


    return (
			<div className="authentication__page">
        <div className="authentication__header">
          <BackButton />

					<Header
						text='Recover password'
						description='Choose a recovery method'
					/>
         
        </div>

        
        <form onSubmit={this.handleSubmit}  className="authentication__body">
				
					<Field
						text = 'Email:'
						type = 'email'
						placeholder="Email"
						value={email}
						onChange={this.handleChange}		
					/>
			

					<Button
						text="Send code"
						type="submit"
						disabled={this.state.disabled}
					/>

					<span className="error-message">
						{error}
					</span>
					
        </form>
      </div>
    );
  }
}

export default RecoveryPage;





