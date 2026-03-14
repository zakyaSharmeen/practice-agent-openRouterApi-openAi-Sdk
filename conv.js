process.env.OPENAI_AGENTS_DISABLE_TRACING = "true";
import "dotenv/config";
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

let sharedHistorty = [];

//sql agents's tool
const executeSQL = tool({
  name: "execute_sql",
  description: "this execute the SQL QUERY",
  parameters: z.object({
    sql: z.string().describe("the SQL query to execute"),
  }),
  execute: async function ({ sql }) {
    // Here you would implement the logic to execute the SQL query against your database.
    // For demonstration purposes, we'll just return a mock response.
    console.log("Tool Executing SQL Query:::::::::: 1", sql);
    return `Executed SQL Query DONE::::::::::::: ${sql}`;
  },
});

// SQL Agent
const sqlAgent = new Agent({
  name: "SQL EXPERT Agent",
  instructions: `You are an expert SQL agent specialised in generating SQL queries.

Database Schema:

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
  model: "openai/gpt-4o",
  tools: [executeSQL],
});

async function main(q = "") {
  sharedHistorty.push({ role: "user", content: q }); //shore the msg in history or db
  // console.log("HISTORY STORED:::::::::::::: 2", sharedHistorty);

  const response = await run(sqlAgent, sharedHistorty);

  sharedHistorty = response.history; // update the shared history with the agent's response
  // console.log("UPDATED STORED:------------------------3", sharedHistorty);

  // console.log("Final Response::::::::::::: 1", response.history);
  console.log("Final Output ::::::::::::: 4", response.finalOutput);
}

// main("Get all users ");

//run finction complete one turn of the agent, you can call it multiple times to have a conversation with the agent.

main("hii, my name is deepak rai sharma").then(() => {
  main("get me all the users with my name");
});

// main("hii my name is rani");
