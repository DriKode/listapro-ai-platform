import path from "path";
import fs from "fs";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
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
}
