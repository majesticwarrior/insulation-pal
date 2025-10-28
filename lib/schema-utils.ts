export const generateSchemas = (pageData: {
  type?: 'service' | 'city'
  name: string
  description: string
  url: string
  serviceType?: string
  city?: string
  state?: string
}) => {
  const siteUrl = 'https://insulationpal.com'
  
  // Service Schema for Service pages
  const serviceSchema = pageData.type === 'service' ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": pageData.name,
    "description": pageData.description,
    "provider": {
      "@type": "Organization",
      "name": "InsulationPal",
      "url": siteUrl,
      "logo": `${siteUrl}/insulation-pal-logo.png`
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "serviceType": pageData.serviceType || "Insulation Installation",
    "url": `${siteUrl}${pageData.url}`
  } : null

  // Organization/SameAs Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "InsulationPal",
    "url": siteUrl,
    "logo": `${siteUrl}/insulation-pal-logo.png`,
    "image": `${siteUrl}/home-outside-walls-insulation-installation.jpg`,
    "description": "USA's #1 Home Insulation Contractors Near Me, Get Free Quotes",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "14210 N 46th Dr",
      "addressLocality": "Glendale",
      "addressRegion": "AZ",
      "postalCode": "85306",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://x.com/insulationpal",
      "https://www.facebook.com/insulationpal/",
      "https://www.linkedin.com/in/insulationpal/",
      "https://www.instagram.com/insulationpal/",
      "https://www.pinterest.com/insulationpal/"
    ],
    "knowsAbout": [
      "https://en.wikipedia.org/wiki/Insulation",
      "https://en.wikipedia.org/wiki/Building_insulation",
      "https://en.wikipedia.org/wiki/Thermal_insulation",
      "https://en.wikipedia.org/wiki/List_of_insulation_materials"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "(888) 357-9555",
      "contactType": "Customer Service",
      "availableLanguage": "English"
    }
  }

  // Brand Schema
  const brandSchema = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "name": "InsulationPal",
    "logo": `${siteUrl}/insulation-pal-logo.png`,
    "image": `${siteUrl}/home-outside-walls-insulation-installation.jpg`,
    "description": "Professional insulation contractor services nationwide",
    "sameAs": [
      "https://x.com/insulationpal",
      "https://www.facebook.com/insulationpal/",
      "https://www.linkedin.com/in/insulationpal/",
      "https://www.instagram.com/insulationpal/",
      "https://www.pinterest.com/insulationpal/"
    ]
  }

  // Breadcrumb Schema
  const breadcrumbItems = []
  let currentUrl = ''
  
  if (pageData.type === 'service') {
    breadcrumbItems.push(
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": `${siteUrl}/services` },
      { "@type": "ListItem", "position": 3, "name": pageData.name, "item": `${siteUrl}${pageData.url}` }
    )
    currentUrl = `${siteUrl}${pageData.url}`
  } else if (pageData.type === 'city') {
    breadcrumbItems.push(
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": pageData.state || "Arizona", "item": `${siteUrl}/${pageData.state?.toLowerCase()}` },
      { "@type": "ListItem", "position": 3, "name": pageData.name, "item": `${siteUrl}${pageData.url}` }
    )
    currentUrl = `${siteUrl}${pageData.url}`
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  }

  return {
    serviceSchema,
    organizationSchema,
    brandSchema,
    breadcrumbSchema
  }
}

