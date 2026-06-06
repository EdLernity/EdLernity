import React from "react";
import { Helmet } from "react-helmet";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  buildCanonicalUrl,
} from "../../Utils/seoConfig";

function SeoHead({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  jsonLd,
  noindex = false,
}) {
  const canonical = buildCanonicalUrl(path);
  const pageTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      <html lang="en" />
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}

export default SeoHead;
