import "dotenv/config";
import { Agent, tool, run } from "@openai/agents";
import axios from "axios";
import { z } from "zod";
import nodemailer from "nodemailer";
import readline from "node:readline/promises";

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
// const sendEmailTool = tool({
//   name: "sendEmail",
//   description: "Send an email to a specified recipient.",
//   parameters: z.object({
//     toEmail: z.string().describe("The email address of the toEmail."),
//     subject: z.string().describe("The subject of the email."),
//     body: z.string().describe("The body content of the email."),
//   }),

//   execute: async function ({ toEmail, subject, body }) {
//     console.log("Sending email to:", toEmail);
//     console.log("this is subject", subject);
//     console.log("this is body", body);

//     // Email sending logic would go here
//   },
// });

const sendEmailTool = tool({
  name: "sendEmail",
  description: "Send an email to a specified recipient.",
  parameters: z.object({
    toEmail: z.string().describe("The email address of the receiver."),
    subject: z.string().describe("The subject of the email."),
    body: z.string().describe("The body content of the email."),
  }),
  needsApproval: true,

  execute: async function ({ toEmail, subject, body }) {
    console.log("Sending email to:", toEmail);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: subject,
        text: body,
      });
      console.log("mail sent");

      return `Email successfully sent to ${toEmail}`;
    } catch (error) {
      console.error(error);
      return `Failed to send email`;
    }
  },
});
const agent = new Agent({
  name: "weather Agent",
  //   instructions: "You are an assistant that provides weather information.",
  instructions: `
You are an AI assistant.

Rules:
- If the user asks about weather, ALWAYS call the weather tool first.
- If the user asks to send an email that includes weather, FIRST fetch the weather using the weather tool.
- Then include the fetched weather result in the email body.
- Only after that, call the sendEmail tool.

Never send raw user text like "weather in mumbai" without fetching actual data.
`,
  model: "openai/gpt-4o",
  tools: [getWeatherTool, sendEmailTool],
});

// async function main(q: string) {
//   const result = await run(agent, q);
//   //   console.log(result.finalOutput);
//   console.log(result.interruptions);
// }

///asking the confirmation
async function askForConfirmation(ques: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await rl.question(`${ques} (y/n): `);
  const normalizedAnswer = answer.toLowerCase();
  rl.close();
  return normalizedAnswer === "y" || normalizedAnswer === "yes";
}

async function main(q: string) {
  let result = await run(agent, q);
  let hasInteruptions = result.interruptions.length > 0;
  while (hasInteruptions) {
    const curresntStatus = result.state;
    for (const interupt of result.interruptions) {
      if (interupt.type === "tool_approval_item") {
        const isAllowed = await askForConfirmation(
          `Agent ${interupt.agent.name}
                is asking for calling  tool
                ${interupt.rawItem.name}
                with the args ${interupt.rawItem.arguments}
                `,
        );
        if (isAllowed) {
          curresntStatus.approve(interupt);
          console.log("yes approved");
        } else {
          curresntStatus.reject(interupt);
          console.log("denied approved");
        }

        result = await run(agent, curresntStatus);
        hasInteruptions = result.interruptions?.length > 0;
      }
    }
  }
}

// main("whst is the weather of delhi and goa");
// main("Send an email to ram@gmail.com saying weather in mumbai");

// main(
//   "Get weather of Delhi and send it to my email-zakyasharmeen@gmail.com subject-weather in delhi",
// );

main("Get the current weather in delhi and send it to ram@gmail.com");
