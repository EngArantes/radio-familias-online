// src/components/Seo.jsx
// SEO por rota: title, description, canonical, Open Graph e Twitter Cards.
// Uso: <Seo title="..." description="..." path="/eventos" /> (path vira o canonical)
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://radiofamiliasonline.com';
const SITE_NAME = 'Rádio Famílias Online';
const DEFAULT_IMAGE = `${SITE_URL}/logo222.png`;

function Seo({ title, description, path = '/', image = DEFAULT_IMAGE, noindex = false }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Evangelizando através das ondas da internet`;
  const canonical = `${SITE_URL}${path === '/' ? '/' : path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />
      <link rel="canonical" href={canonical} />
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}

export default Seo;
