import { forwardRef } from "react";

/**
 * Unified PhotoStrip component for both 3-shot and 4-shot strips.
 * Selects the correct template config and strip image based on shots.length.
 */
const PhotoStrip = forwardRef(
  ({ shots, template, isExporting = false, filterClass }, ref) => {
    const is4 = shots.length === 4;

    const configs3 = {
      Frame1:  { width: 1200, height: 2800, photos: [{ x: 0,   y: 219,  width: 1205, height: 678, rotation: -0.1  }, { x: 0,   y: 982,  width: 1205, height: 678, rotation: -0.1  }, { x: 0,   y: 1743, width: 1205, height: 678, rotation: -0.1  }] },
      Frame2:  { width: 1200, height: 2800, photos: [{ x: 0,   y: 97,   width: 1322, height: 744, rotation: -2.1  }, { x: 0,   y: 880,  width: 1320, height: 743              }, { x: 0,   y: 1685, width: 1320, height: 743              }] },
      Frame3:  { width: 1200, height: 2800, photos: [{ x: 0,   y: 126,  width: 1320, height: 743              }, { x: 0,   y: 884,  width: 1320, height: 743              }, { x: 0,   y: 1640, width: 1320, height: 743              }] },
      Frame4:  { width: 1200, height: 2800, photos: [{ x: 0,   y: 290,  width: 1230, height: 692, rotation: -0.5  }, { x: 0,   y: 1032, width: 1230, height: 692, rotation: -0.5  }, { x: 0,   y: 1775, width: 1230, height: 692, rotation: -0.5  }] },
      Frame5:  { width: 1200, height: 2800, photos: [{ x: -10, y: 106,  width: 1205, height: 678, rotation: -0.28 }, { x: -10, y: 841,  width: 1205, height: 678, rotation: -0.28 }, { x: -10, y: 1576, width: 1205, height: 678, rotation: -0.28 }] },
      Frame6:  { width: 1200, height: 2800, photos: [{ x: -10, y: 79,   width: 1205, height: 678, rotation: -0.28 }, { x: -10, y: 789,  width: 1205, height: 678, rotation: -0.28 }, { x: -10, y: 1499, width: 1205, height: 678, rotation: -0.28 }] },
      Frame7:  { width: 1200, height: 2800, photos: [{ x: -10, y: 246,  width: 1205, height: 678, rotation: -0.28 }, { x: -10, y: 982,  width: 1205, height: 678, rotation: -0.28 }, { x: -10, y: 1717, width: 1205, height: 678, rotation: -0.28 }] },
      Frame8:  { width: 1200, height: 2800, photos: [{ x: -10, y: 79,   width: 1205, height: 678, rotation: -0.28 }, { x: -10, y: 790,  width: 1205, height: 678, rotation: -0.28 }, { x: -10, y: 1500, width: 1205, height: 678, rotation: -0.28 }] },
      Frame9:  { width: 1200, height: 2800, photos: [{ x: -10, y: 106,  width: 1205, height: 678, rotation: -0.28 }, { x: -10, y: 840,  width: 1205, height: 678, rotation: -0.28 }, { x: -10, y: 1575, width: 1205, height: 678, rotation: -0.28 }] },
      Frame10: { width: 1200, height: 2800, photos: [{ x: -10, y: 116,  width: 1205, height: 678, rotation: -0.35 }, { x: -10, y: 852,  width: 1205, height: 678, rotation: -0.35 }, { x: -10, y: 1586, width: 1205, height: 678, rotation: -0.35 }] },
      Frame11: { width: 1200, height: 2800, photos: [{ x: -75, y: 135,  width: 1260, height: 711, rotation:  0.35 }, { x: -75, y: 848,  width: 1260, height: 711              }, { x: -75, y: 1563, width: 1260, height: 711              }] },
      Frame12: { width: 1200, height: 2800, photos: [{ x: -10, y: 110,  width: 1205, height: 678, rotation: -0.28 }, { x: -10, y: 845,  width: 1205, height: 678, rotation: -0.28 }, { x: -10, y: 1580, width: 1205, height: 678, rotation: -0.28 }] },
      Frame13: { width: 1200, height: 2800, photos: [{ x: -10, y: 61,   width: 1205, height: 678, rotation: -0.28 }, { x: -10, y: 795,  width: 1205, height: 678, rotation: -0.28 }, { x: -10, y: 1530, width: 1205, height: 678, rotation: -0.28 }] },
      Frame14: { width: 1200, height: 2800, photos: [{ x: 155, y: 265,  width: 940,  height: 529, rotation:  9    }, { x: 75,  y: 1280, width: 830,  height: 467, rotation: -2    }, { x: 290, y: 1990, width: 830,  height: 467, rotation: -2    }] },
    };

    const configs4 = {
      Frame1:  { width: 1200, height: 3600, photos: [{ x: -10,  y: 103,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 838,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 1571, width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 2308, width: 1205, height: 678, rotation: -0.28 }] },
      Frame2:  { width: 1200, height: 3600, photos: [{ x: -10,  y: 143,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 905,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 1671, width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 2431, width: 1205, height: 678, rotation: -0.28 }] },
      Frame3:  { width: 1200, height: 3600, photos: [{ x: -10,  y: 182,  width: 1320, height: 743              }, { x: -10,  y: 939,  width: 1320, height: 743              }, { x: -10,  y: 1696, width: 1320, height: 743              }, { x: -10,  y: 2441, width: 1320, height: 743              }] },
      Frame4:  { width: 1200, height: 3600, photos: [{ x: -10,  y: 293,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 1027, width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 1762, width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 2496, width: 1205, height: 678, rotation: -0.28 }] },
      Frame5:  { width: 1200, height: 3600, photos: [{ x: -10,  y: 103,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 838,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 1572, width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 2307, width: 1205, height: 678, rotation: -0.28 }] },
      Frame6:  { width: 1200, height: 3600, photos: [{ x: -10,  y: 110,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 845,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 1580, width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 2315, width: 1205, height: 678, rotation: -0.28 }] },
      Frame7:  { width: 1200, height: 3600, photos: [{ x: -10,  y: 237,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 971,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 1706, width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 2441, width: 1205, height: 678, rotation: -0.28 }] },
      Frame8:  { width: 1200, height: 3600, photos: [{ x: -10,  y: 110,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 845,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 1579, width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 2315, width: 1205, height: 678, rotation: -0.28 }] },
      Frame9:  { width: 1200, height: 3600, photos: [{ x: -10,  y: 110,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 845,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 1579, width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 2315, width: 1205, height: 678, rotation: -0.28 }] },
      Frame10: { width: 1200, height: 3600, photos: [{ x: -10,  y: 103,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 838,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 1571, width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 2308, width: 1205, height: 678, rotation: -0.28 }] },
      Frame11: { width: 1200, height: 3600, photos: [{ x: -130, y: 115,  width: 1320, height: 743              }, { x: -130, y: 839,  width: 1320, height: 743              }, { x: -130, y: 1592, width: 1320, height: 743              }, { x: -130, y: 2335, width: 1320, height: 743              }] },
      Frame12: { width: 1200, height: 3600, photos: [{ x: -10,  y: 107,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 839,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 1571, width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 2304, width: 1205, height: 678, rotation: -0.28 }] },
      Frame13: { width: 1200, height: 3600, photos: [{ x: -10,  y: 103,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 838,  width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 1571, width: 1205, height: 678, rotation: -0.28 }, { x: -10,  y: 2306, width: 1205, height: 678, rotation: -0.28 }] },
      Frame14: { width: 1200, height: 3600, photos: [{ x: 190,  y: 265,  width: 940,  height: 529, rotation:  9    }, { x: 120,  y: 1280, width: 830,  height: 467, rotation: -2    }, { x: 300,  y: 1990, width: 830,  height: 467, rotation: -2    }, { x: 80,   y: 2770, width: 830,  height: 467, rotation: -4    }] },
    };

    const configs = is4 ? configs4 : configs3;
    const config  = configs[template] || configs["Frame1"];
    const stripSrc = `/strips/${is4 ? "4photos" : "3photos"}/${template}.webp`;

    return (
      <div
        ref={ref}
        className="relative"
        style={{ width: `${config.width}px`, height: `${config.height}px` }}
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
                left:            `${pos.x}px`,
                top:             `${pos.y}px`,
                width:           `${pos.width}px`,
                height:          `${pos.height}px`,
                transform:       pos.rotation ? `rotate(${pos.rotation}deg)` : "none",
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

        {/* Layer 2: Strip template overlay (WebP) */}
        <img
          src={stripSrc}
          alt="Photo strip template"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 10 }}
          crossOrigin="anonymous"
        />
      </div>
    );
  },
);

PhotoStrip.displayName = "PhotoStrip";
export default PhotoStrip;
