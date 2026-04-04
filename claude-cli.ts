#!/usr/bin/env node
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const args = process.argv.slice(2);
  const prompt = args.join(" ");

  if (!prompt) {
    console.log("usage: claude <prompt>");
    process.exit(1);
  }

  try {
    const anthropic = new Anthropic();

    const msg = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    if (msg.content[0].type === "text") {
      console.log(msg.content[0].text);
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
