import React from "react";
import "./login.css"; // Import App.css
import Button from "react-bootstrap/Button";
import Logo from "../assets/cw-white.png";

// Function to generate an array of emails
const generateEmails = (num) => {
  const emails = [];
  for (let i = 0; i < num; i++) {
    emails.push(
      <img src={Logo} alt="Logo" className="email" style={{ "--i": i }} key={i} />
    );
  }
  return emails;
};

// Login component
const Login = ({ handleRedirect }) => {
  return (
    <>
      {/* Main login container */}
      <section>
        <div className="login-container">
          {generateEmails(100)} {/* Generate 5 TfiEmail components */}
          {/* Login form */}
          <div className="login-form">
            <span className="font-increase">Welcome</span>
            <span className="font">Let's get you signed in.</span>
            <div className="container">
              {/* Sign-in button */}

              <Button className="button1 btn-1" onClick={handleRedirect}>
                <svg>
                  <rect x="0" y="0" fill="none" width="100%" height="100%" />
                </svg>
                <span>Sign In with ConnectWise!</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
