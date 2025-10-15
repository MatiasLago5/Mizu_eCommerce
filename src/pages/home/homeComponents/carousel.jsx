import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './carousel.css';

function Carousel() {
  const slides = [
    {
      id: 1,
      title: 'Ahora tambien productos capiares!',
      subtitle: 'Descubre las últimas tendencias',
      image: 'https://videos.openai.com/vg-assets/assets%2Ftask_01k7jx76dwfeevr1ec8nb4e7ts%2F1760497553_img_0.webp?se=2025-10-21T03%3A10%3A17Z&sp=r&sv=2024-08-04&sr=b&skoid=cfbc986b-d2bc-4088-8b71-4f962129715b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-10-15T01%3A43%3A31Z&ske=2025-10-22T01%3A48%3A31Z&sks=b&skv=2024-08-04&sig=YMB5cUJvD8JyRRA/wIG4SJORZVjPcZIecREOYInk/Bs%3D&az=oaivgprodscus',
      cta: 'Ver colección'
    },
    {
      id: 2,
      title: 'Ofertas Especiales',
      subtitle: 'Hasta 50% de descuento',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
      cta: 'Comprar ahora'
    },
    {
      id: 3,
      title: 'Refigios que hemos ayudado',
      subtitle: 'Tus compras hacen esto posible',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200',
      cta: 'Explorar'
    }
  ];

  return (
    <div className="carousel">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="carousel-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="slide-content">
              <img 
                src={slide.image} 
                alt={slide.title}
                className="slide-image"
              />
              <div className="slide-overlay">
                <div className="slide-text">
                  <h2 className="slide-title">{slide.title}</h2>
                  <p className="slide-subtitle">{slide.subtitle}</p>
                  <button className="slide-cta">{slide.cta}</button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Carousel;