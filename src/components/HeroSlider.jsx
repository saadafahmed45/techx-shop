"use client";
import React, { useState, useEffect } from 'react';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
const slides = [
  {
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1320&h=750&fit=crop",
    title: "Nike Air Max 2026",
    description:
      "Experience next-level comfort with the all-new Nike Air Max. Designed for everyday performance and bold street style.",
    badge: "Best Seller of the Year"
  },
  {
    image: "https://images.pexels.com/photos/8147404/pexels-photo-8147404.jpeg",
    title: "Urban Street Collection",
    description:
      "Step into modern street fashion with premium sneakers crafted for comfort, durability, and confidence.",
    badge: "New Arrival"
  },
  {
    image: "https://images.pexels.com/photos/1127000/pexels-photo-1127000.jpeg",
    title: "Minimal Classic Series",
    description:
      "Clean design meets everyday comfort. The perfect pair for casual outfits and all-day wear.",
    badge: "Limited Edition"
  },
  {
    image: "https://images.pexels.com/photos/2146723/pexels-photo-2146723.jpeg",
    title: "Performance Sport Pro",
    description:
      "Engineered for speed and flexibility. Elevate your performance with lightweight support and dynamic cushioning.",
    badge: "Top Rated"
  }
];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div className="">
      <div className="mx-auto ">
        {/* Hero Content Container - Slider */}
        <div className="relative flex flex-col gap-4 sm:gap-6">
          {/* Main Product Image with Overlay and Badge */}
          <div className="relative w-full">
            <div className="relative   h-87.5 md:h-screen  overflow-hidden w-full">
              <div className="w-full pt-[56.25%] sm:pt-[56.25%] lg:pt-[56.25%] relative bg-gray-100">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-87.5 md:h-screen object-cover transition-opacity duration-500"
                />
              </div>
              {/* Vertical Badge */}
              <div className="absolute left-2 sm:left-4 lg:left-8 top-4 sm:top-8 bg-black text-white text-xs font-bold px-2 py-2 rounded-r-lg" style={{writingMode: 'vertical-rl', letterSpacing: '0.05em'}}>
                {slide.badge}
              </div>
              {/* Overlay Info */}
              <div className="absolute left-0 bottom-0 w-full p-3 sm:p-4 lg:p-6 bg-linear-to-t from-black/80 via-black/40 to-transparent ">
                <h2 className="text-lg sm:text-2xl lg:text-4xl font-extrabold mb-1 sm:mb-2 text-white">{slide.title}</h2>
                <p className="text-xs sm:text-sm lg:text-base text-white mb-2 sm:mb-4 line-clamp-1 sm:line-clamp-2">{slide.description}</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition">SHOP NOW</button>
              </div>
              
              {/* Previous Button */}
              <button 
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 sm:p-3 rounded-full transition z-10"
                aria-label="Previous slide"
              >
                &#10094;
              </button>
              
              {/* Next Button */}
              <button 
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 sm:p-3 rounded-full transition z-10"
                aria-label="Next slide"
              >
                &#10095;
              </button>

              {/* Thumbnails (Desktop) */}
              <div className="hidden lg:flex flex-col gap-4 absolute right-6 bottom-6">
                {slides.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`rounded-2xl border-2 overflow-hidden w-32 h-20 transition ${idx === currentSlide ? 'border-blue-500' : 'border-white opacity-60'}`}
                  >
                    <img
                      src={s.image}
                      alt={`Slide ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Slide Indicators */}
        <div className="flex lg:hidden gap-2 sm:gap-3 mt-4 sm:mt-6 justify-center">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`rounded-full transition ${idx === currentSlide ? 'bg-blue-600 w-8 h-2' : 'bg-gray-300 w-2 h-2'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;