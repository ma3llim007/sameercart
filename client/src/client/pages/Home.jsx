import React from "react";
import slider1 from "../assets/sliders/slider1.webp";
import slider2 from "../assets/sliders/slider2.webp";
import Smart_Electronics from "../assets/category/smart_electronics.webp";
import audioAndVideo from "../assets/category/audio_video.webp";
import vidoeGamer from "../assets/category/video_games.webp";
import portalAudioAndVideo from "../assets/category/portable_audio_video.webp";
import cameraAndPhoto from "../assets/category/camera_photo.webp";
import {
    Categories,
    Container,
    HomeBanner,
    HomeBlog,
    IconSection,
    InfoCardSection,
    ProductsSection,
    Slider,
} from "../components";

const Home = () => {
    const sliderData = [
        {
            id: 1,
            imageUrl: slider1,
            short_title: "Wireless Bluetooth Gaming",
            title: "Bluetooth Gamepad",
            achor_link: "/",
            achor_title: "Show Now",
        },
        {
            id: 2,
            imageUrl: slider2,
            short_title: "New Design Features",
            title: "Hamsung Galaxy",
            achor_link: "/contact-us",
            achor_title: "Contact Us",
        },
    ];
    const popularCategories = [
        {
            id: 1,
            title: "Smart Electronics",
            imageUrl: Smart_Electronics,
            category: [
                {
                    name: "Wearable Devices",
                    link: "wearable-devices",
                },
                {
                    name: "Smart Home Appliances",
                    link: "smart-home-appliances",
                },
                {
                    name: "Smart Remote Controls",
                    link: "smart-remote-controls",
                },
                {
                    name: "Smart Watches",
                    link: "smart-watches",
                },
            ],
        },
        {
            id: 2,
            title: "Audio & Vidoe",
            imageUrl: audioAndVideo,
            category: [
                {
                    name: "Televisions",
                    link: "televisions",
                },
                {
                    name: "TV Receives",
                    link: "tv-receives",
                },
                {
                    name: "Projectors",
                    link: "projectors",
                },
                {
                    name: "TV Sticks",
                    link: "tv-sticks",
                },
            ],
        },
        {
            id: 3,
            title: "Video Games",
            imageUrl: vidoeGamer,
            category: [
                {
                    name: "Handheld Game Players",
                    link: "handheld-game-players",
                },
                {
                    name: "Game Controllers",
                    link: "game-controllers",
                },
                {
                    name: "Joysticks",
                    link: "joysticks",
                },
                {
                    name: "Stickers",
                    link: "stickers",
                },
            ],
        },
        {
            id: 4,
            title: "Portable Audio & Video",
            imageUrl: portalAudioAndVideo,
            category: [
                {
                    name: "Headphones",
                    link: "headphones",
                },
                {
                    name: "Speakers",
                    link: "speakers",
                },
                {
                    name: "MP3 Players",
                    link: "mp3_Players",
                },
                {
                    name: "Microphones",
                    link: "microphones",
                },
            ],
        },
        {
            id: 5,
            title: "Camera & Photo",
            imageUrl: cameraAndPhoto,
            category: [
                {
                    name: "Digital Cameras",
                    link: "digital-cameras",
                },
                {
                    name: "Camcorders",
                    link: "camcorders",
                },
                {
                    name: "Camera Drones",
                    link: "camera-drones",
                },
                {
                    name: "Action Cameras",
                    link: "action-cameras",
                },
            ],
        },
    ];

    return (
        <>
            <Slider sliderData={sliderData} />
            <Container>
                <IconSection />
                <InfoCardSection />
                <Categories categories={popularCategories} />
                <ProductsSection />
                <HomeBanner />
                <ProductsSection title="Audio & Video" />
                <ProductsSection title="Camera & Photo" />
                <HomeBlog />
            </Container>
        </>
    );
};

export default Home;
