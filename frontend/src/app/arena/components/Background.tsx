import React from "react";

interface BackgroundProps {
  viewportSize: { width: number; height: number };
  tileSize: number;
  lanterns: {
    x: number;
    y: number;
    color: string;
    size: number;
  }[];
  streetFoodItems: {
    x: number;
    y: number;
    emoji: string;
  }[];
}

const Background: React.FC<BackgroundProps> = ({
  viewportSize,
  tileSize,
  lanterns,
  streetFoodItems,
}) => {
  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundImage: "radial-gradient(circle, #1a365d 0%, #0f2447 100%)",
        backgroundRepeat: "repeat",
        imageRendering: "pixelated",
      }}
    >
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAFElEQVRYhe3BAQEAAACAkP6v7ggKAAAuZTBhFAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wMS0wOFQxOTozNzoxMCswMDowMDRxa5QAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDEtMDhUMTk6Mzc6MTArMDA6MDClLNMoAAAAAElFTkSuQmCC')",
          backgroundSize: `${tileSize}px ${tileSize}px`,
        }}
      />

      {/* Stars */}
      {Array.from({ length: 250 }).map((_, idx) => (
        <div
          key={`star-${idx}`}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            width:
              Math.random() < 0.3 ? "3px" : Math.random() < 0.6 ? "2px" : "1px",
            height:
              Math.random() < 0.3 ? "3px" : Math.random() < 0.6 ? "2px" : "1px",
            top: `${Math.random() * viewportSize.height}px`,
            left: `${Math.random() * viewportSize.width}px`,
            opacity: Math.random() * 0.7 + 0.3,
            animationDuration: `${Math.random() * 4 + 1.5}s`,
            zIndex: 3,
          }}
        />
      ))}

      {/* Shooting Stars */}
      {Array.from({ length: 5 }).map((_, idx) => {
        const startX = Math.random() * viewportSize.width;
        const startY = Math.random() * viewportSize.height * 0.5;
        const length = 50 + Math.random() * 100;
        const angle = 30 + Math.random() * 30;
        return (
          <div
            key={`shooting-star-${idx}`}
            className="absolute opacity-0"
            style={{
              top: `${startY}px`,
              left: `${startX}px`,
              width: `${length}px`,
              height: "1px",
              background:
                "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
              transform: `rotate(${angle}deg)`,
              animation: `shooting-star ${Math.random() * 10 + 15}s linear ${
                Math.random() * 10
              }s infinite`,
              zIndex: 2,
            }}
          />
        );
      })}

      {/* Lanterns */}
      {lanterns.map((lantern, idx) => (
        <div
          key={`lantern-${idx}`}
          className="absolute"
          style={{
            left: `${lantern.x}px`,
            top: `${lantern.y}px`,
            zIndex: 6,
            imageRendering: "pixelated",
            opacity: 0.25,
            transform: `scale(${lantern.size})`,
            pointerEvents: "none",
          }}
        >
          <div
            className={`w-14 h-20 flex items-center justify-center ${
              lantern.color === "red" ? "bg-red-600" : "bg-yellow-500"
            }`}
            style={{
              boxShadow: `0 0 5px ${
                lantern.color === "red"
                  ? "rgba(220, 38, 38, 0.15)"
                  : "rgba(234, 179, 8, 0.15)"
              }`,
              clipPath:
                "polygon(20% 0%, 80% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)",
              animation: "pulse 3s infinite",
            }}
          >
            <div
              className={`w-10 h-16 ${
                lantern.color === "red" ? "bg-red-500" : "bg-yellow-400"
              } flex items-center justify-center`}
            >
              <span className="text-white text-lg font-bold opacity-30">
                福
              </span>
            </div>
          </div>
          <div className="w-px h-6 bg-amber-900 mx-auto opacity-30"></div>
        </div>
      ))}

      {/* Street Food Items */}
      {streetFoodItems.map((item, idx) => (
        <div
          key={`food-${idx}`}
          className="absolute flex flex-col items-center"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            zIndex: 5,
            opacity: 0.7,
          }}
        >
          <span className="text-2xl">{item.emoji}</span>
        </div>
      ))}

      {/* Decorative Structure */}
      <div
        className="absolute"
        style={{
          bottom: "20px",
          right: "40px",
          width: "80px",
          height: "300px",
          background: "linear-gradient(180deg, transparent, #134e4a)",
          opacity: 0.2,
          zIndex: 1,
        }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-40 bg-teal-900"></div>
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-16 h-16 bg-teal-900"></div>
        <div className="absolute bottom-56 left-1/2 -translate-x-1/2 w-12 h-40 bg-teal-900"></div>
        <div className="absolute bottom-96 left-1/2 -translate-x-1/2 w-8 h-16 bg-teal-900"></div>
        <div className="absolute bottom-[112px] left-1/2 -translate-x-1/2 w-4 h-8 bg-teal-900"></div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes shooting-star {
          0% {
            opacity: 0;
            transform: translateX(0) translateY(0) rotate(30deg);
          }
          1% {
            opacity: 1;
          }
          5% {
            opacity: 1;
          }
          6% {
            opacity: 0;
          }
          100% {
            opacity: 0;
            transform: translateX(${Math.floor(Math.random() * 200) + 300}px)
              translateY(${Math.floor(Math.random() * 200) + 300}px)
              rotate(30deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Background;
