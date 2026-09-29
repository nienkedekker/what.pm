import groq from "groq";

// Expands internal links in Portable Text body
const bodyWithInternalLinks = `
  body[] {
    ...,
    markDefs[] {
      ...,
      _type == "internalLink" => {
        ...,
        "reference": reference-> {
          _type,
          "slug": slug.current
        }
      }
    }
  }
`;

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    description,
    lastUpdated,
    ${bodyWithInternalLinks}
  }
`;

// Trips no longer have their own pages, but their locations still feed the map
export const tripLocationsQuery = groq`
  *[_type == "trip" && draft != true] | order(date desc) {
    title,
    date,
    location
  }
`;

export const guestbookEntriesQuery = groq`
  *[_type == "guestbookEntry"] | order(createdAt desc) {
    _id,
    name,
    website,
    message,
    createdAt
  }
`;
