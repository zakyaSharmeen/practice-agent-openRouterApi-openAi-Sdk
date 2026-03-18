import "dotenv/config";
import { Agent, run, MCPServerStreamableHttp } from "@openai/agents";

const mcpServer = new MCPServerStreamableHttp({
  url: "https://gitmcp.io/openai/codex",
  name: "GitMCP Documentation Server",
});

const agent = new Agent({
  name: "MCP Assistant",
  instructions: "You must always use the MCP tools to answer questions.",

  mcpServers: [mcpServer],
});

async function main(q: string) {
  await mcpServer.connect();
  const result = await run(agent, q);
  console.log(result.finalOutput);
  await mcpServer.close();
}
// main("what is this repositary about?");
// your query = WHAT to use it on
main(
  "Summarize this repo using MCP: https://github.com/zakyaSharmeen/personalProtfolio",
);
