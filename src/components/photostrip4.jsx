import { forwardRef } from "react";

const PhotoStripComposite4 = forwardRef(
  ({ shots, template, isExporting = false, filterClass }, ref) => {
    const templateConfigs = {
      Frame1: {
        width: 1200,
        height: 3600,
        photos: [
          { x: -10, y: 103, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 838, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 1571, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 2308, width: 1205, height: 678, rotation: -0.28 },
        ],
      },
      Frame2: {
        width: 1200,
        height: 3600,
        photos: [
          { x: -10, y: 143, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 905, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 1671, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 2431, width: 1205, height: 678, rotation: -0.28 },
        ],
      },
      Frame3: {
        width: 1200,
        height: 3600,
        photos: [
          { x: -10, y: 182, width: 1320, height: 743 },
          { x: -10, y: 939, width: 1320, height: 743 },
          { x: -10, y: 1696, width: 1320, height: 743 },
          { x: -10, y: 2441, width: 1320, height: 743 },
        ],
      },
      Frame4: {
        width: 1200,
        height: 3600,
        photos: [
          { x: -10, y: 293, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 1027, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 1762, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 2496, width: 1205, height: 678, rotation: -0.28 },
        ],
      },
      Frame5: {
        width: 1200,
        height: 3600,
        photos: [
          { x: -10, y: 103, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 838, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 1572, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 2307, width: 1205, height: 678, rotation: -0.28 },
        ],
      },
      Frame6: {
        width: 1200,
        height: 3600,
        photos: [
          { x: -10, y: 110, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 845, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 1580, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 2315, width: 1205, height: 678, rotation: -0.28 },
        ],
      },
      Frame7: {
        width: 1200,
        height: 3600,
        photos: [
          { x: -10, y: 237, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 971, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 1706, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 2441, width: 1205, height: 678, rotation: -0.28 },
        ],
      },
      Frame8: {
        width: 1200,
        height: 3600,
        photos: [
          { x: -10, y: 110, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 845, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 1579, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 2315, width: 1205, height: 678, rotation: -0.28 },
        ],
      },
      Frame9: {
        width: 1200,
        height: 3600,
        photos: [
          { x: -10, y: 110, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 845, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 1579, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 2315, width: 1205, height: 678, rotation: -0.28 },
        ],
      },
      Frame10: {
        width: 1200,
        height: 3600,
        photos: [
          { x: -10, y: 103, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 838, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 1571, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 2308, width: 1205, height: 678, rotation: -0.28 },
        ],
      },
      Frame11: {
        width: 1200,
        height: 3600,
        photos: [
          { x: -130, y: 115, width: 1320, height: 743 },
          { x: -130, y: 839, width: 1320, height: 743 },
          { x: -130, y: 1592, width: 1320, height: 743 },
          { x: -130, y: 2335, width: 1320, height: 743 },
        ],
      },
      Frame12: {
        width: 1200,
        height: 3600,
        photos: [
          { x: -10, y: 107, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 839, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 1571, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 2304, width: 1205, height: 678, rotation: -0.28 },
        ],
      },
      Frame13: {
        width: 1200,
        height: 3600,
        photos: [
          { x: -10, y: 103, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 838, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 1571, width: 1205, height: 678, rotation: -0.28 },
          { x: -10, y: 2306, width: 1205, height: 678, rotation: -0.28 },
        ],
      },
      Frame14: {
        width: 1200,
        height: 3600,
        photos: [
          { x: 190, y: 265, width: 940, height: 529, rotation: 9 },
          { x: 120, y: 1280, width: 830, height: 467, rotation: -2 },
          { x: 300, y: 1990, width: 830, height: 467, rotation: -2 },
          { x: 80, y: 2770, width: 830, height: 467, rotation: -4 },
        ],
      },
    };

    const config = templateConfigs[template] || templateConfigs["Frame1"];

    return (
      <div
        ref={ref}
        className="relative"
        style={{
          width: `${config.width}px`,
          height: `${config.height}px`,
        }}
      >
        {/* Layer 1: Photos */}
        {shots.map((shot, index) => {
          if (!config.photos[index]) return null;
          const pos = config.photos[index];

          return (
            <div
              key={index}
              className="absolute"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: `${pos.width}px`,
                height: `${pos.height}px`,
                transform: pos.rotation ? `rotate(${pos.rotation}deg)` : "none",
                transformOrigin: "center center",
              }}
            >
              <img
                src={shot}
                alt={`Shot ${index + 1}`}
                className={`w-full h-full object-cover ${filterClass}`}
                crossOrigin="anonymous"
              />
            </div>
          );
        })}

        {/* Layer 2: Photo Strips */}
        <img
          src={`/strips/4photos/${template}.png`}
          alt="Photo strip template"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 10 }}
          crossOrigin="anonymous"
        />
      </div>
    );
  },
);

PhotoStripComposite4.displayName = "PhotoStripComposite4";
export default PhotoStripComposite4;
