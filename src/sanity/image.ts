import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const client = createClient({
  projectId: "vuh5pxn1",
  dataset: "production",
  useCdn: true,
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}
