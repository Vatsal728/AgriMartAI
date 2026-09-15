"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Globe, ChevronRight, Info, ImagePlus, Mic, ArrowRight, Leaf, X, MessageSquarePlus, RotateCcw } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";
import { AgriSmartAPI } from "@/lib/api";
import { getUserProfile, subscribeUserProfile } from "@/lib/user";

type Message = {
  id: number;
  from: "user" | "bot";
  text?: TranslationKey;
  rawText?: string;
  image?: string;
  diagnosis?: { label: TranslationKey; confidence: TranslationKey };
  source?: TranslationKey;
  rawSource?: string;
};

const CHAT_SESSION_STORAGE_KEY = "chat-session-id";
let nextId = 100;

const initialWelcomeMessages: Message[] = [
  {
    id: 1,
    from: "bot",
    rawText: "🌱 **Welcome to AgriSmart AI Agronomist!**\n\nI can assist you with:\n• **Crop Disease Diagnosis**: Upload or drop any crop leaf photo.\n• **Treatment & Spray Planning**: Chemical and bio-fungicide dosage schedules.\n• **Soil, Irrigation & Weather Guidance**: Live sensor & satellite advisory.\n\n*How can I help your farm today?*",
    rawSource: "AgriSmart AI Multimodal Core",
  },
];

function formatInline(str: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-bold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="italic text-slate-800">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts.length > 0 ? parts : str;
}

function renderFormattedChatText(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={idx} className="h-2" />);
      return;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={idx} className="font-heading text-base font-bold text-slate-900 mt-2 mb-1">
          {formatInline(trimmed.replace(/^###\s+/, ""))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("#### ")) {
      elements.push(
        <h4 key={idx} className="font-heading text-sm font-bold text-slate-800 mt-1.5 mb-1">
          {formatInline(trimmed.replace(/^####\s+/, ""))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const content = trimmed.replace(/^[•\-\*]\s+/, "");
      elements.push(
        <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-600" />
          <span className="text-[14px] leading-relaxed text-slate-700">{formatInline(content)}</span>
        </div>
      );
      return;
    }

    if (trimmed.startsWith("> ")) {
      elements.push(
        <div key={idx} className="rounded-xl border-l-4 border-emerald-500 bg-emerald-50/70 p-3 my-1.5 text-xs text-emerald-900 font-medium">
          {formatInline(trimmed.replace(/^>\s+/, ""))}
        </div>
      );
      return;
    }

    elements.push(
      <p key={idx} className="text-[14px] leading-relaxed text-slate-700 py-0.5">
        {formatInline(trimmed)}
      </p>
    );
  });

  return <div className="flex flex-col gap-0.5">{elements}</div>;
}

export default function ChatAssistantPage() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(initialWelcomeMessages);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [userName, setUserName] = useState("Desai Vatshal");
  const [avatarSrc, setAvatarSrc] = useState("/images/profile-avatar.png");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncUser = () => {
      const profile = getUserProfile();
      setUserName(profile.name);
      setAvatarSrc(profile.avatar);
    };
    syncUser();
    const unsubscribe = subscribeUserProfile(syncUser);

    const storedSession = sessionStorage.getItem(CHAT_SESSION_STORAGE_KEY);
    if (storedSession) {
      setSessionId(storedSession);
      AgriSmartAPI.getSessionDetail(storedSession)
        .then((detail) => {
          if (detail && Array.isArray(detail.messages) && detail.messages.length > 0) {
            const restored: Message[] = detail.messages.map((m: any, idx: number) => ({
              id: idx + 10,
              from: m.role === "assistant" ? "bot" : "user",
              rawText: m.content,
              image: m.image_path ? (m.image_path.startsWith("/") ? m.image_path : `/uploads/${m.image_path}`) : undefined,
              rawSource: m.source || undefined,
            }));
            setMessages(restored);
          }
        })
        .catch(() => {});
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const sendMessage = () => {
    if (!input.trim() && !pendingImage) return;
    const query = input.trim();
    const currentImg = pendingImage;
    const currentFile = pendingFile;
    const userMsg: Message = {
      id: nextId++,
      from: "user",
      rawText: query || undefined,
      image: currentImg || undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setPendingImage(null);
    setPendingFile(null);
    setSending(true);

    if (currentFile) {
      const formData = new FormData();
      formData.append("file", currentFile, currentFile.name);
      formData.append("model_type", "efficientnet");
      if (sessionId) formData.append("session_id", sessionId);
      if (query) formData.append("user_prompt", query);

      AgriSmartAPI.diagnoseLeaf(formData)
        .then((res) => {
          if (res.session_id) {
            setSessionId(res.session_id);
            sessionStorage.setItem(CHAT_SESSION_STORAGE_KEY, res.session_id);
          }
          const diag = res.prediction;
          const adv = res.advisory;
          const summary = (adv as any).conversational_summary || (adv as any).precautions || "";
          const sourceStr = String((adv as any).rag_knowledge?.source || "AgriSmart AI Vision & RAG Expert");
          const botReply = `🩺 **Diagnosis Result: ${diag.disease}** (${Math.round(diag.confidence * 100)}% Confidence)\n\n${summary}\n\n**Action Steps:**\n${res.diagnosis_record?.recommended_treatment || "Follow standard management protocol."}`;
          setMessages((prev) => [
            ...prev,
            {
              id: nextId++,
              from: "bot",
              rawText: botReply,
              rawSource: sourceStr,
            },
          ]);
        })
        .catch((err) => {
          setMessages((prev) => [
            ...prev,
            {
              id: nextId++,
              from: "bot",
              rawText: `Diagnosed image with multimodal engine. Please check the Scan Leaf tab for full 3-part treatment options.`,
              rawSource: "AgriSmart Vision System",
            },
          ]);
        })
        .finally(() => setSending(false));
      return;
    }

    AgriSmartAPI.sendMessage(query, sessionId)
      .then((res) => {
        setSessionId(res.session_id);
        sessionStorage.setItem(CHAT_SESSION_STORAGE_KEY, res.session_id);
        setMessages((prev) => [...prev, { id: nextId++, from: "bot", rawText: res.response, rawSource: res.source }]);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          { id: nextId++, from: "bot", text: "chatAssistant.reply.followUp", source: "chatAssistant.source" },
        ]);
      })
      .finally(() => setSending(false));
  };

  const handleNewChat = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(CHAT_SESSION_STORAGE_KEY);
    }
    setSessionId(undefined);
    setMessages(initialWelcomeMessages);
    setInput("");
    setPendingImage(null);
    setPendingFile(null);
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] flex-col lg:min-h-0">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-5 sm:px-10">
        <div className="flex items-center gap-4">
          <h1 className="font-heading text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {t("chatAssistant.title")}
          </h1>
          <button
            type="button"
            onClick={handleNewChat}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm transition-all hover:bg-emerald-100 active:scale-95"
            title="Start a fresh conversation"
          >
            <RotateCcw className="size-3.5 text-emerald-700" />
            <span>New Chat</span>
          </button>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <button type="button" className="hidden items-center gap-2 sm:flex">
            <Globe className="size-[18px] text-slate-500" />
            <span className="text-sm font-medium text-text-muted">{language.toUpperCase()}</span>
          </button>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4 sm:pl-6">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-slate-900">{userName}</p>
              <p className="text-xs text-text-muted">{t("chatAssistant.farmOwner")}</p>
            </div>
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-500/20">
              <Image 
                src={avatarSrc} 
                alt={userName} 
                fill 
                sizes="40px" 
                unoptimized={avatarSrc.startsWith("blob:") || avatarSrc.startsWith("data:")}
                className="object-cover" 
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-8 sm:px-10 lg:px-44">
        <div className="mx-auto flex w-full max-w-[800px] flex-col gap-8">
          {messages.map((m) =>
            m.from === "user" ? (
              <div key={m.id} className="flex flex-col items-end">
                <div className={`flex flex-col gap-2.5 rounded-2xl bg-emerald-700 p-3.5 shadow-sm text-white ${m.image ? "w-[260px] sm:w-[300px]" : "max-w-[340px]"}`}>
                  {m.image && (
                    <div className="relative h-[180px] w-full overflow-hidden rounded-xl border border-white/20 shadow-inner bg-emerald-800">
                      <Image 
                        src={m.image} 
                        alt={t("chatAssistant.uploadedPhotoAlt")} 
                        fill 
                        sizes="300px" 
                        className="object-cover" 
                        unoptimized 
                      />
                    </div>
                  )}
                  {(m.rawText || m.text) ? (
                    <p className="text-[14px] leading-relaxed text-white">{m.rawText ?? (m.text && t(m.text))}</p>
                  ) : m.image ? (
                    <p className="text-xs font-medium text-emerald-100/90 italic">📸 Uploaded leaf photo</p>
                  ) : null}
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
                          {t(m.diagnosis.label)}
                        </span>
                        <span className="text-sm font-bold text-emerald-600">{t(m.diagnosis.confidence)}</span>
                      </div>
                    )}
                    {(m.rawText || m.text) && (
                      <div className="text-[14.5px] leading-relaxed text-slate-800">
                        {renderFormattedChatText(m.rawText ?? (m.text ? t(m.text) : ""))}
                      </div>
                    )}
                    {m.diagnosis && (
                      <Link href="/scan-leaf/treatment-advice" className="flex w-fit items-center gap-1.5 text-sm font-bold text-emerald-600">
                        {t("scanLeaf.result.viewFullAdvice")}
                        <ChevronRight className="size-3.5" />
                      </Link>
                    )}
                  </div>
                  {(m.rawSource || m.source) && (
                    <div className="flex items-center gap-1.5 pl-1 text-[11px] text-slate-400">
                      <Info className="size-2.5" />
                      {t("chatAssistant.sourcePrefix")} {m.rawSource ?? (m.source && t(m.source))}
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
                <Image src={pendingImage} alt={t("chatAssistant.attachedPreviewAlt")} fill sizes="64px" className="object-cover" unoptimized />
              </div>
              <button
                type="button"
                aria-label={t("chatAssistant.removeAttachment")}
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
              aria-label={t("chatAssistant.attachImage")}
              onClick={() => fileInputRef.current?.click()}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50"
            >
              <ImagePlus className="size-[18px] text-emerald-700" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chatAssistant.inputPlaceholder")}
              className="flex-1 bg-transparent px-3 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <button type="button" aria-label={t("chatAssistant.voiceInput")} className="flex size-10 shrink-0 items-center justify-center text-slate-400">
              <Mic className="size-[18px]" />
            </button>
            <button
              type="submit"
              aria-label={t("chatAssistant.sendMessage")}
              disabled={!input.trim() && !pendingImage}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 shadow-lg disabled:opacity-40"
            >
              <ArrowRight className="size-4 text-white" />
            </button>
          </form>
          <p className="text-center text-[11px] text-slate-400">{t("chatAssistant.disclaimer")}</p>
        </div>
      </div>
    </div>
  );
}
