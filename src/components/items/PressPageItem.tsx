"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { InfoHeaderItem } from "./InfoHeaderItem";

// „Presse-Seite" — die GANZE Presseseite als EIN Baukasten-Item (Muster
// FaqPageItem/AboutPageItem). Löst die in AD27 fest verdrahtete Presse-Route
// ab, damit Stand, Mitteilungen und Downloads in Webby gepflegt werden können.
// Design-Entscheidungen (Annalena 29.8.2026):
//   – Header ohne Eyebrow und ohne Presskit-Knopf (Header-Typ 4 reduziert);
//     Meta-Zeile bleibt („Stand: 2026" ohne Monat, Pressekontakt)
//   – Pressemitteilungen per CMS komplett ausblendbar — erscheinen erst
//     wieder, wenn es tatsächlich neue Mitteilungen gibt
//   – Akkreditierung vorerst KOMPLETT raus (kommt erst 2027 mit dem Formular
//     zurück): die Sektion rendert nur, wenn Text oder CTA gepflegt sind —
//     und dann OHNE Rahmen-Box (Look passte nicht), nur Überschrift + Text
//   – Pressemappen OHNE Rahmen-Box: Liste mit Lime-Quadrat-Bullets; Einträge
//     mit Link sind klickbar (extern in neuem Tab), ohne Link reiner Text
//   – Pressekontakt als Karten-Paar im Look der Über-uns-Adressen (Lime-Box +
//     Schwarz-Box nebeneinander, Karten wechseln die Töne der Reihe nach)
//   – Presseverteiler-Formular (Annalena 29.8., dritte Runde): E-Mail +
//     Pflicht-Consent, POST an `signup.action` (Brevo-Double-Opt-in wie die
//     Newsletter-Anmeldung, eigene Brevo-Liste); ohne action clientseitige
//     Bestätigung (Webby-Vorschau). Versand-Muster wie NewsletterPageItem.
// Typo-Stufen aus der Über-uns-Skala wiederverwendet (H2/H3/Body/Label);
// Telefon/E-Mail in Weissenhof Light 15px, KEINE Geist Mono (v0.14.16).

export interface PressRelease {
  date?: string; // z. B. „12. März 2027" oder „Demnächst"
  title: string;
  teaser?: string;
  href?: string; // optional: Link zur Mitteilung (PDF/Magazin-Artikel)
}

export interface PressDownload {
  label: string; // z. B. „Pressefotos"
  href?: string; // leer = unverlinkter Eintrag, z. B. „Logo-Paket (Demnächst)"
}

export interface PressContact {
  label: string; // Versal-Label, z. B. „Allgemeine Presseanfragen"
  name: string; // z. B. „Kathrin Luz"
  lines?: string; // Firma + Adresse, mehrzeilig
  phone?: string; // Anzeige-Text, z. B. „M +49 171 310 24 72"
  email?: string;
}

export interface PressSignup {
  heading: string; // z. B. „Presseverteiler."
  body?: string; // kurzer Text über dem Formular
  language: "de" | "en"; // geht als FormData-Feld mit (Brevo-Attribut LANGUAGE)
  namePlaceholder: string; // z. B. „Name"
  emailPlaceholder: string;
  mediumPlaceholder: string; // z. B. „Medium/Redaktion"
  submitLabel: string;
  consentText: string; // Zweck-Text der Checkbox („Ich möchte Pressemitteilungen …")
  privacyIntro: string; // Überleitung zum Datenschutz-Link („Hinweise zur Verarbeitung in der")
  privacyHref: string; // gern mit Anker auf die Verteiler-Ziffer, z. B. /datenschutz#presseverteiler
  privacyLabel: string;
  confirmation: string; // nach erfolgreichem Versand (Double-Opt-in-Hinweis)
  errorText: string;
  action?: string; // POST-Ziel (name + email + medium + language + consent); ohne: clientseitige Bestätigung
}

// Verteiler-Formular als eigene Client-Teilkomponente, damit der Formular-
// Zustand (gesendet/Fehler) nicht die ganze Seite neu rendert.
function SignupForm({ s }: { s: PressSignup }) {
  const uid = useId();
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function submit(form: HTMLFormElement) {
    if (!s.action) {
      setDone(true);
      return;
    }
    setSending(true);
    setFailed(false);
    try {
      const res = await fetch(s.action, { method: "POST", body: new FormData(form) });
      if (!res.ok) throw new Error(String(res.status));
      setDone(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <p role="status" className="flex items-start gap-3 text-[17px] leading-[1.6] mt-[clamp(20px,2.2vw,32px)]">
        <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime shrink-0 mt-[9px]" />
        {s.confirmation}
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit(e.currentTarget);
      }}
      className="max-w-[640px] mt-[clamp(20px,2.2vw,32px)]"
    >
      {/* Name + E-Mail nebeneinander (ab 2 Spalten Platz), Medium/Redaktion
          in voller Breite darunter — alle drei Pflichtfelder. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label htmlFor={`${uid}-name`} className="sr-only">
          {s.namePlaceholder}
        </label>
        <input
          id={`${uid}-name`}
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder={s.namePlaceholder}
          className={INPUT}
        />
        <label htmlFor={`${uid}-email`} className="sr-only">
          {s.emailPlaceholder}
        </label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={s.emailPlaceholder}
          className={INPUT}
        />
        <label htmlFor={`${uid}-medium`} className="sr-only">
          {s.mediumPlaceholder}
        </label>
        <input
          id={`${uid}-medium`}
          name="medium"
          type="text"
          required
          autoComplete="organization"
          placeholder={s.mediumPlaceholder}
          className={`${INPUT} sm:col-span-2`}
        />
      </div>
      <input type="hidden" name="language" value={s.language} />
      {/* Aktive Einwilligung mit eigenem Zweck-Text (Annalena 29.8.) — NICHT
          vorausgefüllt; ohne Häkchen blockt die native required-Validierung
          das Absenden. Double-Opt-in passiert serverseitig (Brevo). */}
      <label className="flex items-start gap-3 max-w-[560px] mt-5 cursor-pointer select-none">
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
        <span className="text-[14px] leading-[1.6] text-neutral-600">
          {s.consentText}{" "}
          <span className="text-[13px] text-neutral-500">
            {s.privacyIntro}{" "}
            <a href={s.privacyHref} className="underline underline-offset-[3px] hover:text-artdus-black">
              {s.privacyLabel}
            </a>
            .
          </span>
        </span>
      </label>
      {failed && (
        <p role="alert" className="text-[14px] leading-[1.5] text-artdus-red mt-4">
          {s.errorText}
        </p>
      )}
      <button
        type="submit"
        disabled={sending}
        className="mt-6 text-[13px] font-medium tracking-[0.14em] uppercase text-white bg-artdus-black px-[30px] py-[14px] cursor-pointer disabled:opacity-60 disabled:cursor-wait"
      >
        {s.submitLabel}
      </button>
    </form>
  );
}

const H2 = "font-light text-[clamp(30px,3.4vw,52px)] leading-[1.06] tracking-[-0.02em]";
const BODY = "text-[clamp(17px,1.4vw,20px)] leading-[1.62] text-neutral-600";
const LABEL = "text-[13px] font-semibold tracking-[0.14em] uppercase text-neutral-500";
const INPUT =
  "min-w-0 text-[15px] text-artdus-black px-[18px] py-[14px] border border-artdus-black bg-white outline-none placeholder:text-neutral-500 focus:border-artdus-lime focus:ring-1 focus:ring-artdus-lime";

// Externe Ziele (Downloads, Presse-Ordner) in neuem Tab, interne im selben.
function SmartLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  const external = /^https?:/.test(href);
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function PressPageItem({
  id,
  title,
  intro,
  meta,
  releasesHeading,
  releases,
  accreditationHeading,
  accreditationBody,
  accreditationCta,
  downloadsHeading,
  downloads,
  signup,
  contactsHeading,
  contacts,
}: {
  id?: string;
  title: string; // H1, z. B. „Presse."
  intro?: string;
  meta?: string[]; // Meta-Zeile unter der Haarlinie, z. B. „Stand: 2026"
  releasesHeading: string;
  releases: PressRelease[]; // leer = Sektion entfällt komplett
  accreditationHeading: string;
  accreditationBody?: string; // mehrzeilig, Absätze mit \n
  accreditationCta?: { label: string; href: string }; // später: Formular-Link
  downloadsHeading: string;
  downloads: PressDownload[]; // leer = Sektion entfällt komplett
  signup?: PressSignup; // Presseverteiler-Formular; fehlt = Sektion entfällt
  contactsHeading: string;
  contacts: PressContact[]; // Karten wechseln Lime/Schwarz; leer = Sektion entfällt
}) {
  return (
    <section id={id}>
      <InfoHeaderItem title={title} body={intro} meta={meta} />

      <div className="px-[var(--page-x)] pb-[clamp(64px,8vw,128px)]">
        <div className="max-w-[880px]">
          {releases.length > 0 && (
            <div className="mt-[clamp(32px,4vw,56px)]">
              <h2 className={H2}>{releasesHeading}</h2>
              <ul className="mt-[clamp(24px,2.8vw,40px)]">
                {releases.map((r) => (
                  <li key={r.title} className="border-b border-neutral-200 py-[clamp(20px,2.2vw,32px)] first:pt-0">
                    {r.date && <span className={`${LABEL} block mb-2.5`}>{r.date}</span>}
                    <h3 className="text-[clamp(20px,1.8vw,26px)] font-normal leading-[1.15]">
                      {r.href ? (
                        <SmartLink
                          href={r.href}
                          className="underline decoration-artdus-lime decoration-2 underline-offset-4 hover:bg-artdus-lime transition-colors"
                        >
                          {r.title}
                        </SmartLink>
                      ) : (
                        r.title
                      )}
                    </h3>
                    {r.teaser && <p className={`${BODY} mt-2.5 max-w-[64ch]`}>{r.teaser}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(accreditationBody || accreditationCta) && (
          <div className="mt-[clamp(48px,6vw,88px)]">
            <h2 className={H2}>{accreditationHeading}</h2>
            {accreditationBody && (
              <p className={`${BODY} mt-[clamp(16px,1.9vw,28px)] max-w-[64ch] whitespace-pre-line`}>
                {accreditationBody}
              </p>
            )}
            {accreditationCta && (
              <SmartLink
                href={accreditationCta.href}
                className="inline-flex items-center gap-2 bg-artdus-black text-white text-[13px] font-medium tracking-[0.14em] uppercase px-[28px] py-[15px] whitespace-nowrap mt-[clamp(24px,2.5vw,36px)]"
              >
                {accreditationCta.label}
              </SmartLink>
            )}
          </div>
          )}

          {downloads.length > 0 && (
            <div className="mt-[clamp(48px,6vw,88px)]">
              <h2 className={H2}>{downloadsHeading}</h2>
              <ul className="mt-[clamp(20px,2.2vw,32px)] space-y-[14px]">
                {downloads.map((d) => (
                  <li key={d.label} className="flex items-center gap-3">
                    <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime shrink-0" />
                    {d.href ? (
                      <SmartLink
                        href={d.href}
                        className="text-[clamp(17px,1.4vw,20px)] leading-[1.4] underline decoration-artdus-lime decoration-2 underline-offset-4 hover:bg-artdus-lime transition-colors"
                      >
                        {d.label}
                      </SmartLink>
                    ) : (
                      <span className={`${BODY} leading-[1.4]`}>{d.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Presseverteiler: Aufnahme in den Verteiler, Brevo-Double-Opt-in
              wie die Newsletter-Anmeldung (eigene Liste). */}
          {signup && (
            <div className="mt-[clamp(48px,6vw,88px)]">
              <h2 className={H2}>{signup.heading}</h2>
              {signup.body && (
                <p className={`${BODY} mt-[clamp(16px,1.9vw,28px)] max-w-[64ch] whitespace-pre-line`}>
                  {signup.body}
                </p>
              )}
              <SignupForm s={signup} />
            </div>
          )}
        </div>

        {/* Pressekontakt: Karten-Paar im Look der Über-uns-Adressen — volle
            Breite, Karten wechseln Lime/Schwarz der Reihe nach. */}
        {contacts.length > 0 && (
          <div className="mt-[clamp(48px,6vw,88px)]">
            <h2 className={`${H2} mb-[clamp(28px,3.5vw,48px)]`}>{contactsHeading}</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] gap-6">
              {contacts.map((c, i) => {
                const dark = i % 2 === 1;
                return (
                  <address
                    key={c.name || i}
                    className={`not-italic px-10 pt-11 pb-12 min-h-[320px] flex flex-col ${
                      dark ? "bg-artdus-black text-white" : "bg-artdus-lime text-artdus-black"
                    }`}
                  >
                    <span className="text-[13px] font-semibold tracking-[0.14em] uppercase">
                      {c.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`block h-px mt-5 mb-8 ${dark ? "bg-artdus-lime" : "bg-artdus-black"}`}
                    />
                    <span className="block font-light text-[clamp(28px,2.6vw,40px)] leading-[1.06] tracking-[-0.02em] whitespace-pre-line">
                      {c.name}
                    </span>
                    <span className="mt-auto pt-8 flex flex-wrap justify-between items-end gap-x-10 gap-y-6">
                      {c.lines && (
                        <span
                          className={`block text-[17px] leading-[1.62] whitespace-pre-line ${
                            dark ? "text-neutral-300" : ""
                          }`}
                        >
                          {c.lines}
                        </span>
                      )}
                      {(c.phone || c.email) && (
                        <span className="flex flex-col items-start gap-[5px] font-light text-[15px]">
                          {c.phone && (
                            <a
                              href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}
                              className="hover:underline underline-offset-[3px]"
                            >
                              {c.phone}
                            </a>
                          )}
                          {c.email && (
                            <a
                              href={`mailto:${c.email}`}
                              className="hover:underline underline-offset-[3px]"
                            >
                              {c.email}
                            </a>
                          )}
                        </span>
                      )}
                    </span>
                  </address>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
