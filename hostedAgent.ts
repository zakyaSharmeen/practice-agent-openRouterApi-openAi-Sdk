import "dotenv/config";
import { Agent, tool, run, hostedMcpTool } from "@openai/agents";
const agent = new Agent({
  name: "MCP Assistant",
  instructions: "You must always use the MCP tools to answer questions.",
  tools: [
    //LLM ─────► (connects to MCP server)
    hostedMcpTool({
      serverLabel: "gitmcp",
      //serverUrl  = WHERE the tool is
      serverUrl: "https://gitmcp.io/openai/codex",
    }),
  ],
});

async function main(q: string) {
  const result = await run(agent, q);
  console.log(result.finalOutput);
}
// main("what is this repositary about?");
// your query = WHAT to use it on
main(
  "Summarize this repo using MCP: https://github.com/zakyaSharmeen/personalProtfolio",
);
