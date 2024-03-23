// import "./index.css";

// const Header = ({ text, description }) => {
	
//   return (
//     <header className="header">
// 			<h1 className="text">{text}</h1>
// 			<p className="description">{description}</p>
// 		</header>
//   );
// };

// export default Header;


import "./index.css";

const Button = ({ text, description }) => {
  const isSingleText = text && !description;

  return (
    <header className={`header${isSingleText ? ' header--single-text' : ''}`}>
      <h1 className="text">{text}</h1>
      {description && <p className="description">{description}</p>}
    </header>
  );
};

export default Button;
