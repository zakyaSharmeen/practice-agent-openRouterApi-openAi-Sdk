// import { Agent, run, tool } from "@openai/agents";
// import "dotenv/config";
// import z from "zod";
// import axios from "axios";

// process.env.OPENAI_AGENTS_DISABLE_TRACING = "1";

// //tool to get weather information

// const getWeatherTool = tool({
//   name: "getWeather",
//   description: "Get the current weather for a given location.",
//   parameters: z.object({
//     city: z.string().describe("The city to get the weather for."),
//   }),

//   execute: async function ({ city }) {
//     console.log("Fetching weather information for:", city);

//     const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`;
//     const response = await axios.get(url, { responseType: "text" });
//     return `The current weather in ${city} is ${response.data.trim()}.`;
//   },
// });

// // agent answeruser question------------------with tool
// const agent = new Agent({
//   name: "weather Agent",
//   instructions: "You are an assistant that provides weather information.",
//   model: "openai/gpt-4o",
//   tools: [getWeatherTool],
// });

// ///question
// async function main(query = "") {
//   const result = await run(agent, query);
//   console.log("Agent response:", result.finalOutput);
// }

// main("What is the weather like in delhi, goa, patiala today?");

/////////////////
import { Agent, run, tool } from "@openai/agents";
import "dotenv/config";
import z from "zod";
import axios from "axios";

process.env.OPENAI_AGENTS_DISABLE_TRACING = "1";

//tool to get weather information

const getWeatherTool = tool({
  name: "getWeather",
  description: "Get the current weather for a given location.",
  parameters: z.object({
    city: z.string().describe("The city to get the weather for."),
  }),

  execute: async function ({ city }) {
    console.log("Fetching weather information for:", city);

    const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`;
    const response = await axios.get(url, { responseType: "text" });
    return `The current weather in ${city} is ${response.data.trim()}.`;
  },
});

const sendEmailTool = tool({
  name: "sendEmail",
  description: "Send an email to a specified recipient.",
  parameters: z.object({
    toEmail: z.string().describe("The email address of the toEmail."),
    subject: z.string().describe("The subject of the email."),
    body: z.string().describe("The body content of the email."),
  }),

  execute: async function ({ toEmail, subject, body }) {
    console.log("Sending email to:", toEmail);
    console.log("this is subject", subject);
    console.log("this is body", body);

    // Email sending logic would go here
  },
});

// agent answeruser question------------------with tool
const agent = new Agent({
  name: "weather Agent",
  instructions: "You are an assistant that provides weather information.",
  model: "openai/gpt-4o",
  tools: [getWeatherTool, sendEmailTool],
});

///question
async function main(query = "") {
  const result = await run(agent, query);
  console.log("Agent response:", result.finalOutput);
}

main("What is the weather like in delhi, goa, patiala today?");
