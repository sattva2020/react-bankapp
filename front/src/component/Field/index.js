import './index.css'


import React, { useState } from 'react';

const Field = ({ type, value, onChange, text, placeholder, gray }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'email' ? 'email' : type === 'number' ? 'number' : (type === 'password' && showPassword) ? 'text' : 'password';

  const inputClassName = `field__layout ${gray ? ' field__gray' : ''}`;

  return (    
		<label className="field">

			<p className="field__text">
				{text && <span>{text}</span>}
			</p>

			<input
				className={inputClassName}
				type={inputType}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				required
			/>

			{type === 'password' && (
				<span
					onClick={togglePasswordVisibility}
					className={`field__icon button__${showPassword ? 'show' : 'hide'}`}
					role="button"
				/>
			)}

		</label>    
  );
};

export default Field;
