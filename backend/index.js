import express from "express";
import fs from "fs";

import path from "path";
import cors from "cors"; // ADD THIS
import { fileURLToPath } from "url";

// __dirname setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3900;
const app = express();

app.use(cors()); // ENABLE CORS for all routes

export const videosObj = {
  Animal: path.join(__dirname, "videos", "Animal.mp4"),
  Cornelius: path.join(__dirname, "videos", "Cornelius.mp4"),
  Brasuca: path.join(__dirname, "videos", "Brasuca.mp4"),
  Musical: path.join(__dirname, "videos", "Musical.mp4"),
  Franchise: path.join(__dirname, "videos", "Franchise.mp4"),
  Rigs: path.join(__dirname, "videos", "Rigs.mp4"),
  CERVIDEO: path.join(__dirname, "videos", "CERVIDEO.mp4"),
  ECCO: path.join(__dirname, "videos", "ECCO.mp4"),
  Halloween: path.join(__dirname, "videos", "Halloween.mp4"),
  Kids: path.join(__dirname, "videos", "Kids.mp4"),
  Run: path.join(__dirname, "videos", "Run.mp4"),
};

app.get("/videos/:filename", (req, res) => {
  try {
    const fileName = req.params.filename;
    const filePath = videosObj[fileName];
    if (!filePath) {
      return res.status(404).send("Video not found");
    }

    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunkSize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });

      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
