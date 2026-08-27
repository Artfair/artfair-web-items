"use client";

import { usePathname } from "next/navigation";

export default function Chrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");
  const isEn = pathname?.startsWith("/en");
  // Linkseite für die Instagram-Bio (LinkHubItem, sitePage /links): eigen-
  // ständige schwarze Seite OHNE Header/Footer — die Bio-Besucher sollen
  // die Buttons sehen, nicht das Website-Menü.
  const isBare = /^\/(de\/|en\/)?links\/?$/.test(pathname ?? "");

  if (isStudio || isBare) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-artdus-black focus:text-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium"
      >
        {isEn ? "Skip to content" : "Zum Inhalt springen"}
      </a>
      {header}
      <main id="inhalt" className="flex-1">
        {children}
      </main>
      {footer}
    </>
  );
}
