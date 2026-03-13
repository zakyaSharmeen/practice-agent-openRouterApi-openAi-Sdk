process.env.OPENAI_AGENTS_DISABLE_TRACING = "true";
import "dotenv/config";
import { Agent, InputGuardrailTripwireTriggered, run } from "@openai/agents";
import { z } from "zod";

//agent
const mathInputAgent = new Agent({
  name: "Math Agent",
  instructions:
    "you are an input guardrail agent for math homework, you will check if the user input is related to math homework or not, if it is related to math homework then you will allow the input to pass through and",
  model: "openai/gpt-4o",
  outputType: z.object({
    isValidMathQuestion: z
      .boolean()
      .describe("Indicates if the input is a valid math question."),
  }),
});

//watchman carring tripwire triggered or not
const mathInputGuardrails = {
  name: "Math Homework Guardrails",
  execute: async ({ input }) => {
    console.log(
      "Coming from guardrails--- INPUT GUARDRAILS CHECKED::::::::::::::",
      input,
    );
    const result = await run(mathInputAgent, input);
    console.log(
      "Coming from guardrails--- INPUT GUARDRAILS RESULT::::::::::::::",
      result.finalOutput,
    );

    return {
      tripwireTriggered: result.finalOutput.isValidMathQuestion ? false : true,
    };
  },
};

//agent
const mathAgent = new Agent({
  name: "Math Agent",
  instructions:
    "You are a helpful assistant that can perform basic math calculations. give answer to the point",
  model: "openai/gpt-4o",
  inputGuardrails: [mathInputGuardrails],
});

///user-question
async function main(query = "") {
  try {
    const result = await run(mathAgent, query);
    console.log(
      "Coming from the user's query main function---- AGENTS RESPONSE::::::::::::::::::::::::::::",
      result.finalOutput,
    );
  } catch (err) {
    if (err instanceof InputGuardrailTripwireTriggered) {
      console.log(
        "OOPSSS! Maths Questions Only ,Input guardrail tripwire triggered!",
      );
    } else {
      console.error("Error executing agent:", err);
    }
  }
}
// main("What is 2 + 2 *8/4?");
// main("write a js code to calcute sum of 2 numbers");
// main("12*12");/
// main("also what is 12*12? What is the capital of France?,");//true ???? not
main("What is the capital of France?"); //false

///see here if u asking it to write code it will write the code and then execute the code and give you the answer, it is not just writing the code but also executing it and giving you the answer.
// and now we will put limitation to it using -guardrails
