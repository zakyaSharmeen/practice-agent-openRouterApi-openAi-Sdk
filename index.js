//////////////////////////////////////////////////////////////////////////////////////////
// working code:
// import OpenAI from "openai";
// import "dotenv/config";

//agent answeruser question------------------
// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENAI_API_KEY,
//   defaultHeaders: {
//     "HTTP-Referer": "http://localhost:3000",
//     "X-Title": "My App",
//   },
// });

//user ask the quest------------------
// async function main() {
//   const completion = await openai.chat.completions.create({
//     model: "openai/gpt-4o",
//     messages: [
//       { role: "user", content: "you are an agent who says positive thoughts" },
//     ],
//   });

//   console.log(completion.choices[0].message.content);
//   //   console.log("Usage:", completion.usage);
//   //   console.log(completion.message.choices[0].instruction);
// }

// main();

////////////////////////////////////////////////////////////////
/////////////openai
import { Agent, run } from "@openai/agents";
import "dotenv/config";
process.env.OPENAI_AGENTS_DISABLE_TRACING = "1";

const location = "usa";
// agent answeruser question------------------
const helloAgent = new Agent({
  name: "HelloAgent",
  // instructions:
  //   "You are a helpful assistant that greets the user with their name and says positive thoughts.",
  instructions: function () {
    if (location === "ïndia") {
      return "always say namaste and wish the user with their name and say hello";
    } else {
      return "then just talk to the user";
    }
  },
  model: "openai/gpt-4o",
});

// user ask the quest------------------
async function main() {
  const result = await run(helloAgent, "Hello there! my name is rani");
  console.log("Agent response:", result.finalOutput);
}

main();
