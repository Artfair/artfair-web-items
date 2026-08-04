"use client";

import { useState } from "react";

type Lang = "de" | "en";

// Newsletter-Anmeldung (noch ohne Backend — Bestätigung rein clientseitig,
// wie die bisherige Footer-Anmeldung). Selbsttragend im Regal: die Labels je
// Sprache stehen inline (früher aus HOME_DICT der Startseite).
export default function NewsletterForm({ lang }: { lang: Lang }) {
  const [done, setDone] = useState(false);
  const placeholder = lang === "de" ? "E-Mail-Adresse" : "Email address";
  const button = lang === "de" ? "Anmelden" : "Sign up";

  if (done) {
    return (
      <p className="text-[15px] text-neutral-600">
        {lang === "de" ? "Danke! Wir melden uns." : "Thank you! We’ll be in touch."}
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className="flex flex-wrap gap-2.5 justify-center max-w-[520px] mx-auto"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        {placeholder}
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        autoComplete="email"
        placeholder={placeholder}
        className="flex-[1_1_240px] min-w-0 text-[15px] text-artdus-black px-[18px] py-[15px] border border-artdus-black bg-white outline-none placeholder:text-neutral-500"
      />
      <button
        type="submit"
        className="text-sm font-medium tracking-[0.03em] text-white bg-artdus-black px-[30px] py-[15px] cursor-pointer"
      >
        {button}
      </button>
    </form>
  );
}
