import "./index.css";
import "../../style/authentication.css"

import React, { useState } from 'react';
import BackButton from "../../component/back-button";
import { REG_EXP_PASSWORD } from '../../script/form';
import { saveSession } from "../../script/session";
import Header from "../../component/Header";
import Button from "../../component/Button";
import Field from "../../component/Field";

import { useNavigate } from 'react-router-dom';

const RecoveryConfirmForm = () => {

	const navigate = useNavigate();

  const FIELD_NAME = {
    CODE: 'code',
    PASSWORD: 'password',
  };

  const FIELD_ERROR = {
    IS_EMPTY: 'Введіть значення в поле',
    IS_BIG: 'Дуже довге значення, приберіть зайве',
    PASSWORD: 'Пароль повинен складатися з не менше ніж 8 символів, включаючи хоча б одну цифру, малу та велику літеру',
  };

  const [formData, setFormData] = useState({
    [FIELD_NAME.CODE]: '',
    [FIELD_NAME.PASSWORD]: '',
  });

  const [formErrors, setFormErrors] = useState({
    [FIELD_NAME.CODE]: '',
    [FIELD_NAME.PASSWORD]: '',
  });

  const [alert, setAlert] = useState({
    type: 'disabled',
    message: '',
  });

  const validate = (name, value) => {
    if (String(value).length < 1) {
      return FIELD_ERROR.IS_EMPTY;
    }

    if (String(value).length > 20) {
      return FIELD_ERROR.IS_BIG;
    }

    if (name === FIELD_NAME.PASSWORD) {
      if (!REG_EXP_PASSWORD.test(String(value))) {
        return FIELD_ERROR.PASSWORD;
      }
    }

    return '';
  };

  const handleSubmit = async () => {
    const validateAll = () => {
      Object.keys(FIELD_NAME).forEach((name) => {
        const error = validate(name, formData[name]);
        if (error) {
          setFormErrors((prevFormErrors) => ({
            ...prevFormErrors,
            [name]: error,
          }));
        }
      });
    };

    validateAll();

    if (Object.values(formErrors).every((error) => error === '')) {
      setAlert({
        type: 'progress',
        message: 'Завантаження...',
      });

      try {
        const response = await fetch('http://localhost:4000/recovery-confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: Number(formData[FIELD_NAME.CODE]),
            password: formData[FIELD_NAME.PASSWORD],
          }),
        });

        const data = await response.json();

				console.log(data.session, 'data===')			

        if (response.ok) {
					saveSession(data.session);

          setAlert({
            type: 'success',
            message: data.message,
          });
          navigate(data.redirectUrl);
        } else {
          setAlert({
            type: 'error',
            message: data.message,
          });
        }
      } catch (error) {
        setAlert({
          type: 'error',
          message: error.message,
        });
      }
    }
  };

  return (
    <div className="authentication__page">

      <div className="authentication__header">
        <BackButton/>
				<Header
					text="Recover password"
					description="Write the code you received"
				/>       
      </div>

      <div className="authentication__body">       
         
				<Field
					text = "Code:"
					type = "number"
					placeholder = "Code"
					value={formData[FIELD_NAME.CODE]}
					onChange={(e) => setFormData({ ...formData, [FIELD_NAME.CODE]: e.target.value })}
				/>

				<span className="form__error">{formErrors[FIELD_NAME.CODE]}</span>

				
				<Field
					text = "New password:"
					type = "password"
					placeholder = "New password"
					value={formData[FIELD_NAME.PASSWORD]}
					onChange={(e) => setFormData({ ...formData, [FIELD_NAME.PASSWORD]: e.target.value })}
				/>				

				<span className="form__error">
					{formErrors[FIELD_NAME.PASSWORD]}
				</span>

				<Button
					text="Restore password"
					type="button"
					onClick={handleSubmit}
				/>

				<span className={`alert alert--${alert.type}`}>
					{alert.message}
				</span>
        
      </div>

		
    </div>
  );
};

export default RecoveryConfirmForm;
