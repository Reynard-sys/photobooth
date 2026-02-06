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
          { x: 0, y: 885, width: 1320, height: 743 },
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
      Frame5: {
        width: 1200,
        height: 2800,
        photos: [
          { x: -10, y: 107, width: 1200, height: 675, rotation: -0.28 },
          { x: -10, y: 842, width: 1200, height: 675, rotation: -0.28 },
          { x: -10, y: 1576, width: 1200, height: 675, rotation: -0.28 },
        ],
      },
      Frame6: {
        width: 1200,
        height: 2800,
        photos: [
          { x: -10, y: 80, width: 1200, height: 676, rotation: -0.35 },
          { x: -10, y: 790, width: 1200, height: 676, rotation: -0.35 },
          { x: -10, y: 1500, width: 1200, height: 676, rotation: -0.35 },
        ],
      },
      Frame7: {
        width: 1200,
        height: 2800,
        photos: [
          { x: -10, y: 247, width: 1200, height: 675, rotation: -0.28 },
          { x: -10, y: 982, width: 1200, height: 675, rotation: -0.28 },
          { x: -10, y: 1717, width: 1200, height: 675, rotation: -0.28 },
        ],
      },
      Frame8: {
        width: 1200,
        height: 2800,
        photos: [
          { x: -10, y: 79, width: 1200, height: 676, rotation: -0.28 },
          { x: -10, y: 790, width: 1200, height: 676, rotation: -0.28 },
          { x: -10, y: 1500, width: 1200, height: 676, rotation: -0.28 },
        ],
      },
      Frame9: {
        width: 1200,
        height: 2800,
        photos: [
          { x: -10, y: 106, width: 1200, height: 676, rotation: -0.28 },
          { x: -10, y: 840, width: 1200, height: 676, rotation: -0.28 },
          { x: -10, y: 1575, width: 1200, height: 676, rotation: -0.28 },
        ],
      },
      Frame10: {
        width: 1200,
        height: 2800,
        photos: [
          { x: -10, y: 117, width: 1200, height: 676, rotation: -0.35 },
          { x: -10, y: 852, width: 1200, height: 676, rotation: -0.35 },
          { x: -10, y: 1587, width: 1200, height: 676, rotation: -0.35 },
        ],
      },
      Frame11: {
        width: 1200,
        height: 2800,
        photos: [
          { x: -75, y: 135, width: 1260, height: 711, rotation: 0.35 },
          { x: -75, y: 848, width: 1260, height: 711 },
          { x: -75, y: 1563, width: 1260, height: 711 },
        ],
      },
      Frame12: {
        width: 1200,
        height: 2800,
        photos: [
          { x: -10, y: 112, width: 1200, height: 675, rotation: -0.28 },
          { x: -10, y: 847, width: 1200, height: 675, rotation: -0.28 },
          { x: -10, y: 1581, width: 1200, height: 675, rotation: -0.28 },
        ],
      },
      Frame13: {
        width: 1200,
        height: 2800,
        photos: [
          { x: -10, y: 61, width: 1200, height: 675, rotation: -0.28 },
          { x: -10, y: 797, width: 1200, height: 675, rotation: -0.28 },
          { x: -10, y: 1531, width: 1200, height: 675, rotation: -0.28 },
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
