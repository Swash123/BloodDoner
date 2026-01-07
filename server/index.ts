import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleTesting } from "./routes/testing";
import router from "./routes/donation"; 
import path from "path";


export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/testing", handleTesting );

    // Serve uploaded files
  // app.use("/bloodDonationReport", express.static(path.join(__dirname, "../public/bloodDonationReport")));


  // API routes
  app.use("/api/donation", router);



  return app;
}
