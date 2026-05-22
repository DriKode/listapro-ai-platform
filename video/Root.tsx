import React from "react";
import { Composition } from "remotion";
import { VideoComposition, VideoProps } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PropertyReel"
        component={VideoComposition}
        durationInFrames={750} // 25 seconds at 30 fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          propertyType: "Departamento",
          operation: "Venta",
          address: "Querubines, Recoleta",
          cityState: "Cochabamba, Bolivia",
          priceBob: "1350000",
          priceUsd: "195000",
          bedrooms: "3",
          bathrooms: "2",
          builtArea: "148",
          plotArea: "148",
          parking: "1",
          amenities: ["Seguridad 24/7", "Salón de Eventos", "Churrasquero Privado"],
          shortDescription: "Impecable departamento con acabados premium y luz natural.",
          coverImage: null,
          extraImages: [],
          agentName: "Carlos Terán",
          agentPhone: "+591 707 98765",
          agentEmail: "cteran@listapro.com",
          agentPhoto: null,
          musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          title: "Departamento Boutique de Lujo",
        } as VideoProps}
      />
    </>
  );
};
