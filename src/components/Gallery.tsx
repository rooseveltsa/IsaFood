
export const Gallery = () => {
  const images = [
    {
      src: "/lovable-uploads/c7d79ba7-0651-4f37-871a-75518cae282a.png",
      alt: "Variedade de marmitas fitness coloridas",
    },
    {
      src: "/lovable-uploads/05bba46f-c193-44e6-82ff-f50d65654f3b.png",
      alt: "Marmitas com proteinas e vegetais frescos",
    },
    {
      src: "/lovable-uploads/35dc68eb-8039-44f1-9507-c07bb60b5d1f.png",
      alt: "Marmitas gourmet variadas",
    },
    {
      src: "/lovable-uploads/cedfe62d-d73e-4643-b7df-40cb8750105b.png",
      alt: "Producao de marmitas em escala",
    },
  ];

  return (
    <section className="py-4 bg-white overflow-hidden">
      <div className="flex gap-4 animate-[scroll_20s_linear_infinite] hover:[animation-play-state:paused]">
        {/* Duplicate for seamless loop */}
        {[...images, ...images, ...images].map((img, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-64 md:w-80 h-48 md:h-56 rounded-2xl overflow-hidden"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-320px * 4 - 16px * 4)); }
        }
        @media (min-width: 768px) {
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-336px * 4 - 16px * 4)); }
          }
        }
      `}</style>
    </section>
  );
};
