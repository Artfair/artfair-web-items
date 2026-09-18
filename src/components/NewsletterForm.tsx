"use client";

import { useState } from "react";
import { BotShieldFields } from "./BotShieldFields";

type Lang = "de" | "en";

// Newsletter-Anmeldung → POST /api/newsletter (Brevo, Double-Opt-in). Gleicher
// Kontrakt wie das Formular der Newsletter-Anmeldeseite (NewsletterPageItem):
// FormData mit email + language + consent ("on"); 2xx = Bestätigung anzeigen.
// Vorher war dieser Block eine Attrappe (nur clientseitige Bestätigung, nichts
// wurde gesendet) — jetzt echte Anmeldung inkl. Pflicht-Checkbox (aktive
// Einwilligung, wie auf der Anmeldeseite; ohne Häkchen blockt required).
export default function NewsletterForm({
  lang,
  action = "/api/newsletter",
  privacyHref,
}: {
  lang: Lang;
  action?: string;
  // Ziel des Datenschutz-Links; Default: /<lang>/datenschutz (beide Sprachen
  // nutzen den deutschen Slug, siehe Footer).
  privacyHref?: string;
}) {
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const de = lang === "de";
  const placeholder = de ? "E-Mail-Adresse" : "Email address";
  const button = de ? "Anmelden" : "Sign up";
  const privacy = privacyHref ?? `/${lang}/datenschutz`;

  if (done) {
    return (
      <p className="text-[15px] text-neutral-600">
        {de
          ? "Fast geschafft! Bitte bestätigen Sie Ihre Anmeldung über den Link in Ihrem Postfach."
          : "Almost there! Please confirm your signup via the link in your inbox."}
      </p>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setSending(true);
        setFailed(false);
        try {
          const res = await fetch(action, { method: "POST", body: new FormData(form) });
          if (!res.ok) throw new Error(String(res.status));
          setDone(true);
        } catch {
          setFailed(true);
        } finally {
          setSending(false);
        }
      }}
      className="max-w-[520px] mx-auto"
    >
      <div className="flex flex-wrap gap-2.5 justify-center">
        <label htmlFor="newsletter-email" className="sr-only">
          {placeholder}
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={placeholder}
          className="flex-[1_1_240px] min-w-0 text-[15px] text-artdus-black px-[18px] py-[15px] border border-artdus-black bg-white outline-none placeholder:text-neutral-500"
        />
        <button
          type="submit"
          disabled={sending}
          className="text-sm font-medium tracking-[0.03em] text-white bg-artdus-black px-[30px] py-[15px] cursor-pointer disabled:opacity-60 disabled:cursor-wait"
        >
          {button}
        </button>
      </div>
      <input type="hidden" name="language" value={lang} />
      <BotShieldFields action={action} />
      {failed && (
        <p role="alert" className="text-[14px] leading-[1.5] text-artdus-red mt-4 text-center">
          {de
            ? "Das hat leider nicht geklappt — bitte versuchen Sie es später erneut."
            : "Something went wrong — please try again later."}
        </p>
      )}
      <label className="flex items-start justify-center gap-3 mt-5 text-left cursor-pointer select-none">
        <span className="relative inline-flex shrink-0 mt-[2px]">
          <input
            type="checkbox"
            name="consent"
            required
            className="peer appearance-none w-[18px] h-[18px] border border-artdus-black bg-white checked:bg-artdus-black cursor-pointer focus-visible:outline-none focus-visible:border-artdus-lime focus-visible:ring-1 focus-visible:ring-artdus-lime"
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 12 12"
            fill="none"
            className="pointer-events-none absolute inset-0 m-auto w-[11px] h-[11px] opacity-0 peer-checked:opacity-100 text-white"
          >
            <path d="M2 6.5L4.8 9.2 10 3.5" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </span>
        <span className="text-[13px] leading-[1.6] text-neutral-500">
          {de
            ? "Ich möchte den Newsletter der Art Düsseldorf erhalten. Hinweise zum Widerruf in der"
            : "I would like to receive the Art Düsseldorf newsletter. Details on withdrawal in the"}{" "}
          <a href={privacy} className="underline underline-offset-[3px] hover:text-artdus-black">
            {de ? "Datenschutzerklärung" : "privacy policy"}
          </a>
          .
        </span>
      </label>
    </form>
  );
}
