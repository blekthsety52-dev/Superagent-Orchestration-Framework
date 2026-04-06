/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Bot, Cpu, Database, Shield, Zap, Book, Github, Terminal, Send, User, Loader2, Sparkles, Settings, X, ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Superagent } from "@/src/lib/superagent";

interface Message {
  role: "user" | "agent";
  content: string;
  isStreaming?: boolean;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", content: "Hello! I'm your Superagent. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [agentId, setAgentId] = useState("default-agent");
  const [agentModel, setAgentModel] = useState("gemini-3-flash-preview");
  const [agentPrompt, setAgentPrompt] = useState("You are a helpful AI assistant.");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const superagent = new Superagent({ apiKey: process.env.GEMINI_API_KEY || "" });
      
      // Add a placeholder for the agent's response
      setMessages(prev => [...prev, { role: "agent", content: "", isStreaming: true }]);
      
      let fullResponse = "";
      const stream = superagent.invokeStream(agentId, { 
        input: userMessage,
        model: agentModel,
        prompt: agentPrompt
      });

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === "agent") {
            lastMessage.content = fullResponse;
          }
          return newMessages;
        });
      }

      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.role === "agent") {
          lastMessage.isStreaming = false;
        }
        return newMessages;
      });

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: "agent", content: "Sorry, I encountered an error. Please check your configuration." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Superagent</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Live Demo</a>
            <a href="#docs" className="hover:text-white transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25 active:scale-95">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-20 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(79,70,229,0.15),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              v1.2.0 Now Available
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8">
              Orchestrate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Autonomous</span> AI Agents.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl">
              Superagent is the enterprise-grade framework for building, deploying, and managing AI agents with persistent memory, tool access, and multi-agent collaboration.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Chat Demo Section */}
      <section id="demo" className="py-12 bg-slate-900/30 border-y border-slate-800/50 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Live Agent Demo</h2>
              <p className="text-slate-400 text-sm">Experience the Superagent SDK in real-time.</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[750px]">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-300">Superagent v1.2</span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">{agentId} • {agentModel}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2 rounded-lg transition-colors ${showSettings ? "bg-indigo-500/20 text-indigo-400" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  {showSettings ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                </button>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                </div>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-b border-slate-800 bg-slate-900/80 backdrop-blur-md"
                >
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Agent ID</label>
                        <div className="relative">
                          <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                          <input 
                            type="text" 
                            value={agentId}
                            onChange={(e) => setAgentId(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="Enter Agent ID..."
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Model</label>
                        <div className="relative">
                          <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                          <select 
                            value={agentModel}
                            onChange={(e) => setAgentModel(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                          >
                            <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
                            <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro</option>
                            <option value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash Lite</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Prompt (Persona)</label>
                      <div className="relative">
                        <Book className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
                        <textarea 
                          value={agentPrompt}
                          onChange={(e) => setAgentPrompt(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors min-h-[80px] resize-none"
                          placeholder="Define the agent's instructions..."
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        msg.role === "user" 
                          ? "bg-indigo-600 border-indigo-500 text-white" 
                          : "bg-slate-800 border-slate-700 text-indigo-400"
                      }`}>
                        {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                      }`}>
                        {msg.content || (msg.isStreaming && <Loader2 className="w-4 h-4 animate-spin opacity-50" />)}
                        {msg.isStreaming && <span className="inline-block w-1 h-4 bg-indigo-400 ml-1 animate-pulse" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900/80 border-t border-slate-800 backdrop-blur-sm">
              <form 
                onSubmit={handleSend}
                className="relative flex items-center gap-2"
              >
                <div className="relative flex-1 group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message to the agent..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-500"
                    disabled={isLoading}
                  />
                  {input && !isLoading && (
                    <button
                      type="button"
                      onClick={() => setInput("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded-md text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white p-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
              <div className="flex justify-between items-center mt-3 px-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  Powered by Superagent SDK & Gemini AI
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${input.length > 1000 ? 'text-rose-500' : 'text-slate-600'}`}>
                  {input.length} chars
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Cpu className="w-6 h-6 text-indigo-400" />}
              title="Agent Engine"
              description="Native support for Gemini, OpenAI, and Anthropic with standardized prompt orchestration."
            />
            <FeatureCard 
              icon={<Database className="w-6 h-6 text-cyan-400" />}
              title="Hybrid Memory"
              description="Seamlessly blend short-term session state with long-term vector database retrieval."
            />
            <FeatureCard 
              icon={<Terminal className="w-6 h-6 text-emerald-400" />}
              title="Tool Registry"
              description="Safely expose your APIs and scripts to agents with automated function calling."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Zap className="w-5 h-5" />
            <span className="font-bold">Superagent</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 Superagent AI. Apache 2.0 Licensed.
          </p>
          <div className="flex gap-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-slate-800/30 border border-slate-800 hover:border-indigo-500/50 transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}


