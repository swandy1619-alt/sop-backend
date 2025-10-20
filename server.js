const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post("/api/chunk-sop", async (req, res) => {
  const { text, filename } = req.body;
  const prompt = `Chunk the following SOP into modular JSON entries with id, topic, triggers, response, and source:\n\n${text}`;
  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });
  const json = JSON.parse(completion.data.choices[0].message.content);
  res.json(json);
});

app.listen(3000, () => console.log("SOP Oracle backend running on port 3000"));
