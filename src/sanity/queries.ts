import groq from "groq";

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

export const notesQuery = groq`
  *[_type == "note" && draft != true] | order(date desc) {
    _id,
    title,
    slug,
    description,
    date,
    cover,
    tags
  }
`;

export const noteBySlugQuery = groq`
  *[_type == "note" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    date,
    cover,
    tags,
    ${bodyWithInternalLinks}
  }
`;

export const tripsQuery = groq`
  *[_type == "trip" && draft != true] | order(date desc) {
    _id,
    title,
    slug,
    description,
    date,
    location,
    cover,
    tags
  }
`;

export const tripBySlugQuery = groq`
  *[_type == "trip" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    date,
    location,
    cover,
    tags,
    ${bodyWithInternalLinks}
  }
`;

