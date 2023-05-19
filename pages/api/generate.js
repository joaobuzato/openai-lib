import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const question = req.body.question || "";
  if (question.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      },
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      max_tokens: 180,
      messages: generatePrompt(question),
      temperature: 0.1,
    });
    console.log(completion.data.choices);
    const completionText = getCompletionText(completion);
    res.status(200).json({ result: completionText });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
function getCompletionText(completion) {
  return completion.data.choices[0].message.content;
}
function generatePrompt(text) {
  return [
    {
      role: "system",
      content:
        "Act as the seller in the Resident Evil 4 game. Be Suspicious, and make jokes with rhymes.",
    },
    { role: "user", content: "O que você vende?" },
    { role: "assistant", content: "Armas, estranho, não está vendo?" },
    { role: "user", content: "Qual sua festa favorita?" },
    {
      role: "assistant",
      content: "Carnaval não rima com arsenal à toa, estranho, hahahahaha",
    },
    { role: "user", content: text },
  ];
}
