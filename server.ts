import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Increase payload limit for base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// API endpoint for generating real estate copywriting
app.post("/api/generate", async (req, res) => {
    try {
      const {
        propertyType,
        operation,
        address,
        cityState,
        priceBob,
        priceUsd,
        bedrooms,
        bathrooms,
        builtArea,
        plotArea,
        parking,
        amenities, // Array of strings
        shortDescription,
        agentName,
        agentPhone,
        agentEmail,
        coverImage, // Optional base64 string
      } = req.body;

      // Validate required inputs
      if (!propertyType || !operation || !address || !cityState || !priceBob || !priceUsd) {
        return res.status(400).json({
          error: "Faltan campos mandatorios en el formulario.",
        });
      }

      // Initialize Gemini Client safely
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "Clave GEMINI_API_KEY de Google Gen AI no configurada. Por favor, añádala en la pestaña de Secrets de AI Studio.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Construct a rigorous descriptive prompt
      let promptText = `
Genera contenido profesional e impactante para una publicación inmobiliaria de la agencia "ListaPro" en Cochabamba, Bolivia.

DATOS DE LA PROPIEDAD:
- Tipo de Propiedad: ${propertyType}
- Operación comercial: ${operation} (Ej: Venta o Renta)
- Dirección/Ubicación: ${address}
- Ciudad y Estado/País: ${cityState}
- Precio en Bolivianos: ${priceBob} BOB
- Precio en Dólares: ${priceUsd} USD
- Características principales:
  * Dormitorios: ${propertyType === 'Terreno' ? 'N/A' : bedrooms || 0}
  * Baños: ${propertyType === 'Terreno' ? 'N/A' : bathrooms || 0}
  * Metros Construidos: ${propertyType === 'Terreno' ? 'N/A' : builtArea || 0} m²
  * Metros de Terreno: ${plotArea || 0} m²
  * Estacionamientos: ${propertyType === 'Terreno' ? 'N/A' : parking || 0}
- Amenidades/Beneficios: ${amenities && amenities.length > 0 ? amenities.join(", ") : "Ninguna especificada"}
- Descripción o destaques clave indicados por el agente (úsalo para enriquecer el tono y detalles específicos): "${shortDescription || '(Ninguno)'}"

DATOS DEL AGENTE (Debe figurar de forma estética al final de los textos):
- Nombre del Agente: ${agentName}
- Teléfono de contacto: ${agentPhone}
- Correo electrónico: ${agentEmail}

INSTRUCCIONES DE COPYWRITING (ENFOCADO EN CONVERSIÓN Y BENEFICIOS):
1. El título debe centrarse en el beneficio principal. Evita clichés. Ej: "Despierta con Vistas Panorámicas en la Mejor Zona" en lugar de "¡DEPARTAMENTO EN VENTA!".
2. La descripción debe ser persuasiva, clara y directa. En lugar de solo listar características, describe el beneficio. Usa oraciones cortas, voz activa y un tono confiable. Menciona los precios en BOB y USD.
3. FORMATO PARA INSTAGRAM (MUY IMPORTANTE): El copy debe ser visualmente impecable y profesional.
   - Inicia con un gancho emocional poderoso.
   - OBLIGATORIO: Usa dobles saltos de línea (\n\n) para separar los párrafos principales.
   - IMPORTANTE PARA LAS VIÑETAS: Usa UN SOLO salto de línea (\n) entre cada viñeta para que la lista de beneficios quede compacta y no excesivamente espaciada.
   - Presenta los beneficios como una lista vertical estructurada usando emojis elegantes (ej. 💎, ✨, 📍).
   - Cierra con un CTA directo hacia ${agentName} y hashtags agrupados al final.
4. Si se incluye una imagen, utiliza sus elementos visuales para "mostrar en lugar de contar" (Show over tell) la experiencia única de habitar la propiedad.
`;

      const contents: any[] = [];

      // If a cover image base64 was sent, append it to the prompt parts for multi-modality!
      if (coverImage && coverImage.includes("base64,")) {
        try {
          const splitData = coverImage.split("base64,");
          const mimeType = splitData[0].match(/data:(.*?);/)?.[1] || "image/jpeg";
          const base64Data = splitData[1];
          
          contents.push({
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data,
                },
              },
              {
                text: promptText,
              }
            ]
          });
        } catch (imageErr) {
          console.error("Error parsing base64 image, falling back to text-only:", imageErr);
          contents.push({ parts: [{ text: promptText }] });
        }
      } else {
        contents.push({ parts: [{ text: promptText }] });
      }

      // Try multiple model fallbacks in case one of them has exhausted its limit
      const modelsToTry = [
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-flash-latest"
      ];

      let responseText = "";
      let lastError: any = null;

      for (const modelName of modelsToTry) {
        try {
          console.log(`Intentando generar contenido con el modelo: ${modelName}`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              systemInstruction: `Eres un experto copywriter de conversión especializado en bienes raíces de lujo en Cochabamba, Bolivia. 
Tu objetivo es escribir textos de marketing claros, persuasivos y que impulsen a la acción (visitas/ventas).
Aplica principios como: claridad sobre creatividad, beneficios sobre características, y lenguaje específico sobre vago.
Siempre asume que la moneda boliviana (BOB) y dólares americanos (USD) son el estándar. Retorna un JSON válido.`,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "Un título sumamente vendedor con gancho comercial para inmuebles en Cochabamba.",
                  },
                  description: {
                    type: Type.STRING,
                    description: "Ficha técnica y descripción profesional de la propiedad en un formato literario impecable, con espacios o párrafos limpios, ideal para mandar por Whatsapp o subir a portales especializados.",
                  },
                  instagramCopy: {
                    type: Type.STRING,
                    description: "Copia optimizada para Instagram y Facebook. OBLIGATORIO: Aplica saltos de línea literales (\\n\\n) entre párrafos, pero usa solo (\\n) entre viñetas consecutivas para que queden compactas.",
                  },
                  keyHighlights: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.STRING,
                    },
                    description: "Tres características cortas y atractivas que resumen de inmediato por qué esta propiedad es única.",
                  },
                  estimatedValueTagline: {
                    type: Type.STRING,
                    description: "Una breve frase destacada sobre el excelente precio o la plusvalía de la propiedad.",
                  }
                },
                required: ["title", "description", "instagramCopy", "keyHighlights", "estimatedValueTagline"],
              },
            },
          });

          if (response && response.text) {
            responseText = response.text;
            console.log(`¡Éxito obtenido con el modelo ${modelName}!`);
            break; // Success, exit retry loop
          }
        } catch (error: any) {
          console.error(`Fallo temporal con el modelo ${modelName}:`, error);
          lastError = error;
        }
      }

      if (!responseText) {
        throw lastError || new Error("No se pudo obtener una respuesta válida de ninguno de los modelos de IA.");
      }

      const generatedData = JSON.parse(responseText.trim());
      return res.json(generatedData);
    } catch (error: any) {
      console.warn("Error en comunicación con Gemini API, iniciando generador local de respaldo:", error);

      const {
        propertyType,
        operation,
        address,
        cityState,
        priceBob,
        priceUsd,
        bedrooms,
        bathrooms,
        builtArea,
        plotArea,
        parking,
        amenities,
        shortDescription,
        agentName,
        agentPhone,
        agentEmail,
      } = req.body;

      // Construct a very high-quality fallback copy structure
      const isVenta = (operation || "").toLowerCase() === "venta";
      const opLabel = isVenta ? "VENTA" : "ALQUILER";
      
      let title = "";
      if (propertyType === "Terreno") {
        title = `Terreno Premium en ${opLabel}: El Lienzo Perfecto para tu Próximo Proyecto en Cochabamba`;
      } else if (propertyType === "Departamento") {
        title = `Departamento Exclusivo en ${opLabel}: Confort y Ubicación Privilegiada`;
      } else if (propertyType === "Penthouse") {
        title = `Penthouse de Lujo en ${opLabel}: Vive en la Cima con Vistas Panorámicas Inigualables`;
      } else {
        title = `Residencia de Ensueño en ${opLabel}: Amplitud, Seguridad y Estilo de Vida Superior`;
      }

      let description = `Una Oportunidad Única en Cochabamba (${operation.toUpperCase()})\n\n`;
      description += `Descubre esta extraordinaria propiedad estratégicamente ubicada en ${address}. Diseñada para quienes valoran la calidad de vida, esta opción no solo te brinda comodidad inmediata, sino que representa una inversión inteligente y segura con alta plusvalía en una de las mejores zonas de la ciudad.\n\n`;
      
      if (propertyType !== "Terreno") {
        description += `ESPACIOS PENSADOS PARA TU CONFORT:\n`;
        description += `- Dormitorios: ${bedrooms || 0} habitaciones diseñadas para el máximo descanso.\n`;
        description += `- Baños: ${bathrooms || 0} espacios con acabados modernos y funcionales.\n`;
        description += `- Parqueo: ${parking || 0} espacio(s) seguro(s) y de fácil acceso.\n`;
        description += `- Superficie Construida: ${builtArea || 0} m² de distribución óptima y luminosa.\n`;
        description += `- Lote de terreno: ${plotArea || 0} m² totales.\n\n`;
      } else {
        description += `POTENCIAL ILIMITADO:\n`;
        description += `- Superficie Total: ${plotArea || 0} m² listos para desarrollarse.\n`;
        description += `- Topografía regular que optimiza costos y tiempos de construcción.\n`;
        description += `- Entorno residencial consolidado, asegurando acceso inmediato a servicios, transporte y vías principales.\n\n`;
      }

      if (shortDescription) {
        description += `EL VALOR AÑADIDO:\n"${shortDescription}"\n\n`;
      }

      if (amenities && amenities.length > 0) {
        description += `AMENIDADES EXCLUSIVAS:\n`;
        amenities.forEach((amenity: string) => {
          description += `• ${amenity}\n`;
        });
        description += `\n`;
      }

      description += `INVERSIÓN:\n`;
      description += `• $us ${priceUsd} / BOB ${priceBob}\n\n`;
      description += `¿LISTO PARA DAR EL SIGUIENTE PASO?\n`;
      description += `Agenda tu visita privada hoy mismo y experimenta el potencial de esta propiedad en persona.\n`;
      description += `Asesor Inmobiliario: ${agentName || "Especialista ListaPro"}\n`;
      if (agentPhone) description += `📲 Contacto Directo: ${agentPhone}\n`;
      if (agentEmail) description += `✉️ Email: ${agentEmail}\n`;

      // Instagram
      let instagramCopy = `¿Buscando la propiedad ideal en Cochabamba? La acabas de encontrar. ✨\n\n`;
      instagramCopy += `Disponible en *${operation.toUpperCase()}*: Este espectacular *${propertyType.toUpperCase()}* en ${address}, ${cityState}, combina ubicación premium con un estilo de vida superior.\n\n`;
      
      if (propertyType !== "Terreno") {
        instagramCopy += `🛌 *${bedrooms || 0} Dormitorios* diseñados para tu descanso\n`;
        instagramCopy += `🛁 *${bathrooms || 0} Baños* con acabados modernos\n`;
        instagramCopy += `🚗 *${parking || 0} Parqueo(s)* asegurados\n`;
      }
      instagramCopy += `📐 *${plotArea || 0} m² Terreno* | *${builtArea || 0} m² Construcción*\n\n`;

      if (amenities && amenities.length > 0) {
        instagramCopy += `🌟 *LO QUE TE ENCANTARÁ:*\n`;
        amenities.slice(0, 4).forEach((amenity: string) => {
          instagramCopy += `✔️ ${amenity}\n`;
        });
        instagramCopy += `\n`;
      }

      instagramCopy += `💎 *Inversión:* $us ${priceUsd} | BOB ${priceBob}\n\n`;
      instagramCopy += `El mercado inmobiliario en Cochabamba se mueve rápido. ¡No dejes que esta oportunidad se te escape! 👇\n\n`;
      instagramCopy += `👤 *${agentName}*\n`;
      if (agentPhone) instagramCopy += `📲 Escríbeme ahora: ${agentPhone}\n`;
      if (agentEmail) instagramCopy += `📧 ${agentEmail}\n\n`;
      instagramCopy += `#Cochabamba #BienesRaicesBolivia #InmueblesCochabamba #InversionesBolivia #ListaPro #PropiedadesExclusivas`;

      const keyHighlights = [
        `Ubicacion en ${address}`,
        propertyType === "Terreno" ? `Terreno de ${plotArea} m²` : `${builtArea} m² construidos`,
        `Precio de $us ${priceUsd}`
      ];

      const estimatedValueTagline = `Propiedad de alta demanda en ${cityState} valuada comercialmente en $us ${priceUsd}.`;

      return res.json({
        title,
        description,
        instagramCopy,
        keyHighlights,
        estimatedValueTagline,
        isFallback: true,
        fallbackReason: error.message || "Quota Exceeded"
      });
    }
  });

  // API endpoint for generating real estate marketing video via Remotion
  app.post("/api/generate-video", async (req, res) => {
    try {
      const videoProps = req.body;
      console.log("Iniciando generación de video en el backend...");

      const fileId = `video_${Date.now()}`;
      
      try {
        // Use /tmp for Vercel Serverless, otherwise use dist/video-renders
        const rendersDir = process.env.VERCEL 
          ? path.join("/tmp", "video-renders") 
          : path.join(process.cwd(), "dist", "video-renders");
          
        if (!fs.existsSync(rendersDir)) {
          fs.mkdirSync(rendersDir, { recursive: true });
        }

        const outputPath = path.join(rendersDir, `${fileId}.mp4`);

        console.log("Cargando módulos programmaticos de Remotion...");
        const { bundle } = await import("@remotion/bundler");
        const { renderMedia, selectComposition } = await import("@remotion/renderer");

        const entryPoint = path.join(process.cwd(), "video/index.ts");
        console.log("Compilando composición con Remotion Bundler...");
        const bundleLocation = await bundle({
          entryPoint,
          webpackOverride: (config) => config,
        });

        console.log("Seleccionando composición 'PropertyReel'...");
        const composition = await selectComposition({
          serveUrl: bundleLocation,
          id: "PropertyReel",
          inputProps: videoProps,
        } as any);

        console.log("Iniciando renderizado de video MP4...");
        await renderMedia({
          composition,
          serveUrl: bundleLocation,
          codec: "h264",
          outputLocation: outputPath,
          inputProps: videoProps,
          // Set frame range if custom duration
        });

        console.log(`¡Vídeo generado con éxito! Guardado en: ${outputPath}`);

        return res.json({
          status: "success",
          downloadUrl: `/api/downloads/${fileId}.mp4`,
          filename: `${fileId}.mp4`
        });
      } catch (remotionError: any) {
        console.warn("Fallo temporal de renderizado en backend (frecuente en contenedores sin GPU/Chrome/ffmpeg):", remotionError);
        
        // Return a fallback indicator so the client automatically renders high fidelity inside the browser's Canvas
        return res.json({
          status: "fallback",
          message: "El servidor inició el renderizado híbrido inteligente. Renderizando video directamente en el navegador con máxima fidelidad...",
          reason: remotionError.message || "Remotion CLI limitations in headless cloud sandbox"
        });
      }
    } catch (err: any) {
      console.error("Error en endpoint /api/generate-video:", err);
      return res.status(500).json({
        error: err.message || "Error interno al iniciar el procesamiento del video."
      });
    }
  });

  // Serve generated video mp4 files
  app.get("/api/downloads/:filename", (req, res) => {
    try {
      const { filename } = req.params;
      const sanitized = path.basename(filename);
      const filePath = process.env.VERCEL 
        ? path.join("/tmp", "video-renders", sanitized)
        : path.join(process.cwd(), "dist", "video-renders", sanitized);

      if (fs.existsSync(filePath)) {
        return res.download(filePath, `listapro_${sanitized}`);
      } else {
        return res.status(404).json({ error: "Archivo de video no encontrado o expiró." });
      }
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Serve static assets and handle Vite development client
async function startViteServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ListaPro server listening on port ${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startViteServer();
}

export default app;
