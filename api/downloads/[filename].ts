import path from "path";
import fs from "fs";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).send("Method Not Allowed");
  // inject query param as params
  req.params = { filename: req.query.filename };
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
}
