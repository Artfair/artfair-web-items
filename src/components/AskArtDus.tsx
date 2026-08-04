"use client";

import { useEffect, useRef, useState } from "react";
import { withBase } from "../lib/assets";

type Lang = "de" | "en";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

// Labels selbsttragend im Regal (früher aus HOME_DICT der Startseite).
const DICT = {
  de: {
    askPlaceholder: "Ihre Frage an Art Düsseldorf …",
    quickQs: [
      "Wann beginnt das Talkprogramm am Freitag?",
      "Wie viele Galerien nehmen teil?",
      "Wie komme ich zum Skulpturenplatz S03?",
    ],
    botName: "Art Düsseldorf",
    botStatus: "Digitaler Concierge",
    launcherLabel: "Fragen Sie uns",
    botGreeting:
      "Hallo! Ich helfe Ihnen bei Tickets, Anreise, Öffnungszeiten und Programm. Was möchten Sie wissen?",
    botError:
      "Entschuldigung, gerade kann ich nicht antworten. Schreiben Sie uns gern an info@art-dus.de.",
    botCollapse: "Zur Seite einklappen",
    botClose: "Schließen",
    botSend: "Senden",
    botTyping: "Antwort wird geschrieben …",
  },
  en: {
    askPlaceholder: "Your question for Art Düsseldorf …",
    quickQs: [
      "When do the Friday talks begin?",
      "How many galleries take part?",
      "How do I get to sculpture plaza S03?",
    ],
    botName: "Art Düsseldorf",
    botStatus: "Digital concierge",
    launcherLabel: "Ask us anything",
    botGreeting:
      "Hi! I can help with tickets, getting here, opening hours and the program. What would you like to know?",
    botError:
      "Sorry, I can’t answer right now. Feel free to write to us at info@art-dus.de.",
    botCollapse: "Collapse to the side",
    botClose: "Close",
    botSend: "Send",
    botTyping: "Typing a reply …",
  },
} as const;

// „Frag uns" — Digitaler Concierge (Custom-Item): mitlaufendes Dock beim
// Scrollen, einklappbarer Lime-Tab, Chat-Panel. Antworten von /api/ask.
// `assetBase` löst Bild + API-Adresse auf (leer = lokal in AD27).
export default function AskArtDus({ lang, assetBase = "" }: { lang: Lang; assetBase?: string }) {
  const t = DICT[lang];
  const [chatOpen, setChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [heroDraft, setHeroDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 360);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    const history = [...msgs, { role: "user" as const, content: q }];
    setMsgs(history);
    setDraft("");
    setHeroDraft("");
    setChatOpen(true);
    setLoading(true);
    try {
      const res = await fetch(`${assetBase}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      const reply = res.ok && typeof data.reply === "string" ? data.reply : t.botError;
      setMsgs((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMsgs((prev) => [...prev, { role: "assistant", content: t.botError }]);
    } finally {
      setLoading(false);
    }
  };

  const showDock = scrolled && !chatOpen && !collapsed;
  const showTab = scrolled && !chatOpen && collapsed;

  const imageHead = (title: React.ReactNode, buttons: React.ReactNode, pad: string) => (
    <div className={`relative overflow-hidden flex items-center justify-between gap-2.5 ${pad}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBase("/images/home/ceramic.jpg", assetBase)}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[rgba(10,10,10,0.52)]" />
      <div className="relative flex items-center gap-[11px]">
        <span className="w-2.5 h-2.5 rounded-full bg-artdus-lime shrink-0" />
        {title}
      </div>
      <div className="relative flex items-center gap-1.5">{buttons}</div>
    </div>
  );

  const roundBtn = (label: string, onClick: () => void, char: string, size = "w-[30px] h-[30px] text-[15px]") => (
    <button
      onClick={onClick}
      aria-label={label}
      className={`${size} rounded-full bg-white/15 border border-white/50 text-white leading-none flex items-center justify-center cursor-pointer`}
    >
      {char}
    </button>
  );

  const chip = (q: string, onClick: () => void) => (
    <button
      key={q}
      onClick={onClick}
      className="text-[12.5px] leading-[1.3] text-artdus-black bg-white border border-artdus-black rounded-full px-[15px] py-[9px] text-left cursor-pointer hover:bg-artdus-black hover:text-white transition-colors"
    >
      {q}
    </button>
  );

  return (
    <>
      {showDock && (
        <div className="fixed right-[clamp(14px,2vw,26px)] bottom-[clamp(14px,2vw,26px)] z-[58] w-[min(430px,calc(100vw-28px))] bg-white border border-artdus-black rounded-[26px] overflow-hidden shadow-[0_26px_64px_rgba(0,0,0,0.24)] animate-dock-in">
          {imageHead(
            <span className="leading-[1.12]">
              <span className="block font-medium text-[17px] text-white">{t.launcherLabel}</span>
              <span className="block text-[10px] font-semibold tracking-[0.13em] uppercase text-white/70">
                {t.botStatus}
              </span>
            </span>,
            <>
              {roundBtn(t.botCollapse, () => setCollapsed(true), "›", "w-[30px] h-[30px] text-[17px]")}
              {roundBtn(t.botClose, () => setCollapsed(true), "×")}
            </>,
            "px-3.5 py-[15px] pl-4",
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(heroDraft);
            }}
            className="px-3.5 pt-3.5 pb-2.5"
          >
            <div className="flex items-center gap-1.5 border border-artdus-black rounded-full p-[5px] pl-[18px]">
              <input
                value={heroDraft}
                onChange={(e) => setHeroDraft(e.target.value)}
                placeholder={t.askPlaceholder}
                aria-label={t.askPlaceholder}
                className="flex-1 min-w-0 text-[15px] py-[9px] outline-none bg-transparent text-artdus-black placeholder:text-neutral-500"
              />
              <button
                type="submit"
                aria-label={t.botSend}
                className="w-[42px] h-[42px] rounded-full text-[17px] text-white bg-artdus-black shrink-0 cursor-pointer flex items-center justify-center"
              >
                →
              </button>
            </div>
          </form>
          <div className="flex flex-wrap gap-2 px-3.5 pb-4">
            {t.quickQs.map((q) => chip(q, () => send(q)))}
          </div>
        </div>
      )}

      {showTab && (
        <button
          onClick={() => setCollapsed(false)}
          aria-label={`${t.launcherLabel} öffnen`}
          className="fixed right-3.5 top-1/2 -translate-y-1/2 z-[59] bg-artdus-lime text-artdus-black rounded-full px-[15px] py-[26px] flex flex-col items-center cursor-pointer animate-tab-in shadow-[0_8px_20px_rgba(0,0,0,0.22),0_26px_60px_rgba(0,0,0,0.32)] transition-transform hover:-translate-x-1.5"
        >
          <span className="[writing-mode:vertical-rl] rotate-180 font-semibold text-[15px] tracking-[0.1em] uppercase">
            {t.launcherLabel}
          </span>
        </button>
      )}

      {chatOpen && (
        <div className="fixed right-[clamp(14px,2vw,26px)] bottom-[clamp(14px,2vw,26px)] z-[60] w-[min(376px,calc(100vw-28px))] h-[min(560px,74vh)] bg-white border border-artdus-black rounded-[28px] overflow-hidden flex flex-col shadow-[0_30px_70px_rgba(0,0,0,0.24)] animate-chat-pop">
          {imageHead(
            <span className="leading-[1.12]">
              <span className="block font-light text-[21px] text-white">{t.botName}</span>
              <span className="block text-[10px] font-semibold tracking-[0.13em] uppercase text-white/70">
                {t.botStatus}
              </span>
            </span>,
            roundBtn(t.botClose, () => setChatOpen(false), "×", "w-8 h-8 text-base"),
            "px-4 py-[18px] pl-[18px]",
          )}
          <div role="log" aria-live="polite" className="flex-1 overflow-y-auto px-4 py-[18px] flex flex-col gap-2.5">
            <div className="self-start max-w-[86%] bg-[#f4f4f2] text-artdus-black text-sm leading-[1.45] px-[15px] py-3 rounded-[20px_20px_20px_6px]">
              {t.botGreeting}
            </div>
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[86%] text-sm leading-[1.45] px-[15px] py-3 whitespace-pre-line ${
                  m.role === "user"
                    ? "self-end bg-artdus-black text-white rounded-[20px_20px_6px_20px]"
                    : "self-start bg-[#f4f4f2] text-artdus-black rounded-[20px_20px_20px_6px]"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div
                role="status"
                aria-label={t.botTyping}
                className="self-start max-w-[86%] bg-[#f4f4f2] text-neutral-600 text-sm px-[15px] py-3 rounded-[20px_20px_20px_6px] animate-pulse"
              >
                …
              </div>
            )}
            {msgs.length === 0 && (
              <div className="flex flex-wrap gap-2 mt-1.5">{t.quickQs.map((q) => chip(q, () => send(q)))}</div>
            )}
            <div ref={bottomRef} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="px-3.5 pt-3 pb-4"
          >
            <div className="flex items-center gap-1.5 border border-artdus-black rounded-full p-[5px] pl-[17px]">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t.askPlaceholder}
                aria-label={t.askPlaceholder}
                className="flex-1 min-w-0 text-sm py-2 outline-none bg-transparent text-artdus-black placeholder:text-neutral-500"
              />
              <button
                type="submit"
                aria-label={t.botSend}
                disabled={loading}
                className="w-[38px] h-[38px] rounded-full text-base text-white bg-artdus-black shrink-0 cursor-pointer flex items-center justify-center disabled:opacity-40"
              >
                →
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
