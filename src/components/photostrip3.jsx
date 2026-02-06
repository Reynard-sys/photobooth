import { forwardRef } from "react";

const PhotoStripComposite = forwardRef(
  ({ shots, template, isExporting = false, filterClass }, ref) => {
    const templateConfigs = {
      Frame1: {
        width: 1200,
        height: 2800,
        photos: [
          { x: 0, y: 219, width: 1205, height: 678, rotation: -0.1 },
          { x: 0, y: 982, width: 1205, height: 678, rotation: -0.1 },
          { x: 0, y: 1743, width: 1205, height: 678, rotation: -0.1 },
        ],
      },
      Frame2: {
        width: 1200,
        height: 2800,
        photos: [
          { x: 0, y: 97, width: 1322, height: 744, rotation: -2.1 },
          { x: 0, y: 880, width: 1320, height: 743 },
          { x: 0, y: 1685, width: 1320, height: 743 },
        ],
      },
      Frame3: {
        width: 1200,
        height: 2800,
        photos: [
          { x: 0, y: 126, width: 1320, height: 743 },
          { x: 0, y: 880, width: 1320, height: 743 },
          { x: 0, y: 1640, width: 1320, height: 743 },
        ],
      },
      Frame4: {
        width: 1200,
        height: 2800,
        photos: [
          { x: 0, y: 290, width: 1230, height: 692, rotation: -0.5 },
          { x: 0, y: 1032, width: 1230, height: 692, rotation: -0.5 },
          { x: 0, y: 1775, width: 1230, height: 692, rotation: -0.5 },
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

        {/* Layer 2: PNG Template */}
        <img
          src={`/strips/3photos/${template}.png`}
          alt="Photo strip template"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 10 }}
          crossOrigin="anonymous"
        />
      </div>
    );
  },
);

PhotoStripComposite.displayName = "PhotoStripComposite";
export default PhotoStripComposite;
