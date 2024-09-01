import express from "express";
import { json } from "body-parser";
import cors from "cors";

const app = express();
const port = 8000;

app.use(json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.post("/createapi", async (req, res) => {
  try {
    const { workflow } = req.body;
    // ワークフローの処理をここに実装
    res.json({
      message: "API created successfully",
      apiEndPoint: workflow.apiEndPoint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
