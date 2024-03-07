// ThankYou.js

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './ThankYou.css'; // Import CSS file for styling

const ThankYou = () => {
  return (
    <div className="thank-you-container">
      <h1>ขอบคุณที่ใช้บริการ!</h1>
      <p>การชำระเงินเสร็จสมบูรณ์แล้ว</p>
      <p>ขอบคุณที่เลือกซื้อสินค้ากับเรา</p><br /><br />
      <img src="src\assets\website\C.png" alt="Thank You Image" />
      {/* แทนที่ "/path/to/thankyou-image.jpg" ด้วยที่อยู่ของรูปภาพที่คุณต้องการใช้ */}
<br /><br />
      <Link to="/" className="home-link">กลับสู่หน้าหลัก</Link>
    </div>
  );
};

export default ThankYou;
