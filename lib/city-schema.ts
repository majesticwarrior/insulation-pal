export const createCitySchemas = (cityName: string, state: string, cityUrl: string) => {
  const siteUrl = 'https://insulationpal.com'
  
  return {
    organization: {
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
      ]
    },
    brand: {
      "@context": "https://schema.org",
      "@type": "Brand",
      "name": "InsulationPal",
      "logo": `${siteUrl}/insulation-pal-logo.png`,
      "sameAs": [
        "https://x.com/insulationpal",
        "https://www.facebook.com/insulationpal/",
        "https://www.linkedin.com/in/insulationpal/",
        "https://www.instagram.com/insulationpal/",
        "https://www.pinterest.com/insulationpal/"
      ]
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
        { "@type": "ListItem", "position": 2, "name": state, "item": `${siteUrl}/${state.toLowerCase()}` },
        { "@type": "ListItem", "position": 3, "name": `${cityName} Insulation Contractors`, "item": `${siteUrl}${cityUrl}` }
      ]
    }
  }
}

