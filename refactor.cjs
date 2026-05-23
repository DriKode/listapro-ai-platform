const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const gStart = code.indexOf('app.post("/api/generate", async (req, res) => {');
const vStart = code.indexOf('app.post("/api/generate-video", async (req, res) => {');
const dStart = code.indexOf('app.get("/api/downloads/:filename", (req, res) => {');
const endStart = code.indexOf('async function startViteServer() {');

const gBody = code.slice(gStart + 47, vStart).trim().replace(/}\);$/, '');
const vBody = code.slice(vStart + 53, dStart).trim().replace(/}\);$/, '');
const dBody = code.slice(dStart + 48, endStart).trim().replace(/}\);$/, '');

fs.writeFileSync('api/generate.ts', `import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
${gBody}
}
`);

fs.writeFileSync('api/generate-video.ts', `import path from "path";
import fs from "fs";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
${vBody}
}
`);

fs.mkdirSync('api/downloads', {recursive: true});
fs.writeFileSync('api/downloads/[filename].ts', `import path from "path";
import fs from "fs";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).send("Method Not Allowed");
  // inject query param as params
  req.params = { filename: req.query.filename };
${dBody}
}
`);
