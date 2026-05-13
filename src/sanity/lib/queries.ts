// WHY: All GROQ queries are centralised here so the data-fetching layer is the
// single source of truth for what the front-end receives. Components never
// build query strings — they only consume typed data from fetch.ts.
//
// KEY DESIGN DECISIONS:
//
// 1. Locale projection in GROQ (not in JS):
//    `coalesce(field[$lang], field.de)` resolves localizedString/localizedText
//    objects to plain strings inside the query. Components receive `string`,
//    not `{ de: string; en?: string }`. This means:
//    - Less data transferred over the wire (unused locale dropped on the CDN)
//    - Components stay simple — no locale-aware helpers at the component level
//    - Different cache keys per `$lang` parameter → Sanity CDN caches DE and
//      EN responses separately at no extra cost
//
// 2. Fallback to German (`field.de`) if a translation is missing:
//    German is the primary locale (x-default). The coalesce fallback prevents
//    blank fields when an editor publishes DE content without an EN translation.
//
// 3. `...select()` for union-type sections array:
//    GROQ's select() discriminates on _type and projects only the relevant
//    fields per section type. This avoids over-fetching (e.g. hero fields
//    are never included in a faqSection response).

export const homePageQuery = /* groq */ `
*[_type == "homePage" && _id == "homePage"][0]{
  "seo": {
    "metaTitle":       coalesce(seo.metaTitle[$lang],       seo.metaTitle.de),
    "metaDescription": coalesce(seo.metaDescription[$lang], seo.metaDescription.de),
    "ogImage": seo.ogImage
  },

  "sections": sections[]{
    _key,
    _type,

    ...select(

      _type == "heroSection" => {
        "headline": coalesce(headline[$lang], headline.de),
        "body":     coalesce(body[$lang],     body.de),
        image{ asset, hotspot, crop, "alt": coalesce(alt[$lang], alt.de) },
        "ctas": ctas[]{
          "label": coalesce(label[$lang], label.de),
          href,
          variant
        },
        "appStoreLinks": appStoreLinks{ playStore, appStore },
        socialProofRating
      },

      _type == "logoBarSection" => {
        "eyebrow": coalesce(eyebrow[$lang], eyebrow.de),
        "logos": logos[]{ _key, image{ asset }, alt }
      },

      _type == "statsSection" => {
        colorScheme,
        "headline": coalesce(headline[$lang], headline.de),
        "items": items[]{
          _key,
          "value":       coalesce(value[$lang],       value.de),
          "label":       coalesce(label[$lang],       label.de),
          "description": coalesce(description[$lang], description.de)
        }
      },

      _type == "menuShowcaseSection" => {
        "headline": coalesce(headline[$lang], headline.de),
        "cards": cards[]{
          _key,
          "tag":  coalesce(tag[$lang],  tag.de),
          image{ asset, hotspot, crop, "alt": coalesce(alt[$lang], alt.de) },
          "name": coalesce(name[$lang], name.de),
          approvalPct,
          reviewCount
        },
        "cta": {
          "label":   coalesce(cta.label[$lang], cta.label.de),
          "href":    cta.href,
          "variant": cta.variant
        }
      },

      _type == "checklistSection" => {
        image{ asset, hotspot, crop, "alt": coalesce(alt[$lang], alt.de) },
        "items": items[]{
          _key,
          "title":       coalesce(title[$lang],       title.de),
          "description": coalesce(description[$lang], description.de)
        }
      },

      _type == "ctaSection" => {
        colorScheme,
        "headline": coalesce(headline[$lang], headline.de),
        "body":     coalesce(body[$lang],     body.de),
        "ctas": ctas[]{
          "label":   coalesce(label[$lang], label.de),
          href,
          variant
        },
        backgroundImage{ asset, hotspot, crop, "alt": coalesce(alt[$lang], alt.de) }
      },

      _type == "stepsSection" => {
        "headline": coalesce(headline[$lang], headline.de),
        "steps": steps[]{
          _key,
          "badge":       coalesce(badge[$lang],       badge.de),
          "title":       coalesce(title[$lang],       title.de),
          "description": coalesce(description[$lang], description.de),
          image{ asset, hotspot, crop, "alt": coalesce(alt[$lang], alt.de) }
        },
        "cta": {
          "label":   coalesce(cta.label[$lang], cta.label.de),
          "href":    cta.href,
          "variant": cta.variant
        }
      },

      _type == "testimonialsSection" => {
        "eyebrow": coalesce(eyebrow[$lang], eyebrow.de),
        "testimonials": testimonials[]{
          _key,
          "quote":      coalesce(quote[$lang], quote.de),
          authorName,
          authorRole,
          authorPhoto{ asset, hotspot, crop }
        }
      },

      _type == "contactSection" => {
        "headline": coalesce(headline[$lang], headline.de),
        "body":     coalesce(body[$lang],     body.de),
        personName,
        personRole,
        personEmail,
        personPhone,
        personPhoto{ asset, hotspot, crop }
      },

      _type == "contactFormSection" => {
        "headline":    coalesce(headline[$lang],    headline.de),
        "submitLabel": coalesce(submitLabel[$lang], submitLabel.de)
      },

      _type == "faqSection" => {
        "headline": coalesce(headline[$lang], headline.de),
        "items": items[]{
          _key,
          "question": coalesce(question[$lang], question.de),
          "answer":   coalesce(answer[$lang],   answer.de)
        }
      }

    )
  }
}
`;

// WHY: siteSettings is fetched separately from the homepage so that any page
// (not just the homepage) can access the global org name, logo, and SEO
// defaults without re-fetching the entire homepage payload.
export const siteSettingsQuery = /* groq */ `
*[_type == "siteSettings" && _id == "siteSettings"][0]{
  orgName,
  logo{ asset, "alt": alt },
  "seoDefaults": {
    "metaTitle":       coalesce(seoDefaults.metaTitle[$lang],       seoDefaults.metaTitle.de),
    "metaDescription": coalesce(seoDefaults.metaDescription[$lang], seoDefaults.metaDescription.de),
    "ogImage": seoDefaults.ogImage
  },
  socialLinks
}
`;
