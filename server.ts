import express from "express";
import cors from "cors";
import cloudscraper from "cloudscraper";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/check", async (req, res) => {
  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ valid: false, error: "Key is required" });
  }

  try {
    const form = new URLSearchParams();
    form.append("key", key);

    const response = await cloudscraper({
      method: "POST",
      uri: "https://agent.korepi.com/info",
      form,
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const isValid = response.includes("Your key is valid") || !response.includes("invalid");

    return res.json({ valid: isValid, raw: response });
  } catch (err) {
    return res.status(500).json({ valid: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});