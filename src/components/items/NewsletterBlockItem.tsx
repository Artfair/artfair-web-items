import NewsletterForm from "../NewsletterForm";

// Baukasten-Item „Newsletter" — zentrierter Block mit Überschrift, Text und
// dem festen Anmeldeformular. 1:1 aus der Startseite herausgelöst. Das Formular
// selbst bleibt fix (Marke/Funktion); editierbar sind nur Überschrift und Text.

export function NewsletterBlockItem({
  lang,
  title,
  body,
}: {
  lang: "de" | "en";
  title: string;
  body: string;
}) {
  return (
    <section id="newsletter" className="px-[var(--page-x)] py-[clamp(60px,9vw,140px)] text-center scroll-mt-14">
      <h2 className="font-light text-[clamp(36px,6vw,80px)] leading-[0.98] tracking-[-0.02em] max-w-[16ch] mx-auto mb-4">
        {title}
      </h2>
      <p className="text-[clamp(15px,1.3vw,18px)] text-neutral-600 max-w-[44ch] mx-auto mb-[34px] leading-normal">
        {body}
      </p>
      <NewsletterForm lang={lang} />
    </section>
  );
}
