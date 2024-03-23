import "./index.css";

const Button = ({ text, onClick, type, purple, red }) => {

	const inputClassName = 
		`btn btn--text
			${purple ? ' btn__outline btn__purple btn__outline--text btn__text--purple' : ''}
			${red ? ' btn__outline btn__red btn__outline--text btn__text--red' : ''}
		`
	;


  return (
    <div>
      <button
			 	type={type || 'button'} 
				className={inputClassName}
			 	onClick={onClick}
			>
        {text}
      </button>
    </div>
  );
};

export default Button;
