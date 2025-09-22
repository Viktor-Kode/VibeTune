import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

const ReviewCarousel = () => {
  return (
    <section className="bg-gray-900 text-white py-16 px-6 md:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-sky-400">
          What Our Listeners Say
        </h2>

        <Splide
          options={{
            type: 'loop',
            perPage: 3,
            focus: 'center',
            gap: '1rem',
            breakpoints: {
              1024: { perPage: 2 },
              768: { perPage: 1 },
            },
          }}
          aria-label="Customer Reviews"
        >
          <SplideSlide>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <p className="text-lg italic">
                "VibeTune changed the way I discover music. The playlists are 🔥!"
              </p>
              <h4 className="mt-4 font-bold text-sky-400">— Amina, Lagos</h4>
            </div>
          </SplideSlide>

          <SplideSlide>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <p className="text-lg italic">
                "The UI is smooth, and the sound quality is top-notch. Love it!"
              </p>
              <h4 className="mt-4 font-bold text-sky-400">— Tunde, Abuja</h4>
            </div>
          </SplideSlide>

          <SplideSlide>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <p className="text-lg italic">
                "I found artists I never knew existed. VibeTune is a gem!"
              </p>
              <h4 className="mt-4 font-bold text-sky-400">— Chidera, Enugu</h4>
            </div>
          </SplideSlide>

          <SplideSlide>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <p className="text-lg italic">
                "VibeTune keeps me inspired every day. The vibe is unmatched."
              </p>
              <h4 className="mt-4 font-bold text-sky-400">— Bolu, Ibadan</h4>
            </div>
          </SplideSlide>
        </Splide>
      </div>
    </section>
  );
};

export default ReviewCarousel;