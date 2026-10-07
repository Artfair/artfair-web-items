// Rahmen jeder Magazin-Seite: Masthead mit großem Titel, Navigation, Inhalt.
// Aus AD27 (app/[lang]/magazine/layout.tsx) übernommen.
export function MagRahmen({ titel, nav, children }: { titel: string; nav: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="magazine-theme">
      <div className="mag-wrap">
        <header className="mag-masthead">
          <h1 className="mag-masthead__title">{titel}</h1>
        </header>

        {nav}
        {children}
      </div>
    </div>
  );
}
