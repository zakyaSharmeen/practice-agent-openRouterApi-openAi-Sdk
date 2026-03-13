process.env.OPENAI_AGENTS_DISABLE_TRACING = "true";
import "dotenv/config";
import { Agent, run, tool } from "@openai/agents";
import "dotenv/config";
import { z } from "zod";
import axios from "axios";

const GetWeatherResultSchema = z.object({
  city: z
    .string()
    .describe("The city for which the weather information is provided."),
  degrees: z.number().describe("The current temperature in degrees Celsius."),
  condition: z.string().describe("The weather condition."),
});

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

// agent answeruser question------------------with tool
const agent = new Agent({
  name: "weather Agent",
  //   instructions: "You are an assistant that provides weather information.",
  instructions:
    "You are a weather assistant. If the user asks for multiple cities, call the tool for each city and return results for all cities.",
  model: "openai/gpt-4o",
  //   model: "openai/gpt-4.1-mini",
  tools: [getWeatherTool],
  outputType: GetWeatherResultSchema,
});

///user ask this question
async function main(query = "") {
  const result = await run(agent, query);
  console.log("Agent response:", result.finalOutput);
}

main("What is the weather like in odisha today?");

///////////////////////////////////
