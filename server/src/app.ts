import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Portfolio API is running",
  });
});

export default app;