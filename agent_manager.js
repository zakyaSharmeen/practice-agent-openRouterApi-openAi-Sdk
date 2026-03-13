process.env.OPENAI_AGENTS_DISABLE_TRACING = "true";
import "dotenv/config";
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";
import fs from "node:fs/promises";
// #act centerally
// user-centeral agent1
// centeral agent1-agent2
// agent2-centeral agent1
// centeral agent1-user

//tool to fetch available plans
const fetch_availabile_plans = tool({
  name: "fetch_availabile_plans",
  description: "Fetch the available internet plans for the user present.",
  parameters: z.object({}),
  execute: async function () {
    return [
      { plan_id: "1", price_inr: 399, speed: "30mb/s" },
      { plan_id: "2", price_inr: 999, speed: "100mb/s" },
      { plan_id: "3", price_inr: 1499, speed: "300mb/s" },
    ];
  },
});

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
    await fs.appendFile(
      "./refunds.txt",
      `Customer ID: ${customer_id}, Reason: ${reason}\n`,
      "utf-8",
    );
    return { refundIssued: true };
  },
});

const refundAgent = new Agent({
  name: "refund Agent",
  instructions:
    "You are an expert refund agent for an internet broadband company. talk to the user and help them with refund process",
  model: "openai/gpt-4o",
  tools: [processRefund],
});

//centeral agent
const saleAgent = new Agent({
  name: "sale Agent",
  instructions:
    "You are an expert sales agent fir an internet broadband compamy. talk to the user and help then what they want ",
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

//user ask this question
async function runAgent(query = "") {
  const result = await run(saleAgent, query);
  console.log("Agent response:", result.finalOutput);
}

// runAgent("What are the available internet plans?");
runAgent(
  "i had a plan of 399. i need a refund right now and my id is cust23445 because the speed is very slow",
);
