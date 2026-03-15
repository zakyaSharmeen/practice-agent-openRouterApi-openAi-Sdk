import "dotenv/config";
import { Agent, run, tool, RunContext } from "@openai/agents";
import { z } from "zod";

//structure --interface
interface MyContext {
  userId: number;
  userName: string;

  fetchInfoFromDB: () => Promise<string>;
}

//tool
const getUserInfoTool = tool({
  name: "get_user_tool",
  description: "get the user info",
  parameters: z.object({}),
  execute: async (
    _,
    ctx?: RunContext<MyContext>,
  ): Promise<string | undefined> => {
    // return `UserId ${ctx?.context.userId}\n username=${ctx?.context.userName}`;
    const result = await ctx?.context.fetchInfoFromDB();
    console.log("result from tool::::::::::::::::", result);
    return result;
  },
});

///facing agent
const customerSupportAgent = new Agent<MyContext>({
  name: "Customer Support Agent",
  instructions: ({}) => {
    return `You are an expert customer support agent \n context`;
  },
  model: "openai/gpt-4o",
  //   model: "anthropic/claude-sonnet-4",
  tools: [getUserInfoTool],
});

async function main(query: string, ctx: MyContext) {
  const result = await run(customerSupportAgent, query, {
    context: ctx,
  });
  console.log("Request history:::::::::::::1", result.history);
  // console.log("Response:", result.finalOutput);
  console.log("result------------------------2", result.finalOutput);
}

// diesnot know my name if instruction is simple not a function
main("whts my name", {
  userId: 23456,
  userName: "astha bindal",
  fetchInfoFromDB: async () => `userid= 1, username= "astha`,
});
