import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./partners.css";

export const Partners = (props) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    const partnerImages = [
        "1.webp", "2.webp", "3.webp", "4.webp", "5.webp",
        "6.webp", "7.webp", "8.webp", "9.webp", "10.webp",
        "11.webp", "12.webp", "13.webp"
    ];

    return (
        <div id="partners" className="partners-container">
            <div className="container">
                <div className="partners-title">
                    <h2>Our Partners</h2>
                </div>
                <Slider {...settings}>
                    {partnerImages.map((img, index) => (
                        <div key={index} className="partner-logo-wrapper">
                            <div className="partner-logo-card">
                                <img
                                    src={`/img/patners/${img}`}
                                    alt={`Partner ${index + 1}`}
                                    style={{ display: 'block', maxWidth: '80%', height: 'auto' }}
                                />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};
