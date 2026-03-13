process.env.OPENAI_AGENTS_DISABLE_TRACING = "true";
import "dotenv/config";
import { Agent, run, tool } from "@openai/agents";

//agent
const mathAgent = new Agent({
  name: "Math Agent",
  instructions:
    "You are a helpful assistant that can perform basic math calculations. give answer to the point",
  model: "openai/gpt-4o",
});

async function main(query = "") {
  const result = await run(mathAgent, query);
  console.log(
    "AGENTS RESPONSE::::::::::::::::::::::::::::",
    result.finalOutput,
  );
}
main("What is 2 + 2 *8/4?");
