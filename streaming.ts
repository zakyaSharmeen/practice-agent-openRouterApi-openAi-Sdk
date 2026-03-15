import "dotenv/config";

import { Agent, run } from "@openai/agents";
const agent = new Agent({
  name: "Assistant",
  instructions:
    "You are an expert in story telling, you will be given a topic and then you have to create a story about it",
  model: "gpt-4.1-mini",
});

async function* streamOutput(q: string) {
  const result = await run(agent, q, { stream: true });
  const stream = result.toTextStream();
  for await (const val of stream) {
    yield { isCompleted: false, value: val };
  }
  yield { isCompleted: true, value: result.finalOutput };
}

async function main(q: string) {
  const result = await run(agent, q, { stream: true });
  //   console.log(result.finalOutput);
  //   const stream = result.toTextStream();
  //   for await (const val of stream) {
  //     console.log(val);
  //   }
  //   result
  //     .toTextStream({
  //       compatibleWithNodeStreams: true,
  //     })
  //     .pipe(process.stdout);

  for await (const o of streamOutput(q)) {
    console.log(o);
  }
}
main("in 400 words tell me story about topper turned looser");

// import "dotenv/config"; // loads environment variables from .env file

// import { Agent, run } from "@openai/agents"; // import Agent class and run function from OpenAI agents SDK

// // create an AI agent with instructions
// const agent = new Agent({
//   name: "Assistant", // name of the agent
//   instructions:
//     "You are an expert in story telling, you will be given a topic and then you have to create a story about it", // system instructions for the AI
//   model: "gpt-4.1-mini", // model used by the agent
// });

// // async generator function to stream AI output
// async function* streamOutput(q: string) {
//   const result = await run(agent, q, { stream: true }); // run the agent with streaming enabled

//   const stream = result.toTextStream(); // convert result into a text stream

//   // read the stream chunk by chunk
//   for await (const val of stream) {
//     yield { isCompleted: false, value: val }; // yield partial output while generation is in progress
//   }

//   yield { isCompleted: true, value: result.finalOutput }; // send final output when generation completes
// }

// // main function to execute the agent
// async function main(q: string) {
//   const result = await run(agent, q, { stream: true }); // run agent again (not necessary here but included)

//   // print streamed output from generator
//   for await (const o of streamOutput(q)) {
//     console.log(o); // log streamed chunks and final result
//   }
// }

// // start program with story topic
// main("in 400 words tell me story about topper turned looser");
