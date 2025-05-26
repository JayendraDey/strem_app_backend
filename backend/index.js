import express from "express";
import fs from "fs";
import cors from "cors"; // ADD THIS

const PORT = 3900;
const app = express();

app.use(cors()); // ENABLE CORS for all routes

export const videosObj = {
  "Animal": "C:/Users/Atin Dey/Desktop/PROGRAMMING/fullstack_task/streaming_tusk/backend/videos/Animal.mp4",
  "Cornelius": "C:/Users/Atin Dey/Desktop/PROGRAMMING/fullstack_task/streaming_tusk/backend/videos/Cornelius.mp4",
  "Brasuca": "C:/Users/Atin Dey/Desktop/PROGRAMMING/fullstack_task/streaming_tusk/backend/videos/Brasuca.mp4",
  "Musical": "C:/Users/Atin Dey/Desktop/PROGRAMMING/fullstack_task/streaming_tusk/backend/videos/Musical.mp4",
  "Franchise": "C:/Users/Atin Dey/Desktop/PROGRAMMING/fullstack_task/streaming_tusk/backend/videos/Franchise.mp4",
  "Rigs": "C:/Users/Atin Dey/Desktop/PROGRAMMING/fullstack_task/streaming_tusk/backend/videos/Rigs.mp4",
  "CERVIDEO": "C:/Users/Atin Dey/Desktop/PROGRAMMING/fullstack_task/streaming_tusk/backend/videos/CERVIDEO.mp4",
  "ECCO": "C:/Users/Atin Dey/Desktop/PROGRAMMING/fullstack_task/streaming_tusk/backend/videos/ECCO.mp4",
  "Halloween": "C:/Users/Atin Dey/Desktop/PROGRAMMING/fullstack_task/streaming_tusk/backend/videos/Halloween.mp4",
  "Kids": "C:/Users/Atin Dey/Desktop/PROGRAMMING/fullstack_task/streaming_tusk/backend/videos/Kids.mp4",
  "Run": "C:/Users/Atin Dey/Desktop/PROGRAMMING/fullstack_task/streaming_tusk/backend/videos/Run.mp4",
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
