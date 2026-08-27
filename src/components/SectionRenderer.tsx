import { TickerItem } from "./items/TickerItem";
import { SpacerItem } from "./items/SpacerItem";
import { ContactBlockItem } from "./items/ContactBlockItem";
import { HeroSplitItem } from "./items/HeroSplitItem";
import { FactsRowItem } from "./items/FactsRowItem";
import { CtaBandItem } from "./items/CtaBandItem";
import { TextCtaItem } from "./items/TextCtaItem";
import { NewsDateItem } from "./items/NewsDateItem";
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
import { AboutPageItem } from "./items/AboutPageItem";
import { InquiryFormItem, type InquiryFormProps } from "./items/InquiryFormItem";
import { BusinessPageItem } from "./items/BusinessPageItem";
import { NewsletterPageItem } from "./items/NewsletterPageItem";
import { FaqPageItem } from "./items/FaqPageItem";
import { PartnerPageItem } from "./items/PartnerPageItem";
import { ExhibitorArchiveItem } from "./items/ExhibitorArchiveItem";
import { LinkHubItem } from "./items/LinkHubItem";
import { Fragment } from "react";
import {
  loc,
  type Cta,
  type ImageRef,
  type Loc,
  type Section,
  type AboutQuote,
  type InquiryFormFields,
} from "../lib/sections";
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

// Anfrage-Formular-Felder auflösen — geteilt zwischen dem inquiryForm-Riegel
// und dem in die businessPage eingebetteten Formular. Ohne heading: undefined
// (Formular entfällt).
function resolveInquiry(
  f: InquiryFormFields | undefined,
  lang: Lang,
): Omit<InquiryFormProps, "id"> | undefined {
  if (!f || !loc(f.heading, lang)) return undefined;
  const opts = (list?: Loc[]) => (list ?? []).map((o) => loc(o, lang)).filter(Boolean);
  return {
    eyebrow: loc(f.eyebrow, lang) || undefined,
    heading: loc(f.heading, lang),
    intro: loc(f.intro, lang) || undefined,
    companyLabel: loc(f.companyLabel, lang),
    contactLabel: loc(f.contactLabel, lang),
    periodLabel: loc(f.periodLabel, lang),
    periodOptions: opts(f.periodOptions),
    guestsLabel: loc(f.guestsLabel, lang),
    guestOptions: opts(f.guestOptions),
    contextLabel: loc(f.contextLabel, lang),
    contextPlaceholder: loc(f.contextPlaceholder, lang) || undefined,
    optionalHint: "optional",
    selectPlaceholder: lang === "de" ? "Bitte wählen" : "Please choose",
    submitLabel: loc(f.submitLabel, lang),
    confirmation: loc(f.confirmation, lang),
    action: f.action || undefined,
    errorText:
      loc(f.errorText, lang) ||
      (lang === "de"
        ? "Senden fehlgeschlagen — bitte versuchen Sie es erneut."
        : "Sending failed — please try again."),
  };
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

    case "contactBlock": {
      const cards = (s.cards ?? [])
        .map((c) => ({ name: loc(c.name, lang), lines: loc(c.lines, lang), contact: loc(c.contact, lang) }))
        .filter((c) => c.name || c.lines || c.contact);
      if (cards.length === 0) return null;
      return <ContactBlockItem key={s._key} anchor={s.anchor} heading={loc(s.heading, lang)} cards={cards} />;
    }

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
          videoSrcMobile={withBase(s.videoUrlMobile, base) || undefined}
          poster={img(s.poster) || undefined}
        />
      );
    }

    case "factsRow": {
      const facts = (s.facts ?? [])
        .map((f) => ({ label: loc(f.label, lang), value: loc(f.value, lang), muted: f.muted }))
        .filter((f) => f.label || f.value);
      if (facts.length === 0) return null;
      return (
        <FactsRowItem key={s._key} id={s.anchor} kicker={loc(s.kicker, lang) || undefined} facts={facts} />
      );
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
          contact={
            s.contactName
              ? {
                  name: s.contactName,
                  role: loc(s.contactRole, lang) || undefined,
                  phone: s.contactPhone || undefined,
                }
              : undefined
          }
          cta={cta}
          imageSrc={img(s.image)}
          imageAlt={s.image?.alt ?? ""}
          videoSrc={withBase(s.videoUrl, base) || undefined}
          videoSrcMobile={withBase(s.videoUrlMobile, base) || undefined}
        />
      );
    }

    case "textCta": {
      // Ohne CTA als ruhige Textsektion rendern — aber nie ganz leer.
      if (!loc(s.heading, lang) && !loc(s.body, lang)) return null;
      return (
        <TextCtaItem
          key={s._key}
          id={s.anchor}
          eyebrow={loc(s.eyebrow, lang) || undefined}
          heading={loc(s.heading, lang)}
          body={loc(s.body, lang)}
          cta={resolveCta(s.cta, lang)}
          imageSrc={img(s.image) || undefined}
          imageAlt={s.image?.alt ?? ""}
        />
      );
    }

    case "newsDate": {
      // Ohne Datum als ruhige Textsektion, ohne Text gar nicht — nie leer.
      if (!loc(s.heading, lang) && !loc(s.body, lang)) return null;
      const date = loc(s.boxDate, lang);
      return (
        <NewsDateItem
          key={s._key}
          id={s.anchor}
          eyebrow={loc(s.eyebrow, lang) || undefined}
          heading={loc(s.heading, lang)}
          body={loc(s.body, lang)}
          cta={resolveCta(s.cta, lang)}
          box={
            date
              ? {
                  kicker: loc(s.boxKicker, lang) || undefined,
                  intro: loc(s.boxIntro, lang) || undefined,
                  date,
                  label: loc(s.boxLabel, lang) || undefined,
                  tone: s.boxTone,
                }
              : undefined
          }
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
          lang={lang}
        />
      );
    }

    case "exhibitorArchive": {
      return (
        <ExhibitorArchiveItem
          key={s._key}
          id={s.anchor}
          lang={lang}
          edition={s.edition || "2026"}
          eyebrow={loc(s.eyebrow, lang) || undefined}
          title={loc(s.title, lang) || undefined}
          intro={loc(s.intro, lang) || undefined}
        />
      );
    }

    case "linkHub": {
      // Beschriftungen bleiben als Loc (beide Sprachen) — das Item wechselt
      // DE/EN clientseitig; `lang` ist nur die Startsprache aus der Route.
      const mapLinks = (list?: typeof s.links) =>
        (list ?? [])
          .filter((x) => !x.hidden && x.href && (x.label?.de || x.label?.en))
          .map((x) => ({ label: x.label, href: x.href! }));
      const links = mapLinks(s.links);
      const credits = mapLinks(s.credits);
      if (links.length === 0 && credits.length === 0) return null;
      return (
        <LinkHubItem
          key={s._key}
          id={s.anchor}
          lang={lang}
          imageSrc={img(s.image, 1200) || undefined}
          imageAlt={s.image?.alt ?? ""}
          dateLine={s.dateLine}
          placeLine={s.placeLine}
          showLanguageToggle={s.showLanguageToggle ?? true}
          links={links}
          creditsTitle={s.creditsTitle}
          credits={credits}
          footerNote={s.footerNote}
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
        .map((l) => ({ src: img(l.image, 320), alt: l.image?.alt ?? "", variant: l.variant, scale: l.scale }));
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
        .map((l) => ({ src: img(l.image, 480), alt: l.image?.alt ?? "", variant: l.variant, scale: l.scale }));
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
          imageCaption={loc(s.imageCaption, lang) || undefined}
        />
      );
    }

    case "inquiryForm": {
      const inquiry = resolveInquiry(s, lang);
      if (!inquiry) return null;
      return <InquiryFormItem key={s._key} id={s.anchor} {...inquiry} />;
    }

    case "businessPage": {
      const heroImages = (s.heroImages ?? [])
        .filter((sl) => sl.image?.url)
        .map((sl) => img(sl.image, 1400));
      if (heroImages.length === 0) return null;
      const contactImage = img(s.contactImage)
        ? { src: img(s.contactImage), alt: s.contactImage?.alt ?? "" }
        : undefined;
      return (
        <BusinessPageItem
          key={s._key}
          heroEyebrow={loc(s.heroEyebrow, lang)}
          heroTitle={loc(s.heroTitle, lang)}
          heroBody={loc(s.heroBody, lang)}
          heroPrimaryCta={resolveCta(s.heroPrimaryCta, lang)}
          heroSecondaryCta={resolveCta(s.heroSecondaryCta, lang)}
          heroImages={heroImages}
          heroImageAlt={s.heroImages?.[0]?.image?.alt ?? ""}
          heroImageCaption={loc(s.heroImageCaption, lang) || undefined}
          trustEyebrow={loc(s.trustEyebrow, lang)}
          trustHeading={loc(s.trustHeading, lang)}
          trustBody={loc(s.trustBody, lang)}
          factsKicker={loc(s.factsKicker, lang)}
          facts={(s.facts ?? [])
            .map((f) => ({ label: loc(f.label, lang), value: loc(f.value, lang) }))
            .filter((f) => f.label || f.value)}
          includedEyebrow={loc(s.includedEyebrow, lang)}
          includedHeading={loc(s.includedHeading, lang)}
          includedCards={(s.includedCards ?? [])
            .map((c) => ({
              imageSrc: img(c.image),
              imageAlt: c.image?.alt ?? "",
              label: loc(c.label, lang),
              title: loc(c.title, lang),
              body: loc(c.body, lang),
            }))
            .filter((c) => c.title || c.body || c.imageSrc)}
          independentHeading={loc(s.independentHeading, lang)}
          independentBody={loc(s.independentBody, lang)}
          contactEyebrow={loc(s.contactEyebrow, lang)}
          contactHeading={loc(s.contactHeading, lang)}
          contactBody={loc(s.contactBody, lang)}
          contactPerson={
            s.contactName
              ? {
                  name: s.contactName,
                  role: loc(s.contactRole, lang) || undefined,
                  phone: s.contactPhone || undefined,
                }
              : undefined
          }
          contactCta={resolveCta(s.contactCta, lang)}
          contactImage={contactImage}
          inquiry={resolveInquiry(s.inquiry, lang)}
        />
      );
    }

    case "faqPage": {
      const categories = (s.categories ?? [])
        .map((c) => ({
          label: loc(c.label, lang),
          faqs: (c.faqs ?? [])
            .map((f) => ({ q: loc(f.question, lang), a: loc(f.answer, lang) }))
            .filter((f) => f.q && f.a),
        }))
        .filter((c) => c.label && c.faqs.length > 0);
      if (categories.length === 0) return null;
      const switchCta = resolveCta(s.switchCta, lang);
      const de = lang === "de";
      return (
        <FaqPageItem
          key={s._key}
          id={s.anchor}
          title={loc(s.title, lang)}
          intro={loc(s.intro, lang) || undefined}
          switchCta={switchCta ? { label: switchCta.label, href: withLang(switchCta.href, lang) } : undefined}
          allLabel={loc(s.allLabel, lang) || (de ? "Alle Themen" : "All topics")}
          categories={categories}
        />
      );
    }

    case "partnerPage": {
      const heroImage = img(s.heroImage);
      if (!heroImage) return null;
      const heroLogos = (s.heroLogos ?? [])
        .filter((l) => l.image?.url)
        .map((l) => ({ src: img(l.image, 480), alt: l.image?.alt ?? "", variant: l.variant, scale: l.scale }));
      const features = (s.features ?? [])
        .map((f) => ({
          id: f.anchor || undefined,
          eyebrow: loc(f.eyebrow, lang),
          heading: loc(f.heading, lang),
          imageSrc: img(f.image),
          imageAlt: f.image?.alt ?? "",
          title: loc(f.title, lang),
          body: loc(f.body, lang),
          link: resolveCta(f.link, lang),
        }))
        .filter((f) => f.imageSrc && (f.title || f.body));
      const logoGroups = (s.logoGroups ?? [])
        .map((g) => ({
          id: g.anchor || undefined,
          eyebrow: loc(g.eyebrow, lang),
          heading: loc(g.heading, lang),
          logos: (g.logos ?? [])
            .filter((l) => l.image?.url)
            .map((l) => ({ src: img(l.image, 320), name: l.image?.alt ?? "", href: l.href })),
        }))
        .filter((g) => g.logos.length > 0);
      const contactImage = img(s.contactImage)
        ? { src: img(s.contactImage), alt: s.contactImage?.alt ?? "" }
        : undefined;
      return (
        <PartnerPageItem
          key={s._key}
          heroEyebrow={loc(s.heroEyebrow, lang)}
          heroTitle={loc(s.heroTitle, lang)}
          heroBody={loc(s.heroBody, lang)}
          heroPrimaryCta={resolveCta(s.heroPrimaryCta, lang)}
          heroSecondaryCta={resolveCta(s.heroSecondaryCta, lang)}
          heroImage={{ src: heroImage, alt: s.heroImage?.alt ?? "" }}
          heroLogos={heroLogos}
          features={features}
          logoGroups={logoGroups}
          contactEyebrow={loc(s.contactEyebrow, lang)}
          contactHeading={loc(s.contactHeading, lang)}
          contactBody={loc(s.contactBody, lang)}
          contactPerson={
            s.contactName
              ? {
                  name: s.contactName,
                  role: loc(s.contactRole, lang) || undefined,
                  phone: s.contactPhone || undefined,
                }
              : undefined
          }
          contactCta={resolveCta(s.contactCta, lang)}
          contactImage={contactImage}
          contactVideoSrc={withBase(s.contactVideoUrl, base) || undefined}
          contactVideoSrcMobile={withBase(s.contactVideoUrlMobile, base) || undefined}
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

    case "aboutPage": {
      const q = (x?: AboutQuote) => ({
        text: loc(x?.text, lang),
        author: x?.author ?? "",
        role: loc(x?.role, lang),
        draft: !!x?.draft,
      });
      const im = (x?: ImageRef) => (img(x) ? { src: img(x), alt: x?.alt ?? "" } : undefined);
      const linkHref = (href?: string) => {
        if (!href) return "";
        if (/^(mailto:|tel:|https?:|#)/.test(href)) return href;
        return localizeHref(href, lang);
      };
      return (
        <AboutPageItem
          key={s._key}
          heroTitle={loc(s.heroTitle, lang)}
          heroBody={loc(s.heroBody, lang)}
          heroPrimaryCta={resolveCta(s.heroPrimaryCta, lang)}
          heroSecondaryCta={resolveCta(s.heroSecondaryCta, lang)}
          heroVideoSrc={s.heroVideoUrl || undefined}
          heroVideoSrcMobile={s.heroVideoUrlMobile || undefined}
          heroPoster={img(s.heroPoster) || undefined}
          visionHeading={loc(s.visionHeading, lang)}
          visionBody={loc(s.visionBody, lang)}
          visionQuote={q(s.visionQuote)}
          collectorsHeading={loc(s.collectorsHeading, lang)}
          collectorsBody={loc(s.collectorsBody, lang)}
          collectorsImage={im(s.collectorsImage)}
          collectorsQuote={q(s.collectorsQuote)}
          arealImage={im(s.arealImage)}
          arealLabel={loc(s.arealLabel, lang)}
          arealBody={loc(s.arealBody, lang)}
          profileHeading={loc(s.profileHeading, lang)}
          profileSections={(s.profileSections ?? [])
            .map((r) => ({ name: r.name ?? "", body: loc(r.body, lang) }))
            .filter((r) => r.name || r.body)}
          profileThemesLabel={loc(s.profileThemesLabel, lang)}
          profileThemes={(s.profileThemes ?? []).filter(Boolean)}
          profileQuote={q(s.profileQuote)}
          profileImage={im(s.profileImage)}
          contactAnchor={s.contactAnchor || "kontakt"}
          contactHeading={loc(s.contactHeading, lang)}
          contactBody={loc(s.contactBody, lang)}
          contactCta={resolveCta(s.contactCta, lang)}
          contactAddressLine={loc(s.contactAddressLine, lang)}
          contactPhone={s.contactPhone ?? ""}
          teamHeading={loc(s.teamHeading, lang)}
          team={(s.team ?? [])
            .map((m) => ({
              name: m.name ?? "",
              role: loc(m.role, lang),
              email: m.email ?? "",
              phone: m.phone ?? "",
            }))
            .filter((m) => m.name || m.email)}
          enquiriesHeading={loc(s.enquiriesHeading, lang)}
          enquiries={(s.enquiries ?? [])
            .map((b) => ({
              heading: loc(b.heading, lang),
              body: loc(b.body, lang),
              links: (b.links ?? []).map((l) => ({
                href: linkHref(l.href),
                label: loc(l.label, lang),
                acid: !!l.acid,
              })),
            }))
            .filter((b) => b.heading || b.body)}
          addressesHeading={loc(s.addressesHeading, lang)}
          addresses={(s.addresses ?? [])
            .map((a) => ({
              label: loc(a.label, lang),
              name: loc(a.name, lang),
              lines: loc(a.lines, lang),
              phone: a.phone ?? "",
              email: a.email ?? "",
              tone: (a.tone === "black" ? "black" : "lime") as "black" | "lime",
            }))
            .filter((a) => a.name || a.lines)}
        />
      );
    }

    case "newsletterPage": {
      if (!loc(s.heroTitle, lang)) return null;
      const im = (x?: ImageRef, w = 1600) => (img(x, w) ? { src: img(x, w), alt: x?.alt ?? "" } : undefined);
      const de = lang === "de";
      return (
        <NewsletterPageItem
          key={s._key}
          id={s.anchor}
          heroEyebrow={loc(s.heroEyebrow, lang)}
          heroTitle={loc(s.heroTitle, lang)}
          heroBody={loc(s.heroBody, lang)}
          emailPlaceholder={loc(s.emailPlaceholder, lang) || (de ? "E-Mail-Adresse" : "Email address")}
          submitLabel={loc(s.submitLabel, lang) || (de ? "Anmelden" : "Sign up")}
          showLanguageToggle={s.showLanguageToggle ?? true}
          defaultLanguage={lang}
          consentText={
            loc(s.consentText, lang) ||
            (de
              ? "Ich möchte den Newsletter der Art Düsseldorf per E-Mail erhalten. Die Anmeldung wird erst mit meiner Bestätigung wirksam (Double-Opt-in); eine Abmeldung ist jederzeit über den Link in jeder Ausgabe möglich. Mehr dazu in der"
              : "I would like to receive the Art Düsseldorf newsletter by email. My subscription only becomes active once confirmed (double opt-in); I can unsubscribe at any time via the link in every issue. For details, see the")
          }
          privacyLabel={loc(s.privacyLabel, lang) || (de ? "Datenschutzerklärung" : "privacy policy")}
          privacyHref={withLang(s.privacyHref || "/datenschutz", lang)}
          confirmation={
            loc(s.confirmation, lang) ||
            (de
              ? "Fast geschafft — bitte bestätigen Sie Ihre Anmeldung über den Link in Ihrem Postfach."
              : "Almost there — please confirm your subscription via the link in your inbox.")
          }
          errorText={
            loc(s.errorText, lang) ||
            (de
              ? "Senden fehlgeschlagen — bitte versuchen Sie es erneut."
              : "Sending failed — please try again.")
          }
          action={s.action || undefined}
          benefitsEyebrow={loc(s.benefitsEyebrow, lang)}
          benefitsHeading={loc(s.benefitsHeading, lang)}
          benefits={(s.benefits ?? [])
            .map((b) => ({ eyebrow: loc(b.eyebrow, lang), title: loc(b.title, lang), body: loc(b.body, lang) }))
            .filter((b) => b.title || b.body)}
          mosaic={(s.mosaic ?? [])
            .map((sl) => im(sl.image, 1200))
            .filter((x): x is { src: string; alt: string } => !!x)}
          previewEyebrow={loc(s.previewEyebrow, lang)}
          previewHeading={loc(s.previewHeading, lang)}
          previewUrl={s.previewUrl || "mail.artduesseldorf.com"}
          phoneLabel={loc(s.phoneLabel, lang) || "Mail"}
          mailImage={im(s.mailImage, 1200)}
          mailSubject={loc(s.mailSubject, lang) || "Collector Insights #6 — AD27"}
          mailFrom={s.mailFrom || undefined}
          mockSender={loc(s.mockSender, lang) || undefined}
          mockInboxLabel={loc(s.mockInboxLabel, lang) || undefined}
          mockTeaser={loc(s.mockTeaser, lang) || undefined}
          mockDate={loc(s.mockDate, lang) || undefined}
          mockInbox={(s.mockInbox ?? [])
            .map((r) => ({subject: loc(r.subject, lang), teaser: loc(r.teaser, lang), date: loc(r.date, lang)}))
            .filter((r) => r.subject)}
          mockMastheadKicker={loc(s.mockMastheadKicker, lang) || undefined}
          mockKicker={loc(s.mockKicker, lang) || undefined}
          mockTitle={loc(s.mockTitle, lang) || undefined}
          mockText={loc(s.mockText, lang) || undefined}
          mockLinkLabel={loc(s.mockLinkLabel, lang) || undefined}
          quoteText={loc(s.quoteText, lang)}
          quoteAttribution={loc(s.quoteAttribution, lang)}
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
