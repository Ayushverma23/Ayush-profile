// Vercel serverless function wrapper for Express app
import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { registerRoutes } from "../server/routes";
import { serveStatic } from "../server/vite";

// Create Express app instance
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes (cached by Vercel)
let appInitialized = false;

async function initializeApp() {
  if (appInitialized) return;
  
  const server = await registerRoutes(app);
  serveStatic(app);
  appInitialized = true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initializeApp();
  
  // Convert Vercel request/response to Express format
  return new Promise<void>((resolve) => {
    app(req as any, res as any, () => {
      if (!res.headersSent) {
        res.status(404).json({ message: "Not found" });
      }
      resolve();
    });
  });
}

