import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  interpolate,
  spring,
} from "remotion";

export interface VideoProps {
  propertyType: string;
  operation: string;
  address: string;
  cityState: string;
  priceBob: string;
  priceUsd: string;
  bedrooms: string;
  bathrooms: string;
  builtArea: string;
  plotArea: string;
  parking: string;
  amenities: string[];
  shortDescription: string;
  coverImage: string | null;
  extraImages: string[];
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  agentPhoto?: string | null;
  musicUrl?: string;
  title?: string;
}

// Scene 1: Introduction (Cover Image + Cover Title + Badge)
const SceneIntro: React.FC<{ props: VideoProps; duration: number }> = ({ props, duration }) => {
  const frame = useCurrentFrame();
  
  // Custom pan: zoom in and subtle pan up
  const scale = interpolate(frame, [0, duration], [1.05, 1.25], { extrapolateRight: "clamp" });
  const translateY = interpolate(frame, [0, duration], [0, -40], { extrapolateRight: "clamp" });
  
  // Text slide in from bottom
  const textOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textTranslateY = interpolate(frame, [15, 35], [80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const badgeScale = spring({
    frame: frame - 10,
    fps: 30,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0F1115" }}>
      {/* Background Image with Ken Burns */}
      {props.coverImage ? (
        <img
          src={props.coverImage}
          alt="Property Cover"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translateY(${translateY}px)`,
          }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", backgroundColor: "#1C1F26" }} />
      )}

      {/* Dark overlay for beautiful readability */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to top, rgba(10, 11, 14, 0.95) 0%, rgba(10, 11, 14, 0.4) 50%, rgba(10, 11, 14, 0.7) 100%)",
        }}
      />

      {/* Header Branding */}
      <div style={{ position: "absolute", top: 100, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 50, color: "#FFFFFF", fontWeight: "300" }}>
            Lista<strong style={{ fontStyle: "normal", color: "#C5A059", fontWeight: "700" }}>Pro</strong>
          </span>
          <div style={{ height: 4, width: 90, backgroundColor: "#C5A059", marginTop: 8 }} />
        </div>
        <span style={{ fontSize: 24, fontWeight: "bold", letterSpacing: "2px", color: "#C5A059", fontFamily: "sans-serif" }}>
          COCHABAMBA
        </span>
      </div>

      {/* Main Content Info */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 80,
          right: 80,
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
          fontFamily: "sans-serif",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-block",
            backgroundColor: "#C5A059",
            color: "#0A0B0E",
            fontWeight: "bold",
            padding: "16px 36px",
            borderRadius: 12,
            fontSize: 28,
            letterSpacing: "2px",
            marginBottom: 35,
            boxShadow: "0 10px 25px rgba(197, 160, 89, 0.3)",
            transform: `scale(${badgeScale})`,
          }}
        >
          {props.operation === "Venta" ? "EN VENTA" : "EN ALQUILER"}
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 68,
            fontWeight: "800",
            color: "#FFFFFF",
            lineHeight: 1.15,
            letterSpacing: "-1px",
            marginBottom: 20,
            textShadow: "0 4px 15px rgba(0,0,0,0.5)",
          }}
        >
          {props.title || `Prístino ${props.propertyType}`}
        </h1>

        {/* Location bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 15, color: "#D1D5DB", fontSize: 32 }}>
          <span>📍</span>
          <span>{props.address}, {props.cityState}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Prices Highlight (Image 1 + Gigantic prices BOB & USD)
const ScenePrice: React.FC<{ props: VideoProps; duration: number }> = ({ props, duration }) => {
  const frame = useCurrentFrame();
  const imageToUse = props.extraImages[0] || props.coverImage;
  
  // Custom pan: zoom in and slow pan down
  const scale = interpolate(frame, [0, duration], [1.02, 1.20], { extrapolateRight: "clamp" });
  const translateY = interpolate(frame, [0, duration], [-30, 10], { extrapolateRight: "clamp" });

  const slideIn1 = interpolate(frame, [10, 25], [-100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const slideIn2 = interpolate(frame, [20, 35], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity1 = interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: "clamp" });
  const opacity2 = interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0F1115" }}>
      {imageToUse ? (
        <img
          src={imageToUse}
          alt="Property Visual"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translateY(${translateY}px)`,
          }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", backgroundColor: "#15171C" }} />
      )}

      {/* Heavy bottom half gradient */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to top, rgba(10, 11, 14, 0.98) 0%, rgba(10, 11, 14, 0.6) 60%, rgba(10, 11, 14, 0.1) 100%)",
        }}
      />

      {/* Top Floating Mini Header */}
      <div style={{ position: "absolute", top: 100, left: 80 }}>
        <span style={{ fontSize: 24, fontWeight: "bold", letterSpacing: "3px", color: "#C5A059", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
          INVERSIÓN INTELIGENTE
        </span>
      </div>

      {/* Main Prices Overlay */}
      <div style={{ position: "absolute", bottom: 220, left: 80, right: 80, fontFamily: "sans-serif" }}>
        <p style={{ color: "#C5A059", fontSize: 28, fontWeight: "bold", marginBottom: 15, letterSpacing: "1px" }}>
          PRECIO REVELACIÓN LISTAPRO
        </p>

        {/* Price 1 USD */}
        <div style={{ transform: `translateX(${slideIn1}px)`, opacity: opacity1, marginBottom: 25 }}>
          <span style={{ color: "#94A3B8", fontSize: 28, display: "block" }}>DÓLARES AMERICANOS</span>
          <span style={{ color: "#FFFFFF", fontSize: 78, fontWeight: "900", letterSpacing: "-1px" }}>
            $us {Number(props.priceUsd).toLocaleString("es-BO")}
          </span>
        </div>

        {/* Price 2 BOB */}
        <div style={{ transform: `translateX(${slideIn2}px)`, opacity: opacity2 }}>
          <span style={{ color: "#94A3B8", fontSize: 28, display: "block" }}>MONEDA NACIONAL (BOB)</span>
          <span style={{ color: "#C5A059", fontSize: 56, fontWeight: "800" }}>
            Bs {Number(props.priceBob).toLocaleString("es-BO")}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Layout & Specifications (Image 2 + Bento-style quick info card)
const SceneSpecs: React.FC<{ props: VideoProps; duration: number }> = ({ props, duration }) => {
  const frame = useCurrentFrame();
  const imageToUse = props.extraImages[1] || props.coverImage;
  
  // Custom pan: zoom in and slow pan left
  const scale = interpolate(frame, [0, duration], [1.05, 1.25], { extrapolateRight: "clamp" });
  const translateX = interpolate(frame, [0, duration], [-20, 20], { extrapolateRight: "clamp" });

  const cardY = interpolate(frame, [15, 35], [150, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const isTerreno = props.propertyType === "Terreno";

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0F1115" }}>
      {imageToUse ? (
        <img
          src={imageToUse}
          alt="Property Specifications"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translateX(${translateX}px)`,
          }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", backgroundColor: "#1A1D24" }} />
      )}

      {/* Dark gradient */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to top, rgba(10, 11, 14, 0.98) 0%, rgba(10, 11, 14, 0.5) 50%, rgba(10, 11, 14, 0.1) 100%)",
        }}
      />

      <div style={{ position: "absolute", top: 100, left: 80 }}>
        <span style={{ fontSize: 24, fontWeight: "bold", letterSpacing: "3px", color: "#C5A059" }}>
          DISEÑO Y COMODIDAD
        </span>
      </div>

      {/* Spec Container */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 80,
          right: 80,
          transform: `translateY(${cardY}px)`,
          opacity: cardOpacity,
          fontFamily: "sans-serif",
        }}
      >
        <h3 style={{ color: "#FFFFFF", fontSize: 44, fontWeight: "bold", marginBottom: 40 }}>
          Detalles de la Distribución
        </h3>

        {/* Specs Bento-Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
          {/* Bed Box */}
          <div style={{ backgroundColor: "rgba(10, 11, 14, 0.85)", border: "1px solid rgba(197, 160, 89, 0.25)", padding: 30, borderRadius: 20 }}>
            <span style={{ fontSize: 42, display: "block", marginBottom: 10 }}>🛏️</span>
            <span style={{ color: "#94A3B8", fontSize: 22, display: "block" }}>HABITACIONES</span>
            <span style={{ color: "#FFFFFF", fontSize: 36, fontWeight: "bold" }}>
              {isTerreno ? "N/A" : `${props.bedrooms} Dorms.`}
            </span>
          </div>

          {/* Bath Box */}
          <div style={{ backgroundColor: "rgba(10, 11, 14, 0.85)", border: "1px solid rgba(197, 160, 89, 0.25)", padding: 30, borderRadius: 20 }}>
            <span style={{ fontSize: 42, display: "block", marginBottom: 10 }}>🚿</span>
            <span style={{ color: "#94A3B8", fontSize: 22, display: "block" }}>BAÑOS</span>
            <span style={{ color: "#FFFFFF", fontSize: 36, fontWeight: "bold" }}>
              {isTerreno ? "N/A" : `${props.bathrooms} Baños`}
            </span>
          </div>

          {/* Area Box */}
          <div style={{ backgroundColor: "rgba(10, 11, 14, 0.85)", border: "1px solid rgba(197, 160, 89, 0.25)", padding: 30, borderRadius: 20 }}>
            <span style={{ fontSize: 42, display: "block", marginBottom: 10 }}>📐</span>
            <span style={{ color: "#94A3B8", fontSize: 20, display: "block" }}>SUPERFICIE</span>
            <span style={{ color: "#FFFFFF", fontSize: 34, fontWeight: "bold" }}>
              {isTerreno ? `${props.plotArea} m²` : `${props.builtArea || props.plotArea} m²`}
            </span>
          </div>

          {/* Parking Box */}
          <div style={{ backgroundColor: "rgba(10, 11, 14, 0.85)", border: "1px solid rgba(197, 160, 89, 0.25)", padding: 30, borderRadius: 20 }}>
            <span style={{ fontSize: 42, display: "block", marginBottom: 10 }}>🚗</span>
            <span style={{ color: "#94A3B8", fontSize: 22, display: "block" }}>ESTACIONAMIENTO</span>
            <span style={{ color: "#FFFFFF", fontSize: 36, fontWeight: "bold" }}>
              {isTerreno ? "N/A" : `${props.parking || '0'} Plazas`}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Amenities / Highlights (Image 3 + beautiful bullet row list)
const SceneAmenities: React.FC<{ props: VideoProps; duration: number }> = ({ props, duration }) => {
  const frame = useCurrentFrame();
  const imageToUse = props.extraImages[2] || props.coverImage;
  
  // Custom pan: zoom in and pan right
  const scale = interpolate(frame, [0, duration], [1.05, 1.25], { extrapolateRight: "clamp" });
  const translateX = interpolate(frame, [0, duration], [20, -20], { extrapolateRight: "clamp" });

  const animY = interpolate(frame, [15, 35], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Get up to 3 major amenities
  const displayedAmenities = props.amenities && props.amenities.length > 0 
    ? props.amenities.slice(0, 3) 
    : ["Excelente Ubicación", "Plusvalía Garantizada", "Acabados de Lujo"];

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0F1115" }}>
      {imageToUse ? (
        <img
          src={imageToUse}
          alt="Property Amenities"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translateX(${translateX}px)`,
          }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", backgroundColor: "#181A22" }} />
      )}

      <AbsoluteFill
        style={{
          background: "linear-gradient(to top, rgba(10, 11, 14, 0.98) 0%, rgba(10, 11, 14, 0.5) 50%, rgba(10, 11, 14, 0.1) 100%)",
        }}
      />

      <div style={{ position: "absolute", top: 100, left: 80 }}>
        <span style={{ fontSize: 24, fontWeight: "bold", letterSpacing: "3px", color: "#C5A059" }}>
          AMENIDADES CLAVE
        </span>
      </div>

      {/* Bullet container */}
      <div
        style={{
          position: "absolute",
          bottom: 240,
          left: 80,
          right: 80,
          transform: `translateY(${animY}px)`,
          opacity: op,
          fontFamily: "sans-serif",
        }}
      >
        <span style={{ color: "#C5A059", fontSize: 26, fontWeight: "bold", display: "block", marginBottom: 15 }}>
          CONFORTE EXCLUSIVO
        </span>
        <h2 style={{ fontSize: 52, color: "#FFFFFF", fontWeight: "800", marginBottom: 40, lineHeight: 1.2 }}>
          Estilo de Vida Único
        </h2>

        {/* Bullet row styles */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {displayedAmenities.map((item, idx) => {
            const rowSpring = spring({
              frame: frame - (20 + idx * 8),
              fps: 30,
              config: { damping: 14 },
            });
            const rowX = interpolate(rowSpring, [0, 1], [-50, 0]);
            const rowOp = interpolate(rowSpring, [0, 1], [0, 1]);

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 25,
                  backgroundColor: "rgba(10, 11, 14, 0.75)",
                  borderLeft: "6px solid #C5A059",
                  padding: "24px 30px",
                  borderRadius: "0 16px 16px 0",
                  transform: `translateX(${rowX}px)`,
                  opacity: rowOp,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
              >
                <span style={{ fontSize: 32 }}>⭐</span>
                <span style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "bold" }}>{item}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Outro / Advisor Contact Details (Luxurious Slate Background + Contact text)
const SceneOutro: React.FC<{ props: VideoProps; duration: number }> = ({ props, duration }) => {
  const frame = useCurrentFrame();
  
  const logoOp = interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: "clamp" });
  const logoY = interpolate(frame, [10, 25], [-40, 0], { extrapolateLeft: "clamp" });

  const contactOp = interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: "clamp" });
  const contactY = interpolate(frame, [20, 35], [40, 0], { extrapolateLeft: "clamp" });
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0B0E",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "180px 100px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Decorative Golden Ambient Glows */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(197, 160, 89, 0.15) 0%, rgba(10, 11, 14, 0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -200,
          left: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(197, 160, 89, 0.1) 0%, rgba(10, 11, 14, 0) 70%)",
        }}
      />

      {/* Top logo block */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          opacity: logoOp,
          transform: `translateY(${logoY}px)`,
        }}
      >
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 80, color: "#FFFFFF", fontWeight: "300" }}>
          Lista<strong style={{ fontStyle: "normal", color: "#C5A059", fontWeight: "700" }}>Pro</strong>
        </span>
        <div style={{ height: 5, width: 140, backgroundColor: "#C5A059", marginTop: 15 }} />
        <span style={{ fontSize: 22, letterSpacing: "6px", color: "#94A3B8", marginTop: 20, fontWeight: "600" }}>
          TECNOLOGÍA INMOBILIARIA
        </span>
      </div>

      {/* Middle info */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          opacity: contactOp,
          transform: `translateY(${contactY}px)`,
        }}
      >
        {props.agentPhoto ? (
          <div style={{ width: 150, height: 150, borderRadius: "50%", border: "4px solid #C5A059", overflow: "hidden", marginBottom: 35, backgroundColor: "rgba(10, 11, 14, 0.8)" }}>
            <img src={props.agentPhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ) : (
          <div style={{ width: 150, height: 150, borderRadius: "50%", backgroundColor: "rgba(197, 160, 89, 0.1)", border: "2px solid #C5A059", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 35 }}>
            <span style={{ fontSize: 75 }}>👔</span>
          </div>
        )}
        
        <span style={{ color: "#94A3B8", fontSize: 24, fontWeight: "bold", letterSpacing: "2px", marginBottom: 10 }}>
          AGENTE ENCARGADO
        </span>
        <h2 style={{ color: "#FFFFFF", fontSize: 48, fontWeight: "bold", margin: "0 0 20px 0" }}>
          {props.agentName || "Asesor Exclusivo"}
        </h2>
        
        <div style={{ height: 1, width: "60%", backgroundColor: "rgba(255, 255, 255, 0.1)", margin: "10px 0 25px 0" }} />

        {/* Action button style contact */}
        <div style={{ display: "flex", flexDirection: "column", gap: 15, width: "100%", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 15, color: "#C5A059", fontSize: 32, fontWeight: "bold" }}>
            <span>📞</span>
            <span>{props.agentPhone || "+591 700 00000"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 15, color: "#E2E8F0", fontSize: 24 }}>
            <span>✉️</span>
            <span>{props.agentEmail || "contacto@listapro.com"}</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal Notice */}
      <div style={{ textAlign: "center", fontSize: 18, color: "#475569", letterSpacing: "1px" }}>
        © {new Date().getFullYear()} ListaPro Bolivia. Todos los derechos reservados.
      </div>
    </AbsoluteFill>
  );
};

export const VideoComposition: React.FC<VideoProps> = (props) => {
  const { musicUrl } = props;

  // 150 frames per scene * 5 fields = 750 frames (exactly 25 seconds duration at 30 fps)
  const fps = 30;
  const sceneFrames = 150; // 5 seconds per scene

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Background elegant track */}
      {musicUrl && (
        <Audio
          src={musicUrl}
          volume={0.4}
        />
      )}

      {/* Scene 1: Intro */}
      <Sequence from={0} durationInFrames={sceneFrames + 10}>
        <SceneIntro props={props} duration={sceneFrames} />
      </Sequence>

      {/* Scene 2: Prices Highlight */}
      <Sequence from={sceneFrames} durationInFrames={sceneFrames + 10}>
        <ScenePrice props={props} duration={sceneFrames} />
      </Sequence>

      {/* Scene 3: Core Specs */}
      <Sequence from={sceneFrames * 2} durationInFrames={sceneFrames + 10}>
        <SceneSpecs props={props} duration={sceneFrames} />
      </Sequence>

      {/* Scene 4: Highlights / Amenities */}
      <Sequence from={sceneFrames * 3} durationInFrames={sceneFrames + 10}>
        <SceneAmenities props={props} duration={sceneFrames} />
      </Sequence>

      {/* Scene 5: Advisor & Outro */}
      <Sequence from={sceneFrames * 4} durationInFrames={sceneFrames}>
        <SceneOutro props={props} duration={sceneFrames} />
      </Sequence>
    </AbsoluteFill>
  );
};
