const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chunk-sop", async (req, res) => {
  const { text, filename } = req.body;
  const prompt = `Chunk the following SOP into modular JSON entries with id, topic, triggers, response, and source:\n\n${text}`;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });
    const json = JSON.parse(completion.choices[0].message.content);
    res.json(json);
  } catch (error) {
    console.error("Error chunking SOP:", error);
    res.status(500).json({ error: "Failed to chunk SOP" });
  }
});

app.listen(3000, () => console.log("SOP Oracle backend running on port 3000"));
