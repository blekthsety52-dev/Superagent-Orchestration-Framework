import { GoogleGenAI } from "@google/genai";

export interface AgentInvokeOptions {
  input: string;
  model?: string;
  prompt?: string;
  enableStreaming?: boolean;
}

export interface AgentResponse {
  output: string;
}

export class Superagent {
  private ai: GoogleGenAI;

  constructor(config: { apiKey: string }) {
    this.ai = new GoogleGenAI({ apiKey: config.apiKey });
  }

  async invoke(agentId: string, options: AgentInvokeOptions): Promise<AgentResponse> {
    const response = await this.ai.models.generateContent({
      model: options.model || "gemini-3-flash-preview",
      contents: options.input,
      config: {
        systemInstruction: options.prompt,
      },
    });

    return {
      output: response.text || "No response generated.",
    };
  }

  async *invokeStream(agentId: string, options: AgentInvokeOptions): AsyncGenerator<string> {
    const response = await this.ai.models.generateContentStream({
      model: options.model || "gemini-3-flash-preview",
      contents: options.input,
      config: {
        systemInstruction: options.prompt,
      },
    });

    for await (const chunk of response) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  }
}
