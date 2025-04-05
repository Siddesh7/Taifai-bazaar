import React from "react";

interface StallProps {
  stall: {
    id: number;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    bgColor: string;
    borderColor: string;
    roofColor: string;
    roofAltColor: string;
    accentColor: string;
    darkColor: string;
    counterColor: string;
    area: string;
    icon: string;
    description: string;
    decorations?: string[];
    isExpansion?: boolean;
  };
  activeTile: number | null;
}

const Stall: React.FC<StallProps> = ({ stall, activeTile }) => {
  return (
    <div
      className={`absolute ${stall.bgColor} ${stall.borderColor} border ${
        stall.isExpansion ? "border-dashed border-2" : "border-opacity-60"
      } rounded-sm shadow-xl overflow-hidden ${
        activeTile === stall.id ? "ring-2 ring-yellow-300 ring-opacity-50" : ""
      }`}
      style={{
        left: `${stall.x}px`,
        top: `${stall.y}px`,
        width: `${stall.width}px`,
        height: `${stall.height}px`,
        zIndex: 20,
        backgroundImage: stall.isExpansion
          ? "repeating-linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
        boxShadow: stall.isExpansion
          ? "0 0 15px rgba(72, 187, 120, 0.5)"
          : "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        className={`relative h-14 ${stall.roofColor} flex items-center justify-center overflow-hidden border-b border-opacity-20 border-black`}
      >
        <div
          className="absolute inset-x-0 top-0 h-4"
          style={{
            background: `linear-gradient(to bottom, ${stall.roofColor.replace(
              "bg-",
              "#"
            )}, transparent)`,
            boxShadow: "inset 0 -1px 3px rgba(0,0,0,0.2)",
            borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
          }}
        ></div>
        <div className="absolute inset-x-0 top-1 flex justify-around">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div key={`light-${stall.id}-${idx}`} className="relative">
              <div
                className={`w-1.5 h-1.5 ${
                  idx % 2 === 0 ? "bg-yellow-300" : "bg-red-400"
                } rounded-full animate-pulse`}
                style={{ animationDuration: `${1 + Math.random()}s` }}
              ></div>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 top-0 flex justify-around">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={`tassel-${stall.id}-${idx}`} className="relative">
              <div className="w-px h-5 bg-red-600 mx-auto"></div>
              <div className="w-3 h-3 bg-red-600 rounded-full -mt-1"></div>
            </div>
          ))}
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <span
            className={`text-white text-xs font-medium tracking-wide px-3 ${
              stall.isExpansion ? "animate-pulse" : ""
            }`}
            style={{
              textShadow: stall.isExpansion
                ? "0 0 5px rgba(72, 187, 120, 0.8)"
                : "0 0 5px rgba(255,255,255,0.5)",
            }}
          >
            {stall.name}
          </span>
          {stall.decorations?.includes("steam") && (
            <div className="absolute -top-2 -right-16 w-8 h-8 opacity-70">
              <div
                className="w-2 h-2 bg-white rounded-full absolute animate-float"
                style={{
                  left: "40%",
                  top: "40%",
                  animationDuration: "3s",
                }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-white rounded-full absolute animate-float"
                style={{
                  left: "60%",
                  top: "30%",
                  animationDuration: "2.5s",
                }}
              ></div>
              <div
                className="w-1 h-1 bg-white rounded-full absolute animate-float"
                style={{
                  left: "30%",
                  top: "50%",
                  animationDuration: "4s",
                }}
              ></div>
            </div>
          )}
        </div>
        {stall.area === "left" && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-amber-700 rounded-full"></div>
          </div>
        )}
        {stall.area === "center" && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="w-5 h-3 bg-red-600"></div>
            <div className="w-3 h-5 bg-red-600 -mt-1 ml-1"></div>
          </div>
        )}
        {stall.area === "right" && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-amber-300 rotate-45"></div>
          </div>
        )}
        {stall.area === "expansion" && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-emerald-300 border-dashed rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center h-[calc(100%-56px)] relative p-2">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {(stall.area === "left" || stall.isExpansion) && (
            <div className="w-full h-full">
              <div className="absolute w-full h-px bg-white/20 top-1/4"></div>
              <div className="absolute w-full h-px bg-white/20 top-2/4"></div>
              <div className="absolute w-full h-px bg-white/20 top-3/4"></div>
              <div className="absolute h-full w-px bg-white/20 left-1/4"></div>
              <div className="absolute h-full w-px bg-white/20 left-2/4"></div>
              <div className="absolute h-full w-px bg-white/20 left-3/4"></div>
            </div>
          )}
          {stall.area === "center" && (
            <div
              className="w-full h-full bg-repeat"
              style={{
                backgroundImage:
                  'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="5" fill="none" stroke="%23000" stroke-width="1"/></svg>\')',
                backgroundSize: "20px 20px",
              }}
            ></div>
          )}
          {stall.area === "right" && (
            <div
              className="w-full h-full bg-repeat"
              style={{
                backgroundImage:
                  'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><path d="M0 0 L30 0 L30 30 L0 30 Z M0 15 L30 15 M15 0 L15 30" fill="none" stroke="%23000" stroke-width="1"/></svg>\')',
                backgroundSize: "30px 30px",
              }}
            ></div>
          )}
        </div>
        {stall.decorations?.includes("blueprint") && (
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="smallGrid"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 8 0 L 0 0 0 8"
                    fill="none"
                    stroke="#0de"
                    strokeWidth="0.5"
                    opacity="0.5"
                  />
                </pattern>
                <pattern
                  id="grid"
                  width="80"
                  height="80"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="80" height="80" fill="url(#smallGrid)" />
                  <path
                    d="M 80 0 L 0 0 0 80"
                    fill="none"
                    stroke="#0de"
                    strokeWidth="1"
                    opacity="0.8"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle
                cx="50%"
                cy="50%"
                r="25"
                stroke="#0de"
                fill="none"
                strokeDasharray="5,5"
              />
              <circle
                cx="50%"
                cy="50%"
                r="40"
                stroke="#0de"
                fill="none"
                strokeDasharray="3,3"
              />
              <line
                x1="10%"
                y1="10%"
                x2="90%"
                y2="90%"
                stroke="#0de"
                strokeDasharray="5,5"
              />
              <line
                x1="90%"
                y1="10%"
                x2="10%"
                y2="90%"
                stroke="#0de"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        )}
        {stall.decorations?.includes("lantern") && (
          <div className="absolute -top-1 left-2">
            <div className="w-5 h-7 rounded-full bg-red-600 flex items-center justify-center">
              <div className="w-3 h-5 rounded-full bg-red-500 flex items-center justify-center text-[6px] text-yellow-300 font-bold">
                福
              </div>
            </div>
            <div className="w-px h-1.5 bg-amber-900 mx-auto"></div>
          </div>
        )}
        {stall.decorations?.includes("coins") && (
          <div className="absolute top-1 left-2 flex">
            <div className="w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center -mr-1">
              <div className="w-1.5 h-1.5 bg-amber-700 rounded-full"></div>
            </div>
            <div className="w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-amber-700 rounded-full"></div>
            </div>
          </div>
        )}
        {stall.decorations?.includes("maps") && (
          <div className="absolute top-2 left-2 w-10 h-14 bg-amber-100 rotate-3">
            <div className="w-full h-full border border-amber-800 p-0.5">
              <div className="w-full h-full grid grid-cols-3 grid-rows-4 gap-0.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={`map-${i}`}
                    className={`bg-${
                      ["red", "blue", "green", "amber", "teal"][i % 5]
                    }-${300 + (i % 3) * 100} h-full w-full`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
        {stall.decorations?.includes("fortune") && (
          <div className="absolute top-2 left-3 w-7 h-9 bg-orange-100 rotate-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`fortune-${i}`}
                className="w-full h-px bg-orange-800 my-1.5"
              ></div>
            ))}
          </div>
        )}
        {stall.decorations?.includes("baskets") && (
          <div className="absolute top-3 left-3 w-10 h-6 rounded-b-full border-b-2 border-l-2 border-r-2 border-amber-700">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={`basket-${i}`}
                className="absolute top-0 h-6 w-0.5 bg-amber-700"
                style={{ left: `${i * 1.5 + 1}px` }}
              ></div>
            ))}
          </div>
        )}
        {stall.decorations?.includes("bubbles") && (
          <div className="absolute top-1 left-3 w-10 h-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`bubble-${i}`}
                className="absolute w-2 h-2 rounded-full bg-opacity-60 bg-purple-300 animate-float-slow"
                style={{
                  left: `${Math.random() * 8}px`,
                  top: `${Math.random() * 8}px`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              ></div>
            ))}
          </div>
        )}
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
          <div
            className={`text-4xl ${
              activeTile === stall.id || stall.isExpansion
                ? "animate-pulse"
                : ""
            }`}
            style={{
              filter: stall.isExpansion
                ? "drop-shadow(0 0 8px rgba(72, 187, 120, 0.8))"
                : "drop-shadow(0 2px 3px rgba(0,0,0,0.3))",
              color: stall.isExpansion ? "#48bb78" : "inherit",
            }}
          >
            {stall.icon}
          </div>
          {(activeTile === stall.id || stall.isExpansion) && (
            <div className="mt-1 max-w-full text-center">
              <span
                className={`text-[10px] text-white/90 font-light px-2 py-0.5 ${
                  stall.isExpansion ? "bg-emerald-900/60" : "bg-black/40"
                } rounded-sm backdrop-blur-sm`}
              >
                {stall.description}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-4 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: stall.isExpansion
              ? "repeating-linear-gradient(90deg, #1f4538, #1f4538 10px, #2a5747 10px, #2a5747 20px)"
              : "repeating-linear-gradient(90deg, #2a1506, #2a1506 10px, #46230c 10px, #46230c 20px)",
          }}
        ></div>
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
      {activeTile === stall.id && (
        <div className="absolute bottom-6 left-0 w-full flex justify-center items-center z-30">
          <div
            className={`backdrop-blur-sm text-white/90 px-3 py-1 rounded-full text-xs animate-pulse shadow-lg border border-white/10 ${
              stall.isExpansion ? "bg-emerald-800/70" : "bg-black/70"
            }`}
          >
            Press Space to interact
          </div>
        </div>
      )}
    </div>
  );
};

export default Stall;
