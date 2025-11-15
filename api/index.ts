// Vercel serverless function wrapper for Express app
import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { registerRoutes } from "../server/routes";

// Create Express app instance
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes (cached by Vercel)
let appInitialized = false;

async function initializeApp() {
  if (appInitialized) return;
  
  try {
    const server = await registerRoutes(app);
    appInitialized = true;
  } catch (error) {
    console.error("Failed to initialize app:", error);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await initializeApp();
    
    // Convert Vercel request/response to Express format
    return new Promise<void>((resolve, reject) => {
      // Add error handler
      const errorHandler = (err: any) => {
        console.error("Express error:", err);
        if (!res.headersSent) {
          res.status(500).json({ 
            message: "Internal server error",
            error: process.env.NODE_ENV === "development" ? err.message : undefined
          });
        }
        resolve();
      };
      
      app(req as any, res as any, (err?: any) => {
        if (err) {
          errorHandler(err);
          return;
        }
        if (!res.headersSent) {
          res.status(404).json({ message: "Not found" });
        }
        resolve();
      });
    });
  } catch (error) {
    console.error("Handler error:", error);
    if (!res.headersSent) {
      res.status(500).json({ 
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      });
    }
  }
}

