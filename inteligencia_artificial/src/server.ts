// src/server.ts
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json({ limit: "1mb" }));

// Health check (útil para probar rápido en navegador o curl)
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    uptime_seconds: process.uptime().toFixed(0)
  });
});

// Endpoint demo para project.completed (solo para pruebas locales)
// Imprime el payload en consola y devuelve confirmación inmediata.
app.post("/webhooks/project-completed", (req, res) => {
  const payload = req.body;
  console.log("=== Evento project.completed recibido ===");
  console.log(JSON.stringify(payload, null, 2));
  console.log("=========================================");
  // Respuesta simple para confirmar recepción
  return res.status(200).json({
    ok: true,
    receivedAt: new Date().toISOString(),
    projectId: payload?.project?.id ?? null
  });
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT} (PID: ${process.pid})`);
});

export default app;
// src/server.ts