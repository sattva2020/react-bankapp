import "./index.css";

export default function BackButton() {
  return (
    <div className="back-button" onClick={() => window.history.back()}>
      <img src="/svg/back-button.svg" alt="<" width="24" height="24" />
    </div>
  );
}
