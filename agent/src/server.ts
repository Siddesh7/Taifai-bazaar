import express, { Request, Response } from "express";

import agentRoutes from "./routes/agent";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use("/api/agent", agentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("hello world!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
