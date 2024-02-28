import React, { useState } from 'react';
import axios from 'axios';
import ProfileImg from '../../assets/Offer/as.png';
import './Home.css';
import AllProduct from '../Product/ProductAll';
import Book1 from "../../assets/books/novel4.jpg";
import Book2 from "../../assets/books/novel3.jpg";
import Book3 from "../../assets/books/novel2.jpg";
import Vector from "../../assets/website/blue-pattern.png";

const ImageList = [
  {
    id: 1,
    img: Book1,
    title: "เกิดชาตินี้พี่ต้องเทพ 16",
    description: "lorem His Life will forever be Changed dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    id: 2,
    img: Book2,
    title: "โศกนาฏกรรมต่างโลกเริ่มต้นจากเดธมาร์ช เล่ม 7",
    description: "Who's there lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    id: 3,
    img: Book3,
    title: "โศกนาฏกรรมต่างโลกเริ่มต้นจากเดธมาร์ช เล่ม 12",
    description: "Lost Boy, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
];

const UserHome = () => {
  const [imageId, setImageId] = useState(Book1);
  const [title, setTitle] = useState("เกิดชาตินี้พี่ต้องเทพ 16");
  const [description, setDescription] = useState("lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");

  const handleOrderPopup = () => {
    // Your logic for handling order popup
  };

  const bgImage = {
    backgroundImage: `url(${Vector})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100%",
  };

  return (
    <>
      <div className="min-h-[550px] sm:min-h-[750px] bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200" style={bgImage}>
        <div className="container pb-8 sm:pb-0">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div data-aos-once="true" className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1">
              <h1 data-aos="zoom-out" data-aos-duration="500" data-aos-once="true" className="text-5xl sm:text-6xl lg:text-7xl font-bold">
                {title}
                <p className="bg-clip-text text-transparent bg-gradient-to-b from-primary text-right text-sm to-secondary">by Anonymous</p>{" "}
              </h1>
              <p data-aos="slide-up" data-aos-duration="500" data-aos-delay="100" className="text-sm ">{description}</p>
              <div>
                <button onClick={handleOrderPopup} className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full">Order Now</button>
              </div>
            </div>
            <div className="min-h-[450px] sm:min-h-[450px] flex justify-center items-center relative order-1 sm:order-2 ">
              <div className="h-[300px] sm:h-[550px] overflow-hidden flex justify-center items-center">
                <img data-aos="zoom-in" data-aos-once="true" src={imageId} alt="biryani img" className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-125 object-contain mx-auto" />
              </div>
              <div className="flex lg:flex-col lg:top-1/2 lg:-translate-y-1/2 lg:py-2 justify-center gap-4 absolute -bottom-[40px] lg:-right-1 bg-white rounded-full">
                {ImageList.map((item) => (
                  <img key={item.id} data-aos="zoom-in" data-aos-once="true" src={item.img} onClick={() => { setImageId(item.id === 1 ? Book1 : item.id === 2 ? Book2 : Book3); setTitle(item.title); setDescription(item.description); }} alt="biryani img" className="max-w-[100px] h-[100px] object-contain inline-block hover:scale-110 duration-200" />
                ))}
              </div>
            </div>
          </div>
        </div>
        
      </div><br />
      <AllProduct/>
    </>
  );
};

export default UserHome;
