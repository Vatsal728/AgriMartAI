"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Globe, ChevronRight, Info, ImagePlus, Mic, ArrowRight, Leaf, X } from "lucide-react";

type Message = {
  id: number;
  from: "user" | "bot";
  text?: string;
  image?: string;
  diagnosis?: { label: string; confidence: string };
  source?: string;
};

let nextId = 100;

const initialMessages: Message[] = [
  { id: 1, from: "user", image: "/images/chat-leaf-thumb.png", text: "What's wrong with this leaf?" },
  {
    id: 2,
    from: "bot",
    diagnosis: { label: "Early Blight", confidence: "98.4% Confidence" },
    text: "This appears to be Early Blight (Alternaria solani). It's a common fungal disease that causes concentric rings on leaves. Prune infected lower leaves and avoid overhead watering to prevent further spread.",
  },
  { id: 3, from: "user", text: "Is it safe to water today?" },
  {
    id: 4,
    from: "bot",
    text: "Based on your current weather forecast of 88% humidity and incoming rain, I recommend holding off on watering today. Excessive moisture on the leaves will accelerate the spread of the fungal infection identified.",
    source: "agricultural knowledge base",
  },
];

export default function ChatAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPendingImage(url);
    e.target.value = "";
  };

  const sendMessage = () => {
    if (!input.trim() && !pendingImage) return;
    const userMsg: Message = {
      id: nextId++,
      from: "user",
      text: input.trim() || undefined,
      image: pendingImage || undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setPendingImage(null);
    setSending(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId++,
          from: "bot",
          text: userMsg.image
            ? "Analyzing your photo now... I can see early signs of leaf discoloration. For a full diagnosis, try the dedicated Scan Leaf tool for higher accuracy."
            : "Thanks for the follow-up — based on your farm's current sensor data, I'd recommend monitoring the affected sector over the next 24 hours before taking further action.",
          source: "agricultural knowledge base",
        },
      ]);
      setSending(false);
    }, 900);
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] flex-col lg:min-h-0">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-5 sm:px-10">
        <h1 className="font-heading text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Assistant
        </h1>
        <div className="flex items-center gap-4 sm:gap-6">
          <button type="button" className="hidden items-center gap-2 sm:flex">
            <Globe className="size-[18px] text-slate-500" />
            <span className="text-sm font-medium text-text-muted">EN</span>
          </button>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4 sm:pl-6">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-slate-900">James Wilson</p>
              <p className="text-xs text-text-muted">Farm Owner</p>
            </div>
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-500/20">
              <Image src="/images/james-wilson.png" alt="James Wilson" fill sizes="40px" className="object-cover" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-8 sm:px-10 lg:px-44">
        <div className="mx-auto flex w-full max-w-[800px] flex-col gap-8">
          {messages.map((m) =>
            m.from === "user" ? (
              <div key={m.id} className="flex flex-col items-end">
                <div className="flex max-w-[320px] flex-col gap-3 rounded-xl bg-accent p-4 shadow-sm">
                  {m.image && (
                    <div className="relative h-[180px] w-full overflow-hidden rounded-lg border border-white/20">
                      <Image src={m.image} alt="Uploaded leaf photo" fill sizes="320px" className="object-cover" unoptimized />
                    </div>
                  )}
                  {m.text && <p className="text-[15px] text-white">{m.text}</p>}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-dark">
                  <Leaf className="size-3.5 text-white" />
                </div>
                <div className="flex max-w-[640px] flex-col gap-2">
                  <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-surface-muted p-5 shadow-sm">
                    {m.diagnosis && (
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
                          {m.diagnosis.label}
                        </span>
                        <span className="text-sm font-bold text-emerald-600">{m.diagnosis.confidence}</span>
                      </div>
                    )}
                    <p className="text-[15px] leading-relaxed text-slate-700">{m.text}</p>
                    {m.diagnosis && (
                      <Link href="/scan-leaf/treatment-advice" className="flex w-fit items-center gap-1.5 text-sm font-bold text-emerald-600">
                        View full advice
                        <ChevronRight className="size-3.5" />
                      </Link>
                    )}
                  </div>
                  {m.source && (
                    <div className="flex items-center gap-1.5 pl-1 text-[11px] text-slate-400">
                      <Info className="size-2.5" />
                      Source: {m.source}
                    </div>
                  )}
                </div>
              </div>
            )
          )}
          {sending && (
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-dark">
                <Leaf className="size-3.5 text-white" />
              </div>
              <div className="flex gap-1.5 rounded-xl border border-slate-200 bg-surface-muted px-5 py-4 shadow-sm">
                <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white px-4 py-6 sm:px-10 lg:px-44">
        <div className="mx-auto flex w-full max-w-[800px] flex-col gap-3">
          {pendingImage && (
            <div className="relative w-fit">
              <div className="relative size-16 overflow-hidden rounded-lg border border-slate-200">
                <Image src={pendingImage} alt="Attached preview" fill sizes="64px" className="object-cover" unoptimized />
              </div>
              <button
                type="button"
                aria-label="Remove attachment"
                onClick={() => setPendingImage(null)}
                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-slate-900 text-white"
              >
                <X className="size-3" />
              </button>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm"
          >
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            <button
              type="button"
              aria-label="Attach image"
              onClick={() => fileInputRef.current?.click()}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50"
            >
              <ImagePlus className="size-[18px] text-emerald-700" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your crop..."
              className="flex-1 bg-transparent px-3 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <button type="button" aria-label="Voice input" className="flex size-10 shrink-0 items-center justify-center text-slate-400">
              <Mic className="size-[18px]" />
            </button>
            <button
              type="submit"
              aria-label="Send message"
              disabled={!input.trim() && !pendingImage}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 shadow-lg disabled:opacity-40"
            >
              <ArrowRight className="size-4 text-white" />
            </button>
          </form>
          <p className="text-center text-[11px] text-slate-400">
            AgriSmart AI may produce inaccurate advice. Always verify critical decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
