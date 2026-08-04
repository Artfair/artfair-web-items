import { TickerItem } from "./items/TickerItem";
import { SpacerItem } from "./items/SpacerItem";
import { HeroSplitItem } from "./items/HeroSplitItem";
import { FactsRowItem } from "./items/FactsRowItem";
import { CtaBandItem } from "./items/CtaBandItem";
import { TextCtaItem } from "./items/TextCtaItem";
import { FairPlanItem } from "./items/FairPlanItem";
import { NumberedBlocksItem } from "./items/NumberedBlocksItem";
import { CardTrioItem } from "./items/CardTrioItem";
import { LogoGridItem } from "./items/LogoGridItem";
import { WelcomePanelItem } from "./items/WelcomePanelItem";
import { AdvertorialCardsItem } from "./items/AdvertorialCardsItem";
import { NavMosaicItem } from "./items/NavMosaicItem";
import { LogoMarqueeItem } from "./items/LogoMarqueeItem";
import { MagazineStripItem, type MagCard } from "./items/MagazineStripItem";
import { ThemesSection } from "./ThemesSection";
import { NewsletterBlockItem } from "./items/NewsletterBlockItem";
import { PartnerFeatureItem } from "./items/PartnerFeatureItem";
import { TalksScheduleItem } from "./items/TalksScheduleItem";
import { HeroStageItem } from "./items/HeroStageItem";
import { PartnerHeroItem } from "./items/PartnerHeroItem";
import { SalesHeroItem } from "./items/SalesHeroItem";
import { InfoHeaderItem } from "./items/InfoHeaderItem";
import { ListHeaderItem } from "./items/ListHeaderItem";
import { NewsletterHeroItem } from "./items/NewsletterHeroItem";
import { Fragment } from "react";
import { loc, type Cta, type ImageRef, type Section } from "../lib/sections";
import { localizeHref } from "../lib/slugs";
import { withBase } from "../lib/assets";

type Lang = "de" | "en";

// Feste, im Code gepflegte Riegel (z. B. der Talks-Fahrplan). Diese Abschnitte
// tragen im CMS nur einen Marker (Typ + _key), ihr Inhalt kommt als fertiger
// React-Knoten über `slots` herein — so bleibt „Fahrplan im Code", während die
// Position im Baukasten sortierbar ist.
type Slots = Record<string, React.ReactNode>;
const SLOT_TYPES = ["programmArtWalks", "programmSchedule", "programmCurated"];

// Sanity-CDN-Bild skalieren; lokale /images/-Pfade über die Asset-Basis
// auflösen (leer = lokal, z. B. in Webby = Website-Adresse).
function imgUrl(image: ImageRef | undefined, w: number, base?: string): string {
  const url = image?.url;
  if (!url) return "";
  if (!url.includes("cdn.sanity.io")) return withBase(url, base);
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}w=${w}&q=75&auto=format`;
}

// Interne Links: Sprache präfigieren + deutsche Slugs (lib/site/slugs.ts).
function withLang(href: string, lang: Lang): string {
  return localizeHref(href.startsWith("/") || /^(mailto:|tel:|https?:|#)/.test(href) ? href : `/${href}`, lang);
}

function resolveCta(cta: Cta | undefined, lang: Lang): { label: string; href: string } | undefined {
  if (!cta?.href || cta.hidden) return undefined;
  return { label: loc(cta.label, lang), href: cta.href };
}

// Mappt einen Baukasten-Abschnitt auf Annalenas Item-Komponente.
// Unbekannte/leere Abschnitte werden übersprungen — die Seite bricht nie.
// `magazine` speist den Magazin-Streifen (kuratierte Artikel von der Seite).
function renderSection(s: Section, lang: Lang, magazine: MagCard[], slots: Slots, base: string): React.ReactNode {
  // Ausgeblendete Riegel (im Webby-Editor „Ausblenden") erscheinen nicht.
  if ((s as { hidden?: boolean }).hidden) return null;
  // Code-Riegel (Marker im CMS): den passenden Slot-Knoten rendern.
  if (SLOT_TYPES.includes(s._type)) {
    const node = slots[s._type];
    return node ? <Fragment key={s._key}>{node}</Fragment> : null;
  }
  // Bild-URLs über die Asset-Basis auflösen (lokal in AD27, Website-Adresse in Webby).
  const img = (image?: ImageRef, w = 1600) => imgUrl(image, w, base);
  switch (s._type) {
    case "spacer":
      return <SpacerItem key={s._key} color={s.color} height={s.height} />;

    case "ticker": {
      const items = (s.items ?? []).map((i) => loc(i, lang)).filter(Boolean);
      if (items.length === 0) return null;
      return <TickerItem key={s._key} items={items} imageSrc={img(s.image)} />;
    }

    case "heroSplit": {
      const primary = resolveCta(s.primaryCta, lang) ?? { label: loc(s.primaryCta?.label, lang), href: "#" };
      return (
        <HeroSplitItem
          key={s._key}
          eyebrow={loc(s.eyebrow, lang)}
          title={loc(s.title, lang)}
          body={loc(s.body, lang)}
          primaryCta={primary}
          secondaryCta={resolveCta(s.secondaryCta, lang)}
          videoSrc={withBase(s.videoUrl, base) || undefined}
          poster={img(s.poster) || undefined}
        />
      );
    }

    case "factsRow": {
      const facts = (s.facts ?? [])
        .map((f) => ({ label: loc(f.label, lang), value: loc(f.value, lang), muted: f.muted }))
        .filter((f) => f.label || f.value);
      if (facts.length === 0) return null;
      return <FactsRowItem key={s._key} id={s.anchor} facts={facts} />;
    }

    case "ctaBand": {
      const cta = resolveCta(s.cta, lang);
      if (!cta) return null;
      return (
        <CtaBandItem
          key={s._key}
          id={s.anchor}
          eyebrow={loc(s.eyebrow, lang)}
          heading={loc(s.heading, lang)}
          body={loc(s.body, lang)}
          cta={cta}
          imageSrc={img(s.image)}
          imageAlt={s.image?.alt ?? ""}
        />
      );
    }

    case "textCta": {
      const cta = resolveCta(s.cta, lang);
      if (!cta) return null;
      return (
        <TextCtaItem
          key={s._key}
          id={s.anchor}
          eyebrow={loc(s.eyebrow, lang)}
          heading={loc(s.heading, lang)}
          body={loc(s.body, lang)}
          cta={cta}
          imageSrc={img(s.image) || undefined}
          imageAlt={s.image?.alt ?? ""}
        />
      );
    }

    case "fairPlan": {
      const plan = img(s.plan);
      if (!plan) return null;
      return (
        <FairPlanItem
          key={s._key}
          id={s.anchor}
          eyebrow={loc(s.eyebrow, lang)}
          heading={loc(s.heading, lang)}
          body={loc(s.body, lang)}
          planSrc={plan}
          planAlt={s.plan?.alt ?? ""}
          link={resolveCta(s.link, lang)}
        />
      );
    }

    case "numberedBlocks": {
      const blocks = (s.blocks ?? [])
        .map((b) => ({ heading: loc(b.heading, lang), body: loc(b.body, lang) }))
        .filter((b) => b.heading || b.body);
      if (blocks.length === 0) return null;
      const image = img(s.image)
        ? { src: img(s.image), alt: s.image?.alt ?? "", caption: loc(s.imageCaption, lang) || undefined }
        : undefined;
      return (
        <NumberedBlocksItem
          key={s._key}
          id={s.anchor}
          eyebrow={loc(s.eyebrow, lang)}
          heading={loc(s.heading, lang)}
          image={image}
          headLink={resolveCta(s.headLink, lang)}
          blocks={blocks}
        />
      );
    }

    case "cardTrio": {
      const cards = (s.cards ?? [])
        .map((c) => ({
          id: c.anchor,
          imageSrc: img(c.image),
          imageAlt: c.image?.alt ?? "",
          imageFit: c.imageFit,
          label: loc(c.label, lang),
          title: loc(c.title, lang),
          body: loc(c.body, lang),
          link: resolveCta(c.link, lang),
        }))
        .filter((c) => c.title || c.body || c.imageSrc);
      if (cards.length === 0) return null;
      return (
        <CardTrioItem
          key={s._key}
          eyebrow={loc(s.eyebrow, lang)}
          heading={loc(s.heading, lang)}
          cards={cards}
        />
      );
    }

    case "logoGrid": {
      const logos = (s.logos ?? [])
        .filter((l) => l.image?.url)
        .map((l) => ({ src: img(l.image, 320), name: l.image?.alt ?? "", href: l.href }));
      if (logos.length === 0) return null;
      return (
        <LogoGridItem
          key={s._key}
          id={s.anchor}
          eyebrow={loc(s.eyebrow, lang)}
          heading={loc(s.heading, lang)}
          logos={logos}
        />
      );
    }

    case "welcomePanel": {
      return (
        <WelcomePanelItem
          key={s._key}
          kicker={loc(s.kicker, lang)}
          title={loc(s.title, lang)}
          body={loc(s.body, lang)}
          videoSrc={withBase(s.videoUrl, base) || undefined}
          poster={img(s.poster) || undefined}
        />
      );
    }

    case "advertorialCards": {
      const cards = (s.cards ?? [])
        .map((c) => ({
          cat: loc(c.cat, lang),
          name: loc(c.name, lang),
          teaser: loc(c.teaser, lang),
          img: img(c.image),
          href: withLang(c.href || "/catalogue", lang),
        }))
        .filter((c) => c.name || c.img);
      if (cards.length === 0) return null;
      return (
        <AdvertorialCardsItem
          key={s._key}
          kicker={loc(s.kicker, lang)}
          title={loc(s.title, lang)}
          adLabel={loc(s.adLabel, lang)}
          adTag={loc(s.adTag, lang)}
          moreLabel={loc(s.moreLabel, lang)}
          cards={cards}
        />
      );
    }

    case "navMosaic": {
      const tiles = (s.tiles ?? [])
        .map((t) => ({ label: loc(t.label, lang), img: img(t.image), href: withLang(t.href || "/", lang) }))
        .filter((t) => t.img || t.label);
      if (tiles.length < 4) return null;
      return <NavMosaicItem key={s._key} title={loc(s.title, lang)} sub={loc(s.sub, lang)} tiles={tiles} />;
    }

    case "logoMarquee": {
      const logos = (s.logos ?? [])
        .filter((l) => l.image?.url)
        .map((l) => ({ src: img(l.image, 320), alt: l.image?.alt ?? "" }));
      if (logos.length === 0) return null;
      return <LogoMarqueeItem key={s._key} headline={loc(s.headline, lang)} logos={logos} />;
    }

    case "magazineStrip": {
      if (magazine.length === 0) return null;
      return (
        <MagazineStripItem
          key={s._key}
          title={loc(s.title, lang)}
          moreLabel={loc(s.moreLabel, lang)}
          moreHref={withLang(s.moreHref || "/magazine", lang)}
          cards={magazine}
        />
      );
    }

    case "themesSection": {
      const themes = (s.themes ?? [])
        .map((t) => ({ img: img(t.image), alt: t.image?.alt ?? "", t: loc(t.heading, lang), b: loc(t.body, lang), ratio: t.ratio ?? ("4/3" as const) }))
        .filter((t) => t.t || t.img);
      if (themes.length === 0) return null;
      return <ThemesSection key={s._key} id={s.anchor} title={loc(s.title, lang)} intro={loc(s.intro, lang)} themes={themes} />;
    }

    case "newsletter": {
      return <NewsletterBlockItem key={s._key} lang={lang} title={loc(s.title, lang)} body={loc(s.body, lang)} />;
    }

    case "partnerFeature": {
      const image = img(s.image);
      if (!image) return null;
      return (
        <PartnerFeatureItem
          key={s._key}
          id={s.anchor}
          eyebrow={loc(s.eyebrow, lang)}
          heading={loc(s.heading, lang)}
          imageSrc={image}
          imageAlt={s.image?.alt ?? ""}
          title={loc(s.title, lang)}
          body={loc(s.body, lang)}
          link={resolveCta(s.link, lang)}
        />
      );
    }

    case "talksSchedule": {
      const days = (s.days ?? [])
        .map((d) => ({
          weekday: loc(d.weekday, lang),
          date: loc(d.date, lang),
          theme: loc(d.theme, lang) || undefined,
          talks: (d.talks ?? [])
            .map((t) => ({
              time: t.time ?? "",
              duration: loc(t.duration, lang) || undefined,
              title: loc(t.title, lang),
              imageSrc: img(t.image) || undefined,
              speakers: (t.speakers ?? [])
                .map((sp) => ({ name: sp.name ?? "", role: loc(sp.role, lang) || undefined }))
                .filter((sp) => sp.name),
              moderation: t.moderationName
                ? { name: t.moderationName, role: loc(t.moderationRole, lang) || undefined }
                : undefined,
            }))
            .filter((t) => t.title),
        }))
        .filter((d) => d.talks.length > 0);
      if (days.length === 0) return null;
      return (
        <TalksScheduleItem
          key={s._key}
          id={s.anchor}
          eyebrow={loc(s.eyebrow, lang)}
          heading={loc(s.heading, lang)}
          intro={loc(s.intro, lang) || undefined}
          imageSrc={img(s.image) || undefined}
          imageAlt={s.image?.alt ?? ""}
          imageCaption={loc(s.imageCaption, lang) || undefined}
          days={days}
          credit={loc(s.credit, lang) || undefined}
        />
      );
    }

    case "heroStage": {
      const image = img(s.image, 2200);
      if (!image) return null;
      return (
        <HeroStageItem
          key={s._key}
          id={s.anchor}
          eyebrow={loc(s.eyebrow, lang)}
          title={loc(s.title, lang)}
          body={loc(s.body, lang) || undefined}
          primaryCta={resolveCta(s.primaryCta, lang)}
          secondaryCta={resolveCta(s.secondaryCta, lang)}
          imageSrc={image}
          imageAlt={s.image?.alt ?? ""}
        />
      );
    }

    case "partnerHero": {
      const image = img(s.image);
      if (!image) return null;
      const logos = (s.logos ?? [])
        .filter((l) => l.image?.url)
        .map((l) => ({ src: img(l.image, 480), alt: l.image?.alt ?? "" }));
      return (
        <PartnerHeroItem
          key={s._key}
          id={s.anchor}
          eyebrow={loc(s.eyebrow, lang)}
          title={loc(s.title, lang)}
          body={loc(s.body, lang)}
          primaryCta={resolveCta(s.primaryCta, lang)}
          secondaryCta={resolveCta(s.secondaryCta, lang)}
          imageSrc={image}
          imageAlt={s.image?.alt ?? ""}
          logos={logos}
        />
      );
    }

    case "salesHero": {
      const images = (s.images ?? [])
        .filter((sl) => sl.image?.url)
        .map((sl) => img(sl.image, 1400));
      if (images.length === 0) return null;
      return (
        <SalesHeroItem
          key={s._key}
          id={s.anchor}
          eyebrow={loc(s.eyebrow, lang)}
          title={loc(s.title, lang)}
          body={loc(s.body, lang)}
          primaryCta={resolveCta(s.primaryCta, lang)}
          secondaryCta={resolveCta(s.secondaryCta, lang)}
          images={images}
          imageAlt={s.images?.[0]?.image?.alt ?? ""}
        />
      );
    }

    case "infoHeader": {
      const meta = (s.meta ?? []).map((m) => loc(m, lang)).filter(Boolean);
      return (
        <InfoHeaderItem
          key={s._key}
          id={s.anchor}
          eyebrow={loc(s.eyebrow, lang)}
          title={loc(s.title, lang)}
          body={loc(s.body, lang) || undefined}
          action={resolveCta(s.action, lang)}
          meta={meta.length > 0 ? meta : undefined}
        />
      );
    }

    case "listHeader": {
      return (
        <ListHeaderItem
          key={s._key}
          id={s.anchor}
          eyebrow={loc(s.eyebrow, lang)}
          title={loc(s.title, lang)}
          counterValue={s.counterValue || undefined}
          counterLabel={loc(s.counterLabel, lang) || undefined}
        />
      );
    }

    case "newsletterHero": {
      const images = (s.images ?? [])
        .filter((sl) => sl.image?.url)
        .map((sl) => ({ src: img(sl.image, 1200), alt: sl.image?.alt ?? "" }));
      return (
        <NewsletterHeroItem
          key={s._key}
          id={s.anchor}
          eyebrow={loc(s.eyebrow, lang)}
          title={loc(s.title, lang)}
          body={loc(s.body, lang)}
          emailPlaceholder={lang === "de" ? "E-Mail-Adresse" : "Email address"}
          submitLabel={lang === "de" ? "Abonnieren" : "Subscribe"}
          thanksText={lang === "de" ? "Danke! Wir melden uns." : "Thank you! We’ll be in touch."}
          images={images}
        />
      );
    }

    default:
      return null;
  }
}

export default function SectionRenderer({
  sections,
  lang,
  magazine = [],
  slots = {},
  assetBase = "",
}: {
  sections: Section[];
  lang: Lang;
  magazine?: MagCard[];
  slots?: Slots;
  assetBase?: string;
}) {
  return <>{sections.map((s) => renderSection(s, lang, magazine, slots, assetBase))}</>;
}
