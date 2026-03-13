// process.env.OPENAI_AGENTS_DISABLE_TRACING = "true";
import "dotenv/config";
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";
import fs from "node:fs/promises";
import { RECOMMENDED_PROMPT_PREFIX } from "@openai/agents-core/extensions";
// #leave after making the connections between specifix agent
// user-centeral agent1
// centeral agent1-agent2
// agent2-user

// tool2
const processRefund = tool({
  name: "processRefund",
  description: "Process a refund for a given customer ID and plan ID.",
  parameters: z.object({
    customer_id: z
      .string()
      .describe("The ID of the customer requesting the refund."),
    reason: z.string().describe("The reason for the refund request."),
  }),
  execute: async function ({ customer_id, reason }) {
    console.log("AGENT::::::REFUND AGENT TOOL EXECUTED");

    await fs.appendFile(
      "./refunds.txt",
      `Customer ID: ${customer_id}, Reason: ${reason}\n`,
      "utf-8",
    );
    return { refundIssued: true };
  },
});

//agent2
const refundAgent = new Agent({
  name: "refund Agent",
  instructions:
    "You are an expert refund agent for an internet broadband company. talk to the user and help them with refund process",
  model: "openai/gpt-4o",
  tools: [processRefund],
});

//tool 1
const fetch_availabile_plans = tool({
  name: "fetch_availabile_plans",
  description: "Fetch the available internet plans for the user present.",
  parameters: z.object({}),
  execute: async function () {
    console.log("AGENT::::::SALE AGENT TOOL EXECUTED");

    return [
      { plan_id: "1", price_inr: 399, speed: "30mb/s" },
      { plan_id: "2", price_inr: 999, speed: "100mb/s" },
      { plan_id: "3", price_inr: 1499, speed: "300mb/s" },
    ];
  },
});

// agent 1 -
const saleAgent = new Agent({
  name: "sale Agent",
  instructions:
    "You are an expert sales agent for an internet broadband compamy. talk to the user and help then what they want ",
  model: "openai/gpt-4o",
  tools: [
    fetch_availabile_plans,
    refundAgent.asTool({
      toolName: "refund_expert",
      toolDescription:
        "handles refund related queries and processes refunds for customers.",
    }),
  ],
});

//agent3
const receptionistAgent = new Agent({
  name: "receptionist Agent",
  instructions: `${RECOMMENDED_PROMPT_PREFIX} 
  you are the customer facing agent, expert in understanding what customer need and then route them or handoff them to the right agent`,

  handoffDescription: ` you have two agent available:
  -saleAgent: Expert in handling queries like all plans and prcing available.
  -refundAgent: Expert in handling user queries for excisting customers and issue refund. `,
  handoffs: [saleAgent, refundAgent],
});

//user ask this question
// async function runAgent(query = "") {
//   const result = await run(receptionistAgent, query);
//   console.log("RESULT:", result.finalOutput);
//   // console.log("HSTORY:", result.history);
//   console.dir(result.history, { depth: null });
// }

/////////////////////////////////
// async function runAgent(query = "") {
//   const result = await run(receptionistAgent, query);

//   console.log("FINAL OUTPUT:", result.finalOutput);

//   console.log("FINAL AGENT:", result.lastAgent?.name);

//   console.dir(result.history, { depth: null });
// }
//////////////////////////////////////////////

async function runAgent(query = "") {
  const result = await run(receptionistAgent, query);

  for (const item of result.history) {
    if (item.type === "handoff") {
      console.log("HANDOFF TO::::::::::::::::::::::::::::", item.agent?.name);
    }
  }

  console.log("FINAL:", result.finalOutput);
}

// runAgent("What are the available internet plans?");
runAgent(
  "hey there tell me about the available plans and the best plan for me? buget around 1000 and i want to use it for my home",
);

// runAgent(
//   "hi i am an existing customer and i want to cancel my subscription and get a refund, can you help me with that? my id is cust456789 because i am moving to another city and i will not be needing the service anymore",
// );
