import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer_main">
      <div className="footer-columns">
        <div className="footer-logo">
          <img
            src="src\assets\Logo_WHITE.png"
            alt="Great Minds Logo"
            className="footer-logo-img"
          />
          {/* <h3>Great Minds</h3> */}
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text.
          </p>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div className="footer-subscribe">
          <h4>Subscribe to our newsletter</h4>
          <p>
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <div className="subscribe-input">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright 2024 © Great Minds. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
