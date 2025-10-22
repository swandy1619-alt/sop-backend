const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "OpenAI-Project": process.env.OPENAI_PROJECT_ID // ✅ Explicit project scoping
  }
});

app.post("/api/chunk-sop", async (req, res) => {
  const { text, filename } = req.body;

  const prompt = `
You are an SOP chunking assistant. Given the following SOP text, return a JSON array of modular entries. Each entry must include:

- id (string)
- topic (string)
- triggers (array of strings)
- response (string)
- source (string, use filename)

Here is the SOP text:
${text}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ✅ Compatible fallback
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    const raw = completion.choices[0].message.content;
    console.log("Raw response:", raw);

    let json;
    try {
      json = JSON.parse(raw);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError.message);
      console.error("Raw response was:", raw);
      return res.status(500).json({ error: "OpenAI returned invalid JSON" });
    }

    res.json(json);
  } catch (error) {
    console.error("OpenAI error:", error.message);
    console.error("Full error object:", error);
    res.status(500).json({ error: "Failed to chunk SOP" });
  }
});

app.listen(3000, () => console.log("SOP Oracle backend running on port 3000"));
