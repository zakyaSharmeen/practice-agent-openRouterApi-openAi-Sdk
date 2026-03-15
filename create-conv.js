// import "dotenv/config";

// import { OpenAI } from "openai";
// const client = new OpenAI();

// client.conversations.create({}).then((e) => {
//   console.log("conv thread created id = ", e._request_id);
//   console.log("conv thread created id = ", e.created_at);
//   console.log("conv thread created id = ", e.id);
//   console.log("conv thread created id = ", e.metadata);
//   console.log("::::::::::::::::::::", e.object);
// });

import "dotenv/config";

import { Agent, run } from "@openai/agents";
import { OpenAI } from "openai";

const agent = new Agent({
  name: "Assistant",
  instructions: "Reply very concisely.",
  model: "openai/gpt-4.1-mini",
  //   model: "anthropic/claude-sonnet-4",
});

async function main() {
  //   Create a server-managed conversation:
  const client = new OpenAI();
  const { id: conversationId } = await client.conversations.create({});

  const first = await run(agent, "What city is the Golden Gate Bridge in?", {
    conversationId,
  });
  console.log("convesanational id:::::::::::::::::::::1", conversationId);

  console.log("first answer:::::::::::::::::::::::2", first.finalOutput);
  //   -> "San Francisco"

  const second = await run(agent, "What state is it in?", { conversationId });
  console.log("second answer:::::::::::::::::3", second.finalOutput);
  //   -> "California"
}

main();
