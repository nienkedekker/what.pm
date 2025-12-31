import { useMemo } from "react";
import DottedMapModule from "dotted-map";

// @ts-expect-error - CJS/ESM interop
const DottedMap = DottedMapModule.default || DottedMapModule;

interface Trip {
  title: string;
  slug: { current: string };
  location: string;
}

interface Props {
  trips: Trip[];
}

// City coordinates (lat, lng)
const locationCoords: Record<string, { lat: number; lng: number }> = {
  // Europe
  "copenhagen, denmark": { lat: 55.6761, lng: 12.5683 },
  "amsterdam, netherlands": { lat: 52.3676, lng: 4.9041 },
  "paris, france": { lat: 48.8566, lng: 2.3522 },
  "london, uk": { lat: 51.5074, lng: -0.1278 },
  "berlin, germany": { lat: 52.52, lng: 13.405 },
  "rome, italy": { lat: 41.9028, lng: 12.4964 },
  "barcelona, spain": { lat: 41.3851, lng: 2.1734 },
  "lisbon, portugal": { lat: 38.7223, lng: -9.1393 },
  "dublin, ireland": { lat: 53.3498, lng: -6.2603 },
  "stockholm, sweden": { lat: 59.3293, lng: 18.0686 },
  "oslo, norway": { lat: 59.9139, lng: 10.7522 },
  "helsinki, finland": { lat: 60.1699, lng: 24.9384 },
  "prague, czech republic": { lat: 50.0755, lng: 14.4378 },
  "vienna, austria": { lat: 48.2082, lng: 16.3738 },
  "budapest, hungary": { lat: 47.4979, lng: 19.0402 },
  "athens, greece": { lat: 37.9838, lng: 23.7275 },
  "greek islands": { lat: 37.0, lng: 25.0 },
  scotland: { lat: 56.4907, lng: -4.2026 },
  "edinburgh, scotland": { lat: 55.9533, lng: -3.1883 },
  "reykjavik, iceland": { lat: 64.1466, lng: -21.9426 },
  // Asia
  "tokyo, japan": { lat: 35.6762, lng: 139.6503 },
  "kyoto, japan": { lat: 35.0116, lng: 135.7681 },
  "seoul, south korea": { lat: 37.5665, lng: 126.978 },
  "beijing, china": { lat: 39.9042, lng: 116.4074 },
  "shanghai, china": { lat: 31.2304, lng: 121.4737 },
  "hong kong": { lat: 22.3193, lng: 114.1694 },
  "bangkok, thailand": { lat: 13.7563, lng: 100.5018 },
  singapore: { lat: 1.3521, lng: 103.8198 },
  "bali, indonesia": { lat: -8.3405, lng: 115.092 },
  "mumbai, india": { lat: 19.076, lng: 72.8777 },
  "delhi, india": { lat: 28.6139, lng: 77.209 },
  "dubai, uae": { lat: 25.2048, lng: 55.2708 },
  "istanbul, turkey": { lat: 41.0082, lng: 28.9784 },
  // North America
  "new york, usa": { lat: 40.7128, lng: -74.006 },
  "los angeles, usa": { lat: 34.0522, lng: -118.2437 },
  "san francisco, usa": { lat: 37.7749, lng: -122.4194 },
  "chicago, usa": { lat: 41.8781, lng: -87.6298 },
  "miami, usa": { lat: 25.7617, lng: -80.1918 },
  "vancouver, canada": { lat: 49.2827, lng: -123.1207 },
  "toronto, canada": { lat: 43.6532, lng: -79.3832 },
  "mexico city, mexico": { lat: 19.4326, lng: -99.1332 },
  // South America
  "buenos aires, argentina": { lat: -34.6037, lng: -58.3816 },
  "rio de janeiro, brazil": { lat: -22.9068, lng: -43.1729 },
  "sao paulo, brazil": { lat: -23.5505, lng: -46.6333 },
  "lima, peru": { lat: -12.0464, lng: -77.0428 },
  "bogota, colombia": { lat: 4.711, lng: -74.0721 },
  // Oceania
  "sydney, australia": { lat: -33.8688, lng: 151.2093 },
  "melbourne, australia": { lat: -37.8136, lng: 144.9631 },
  "auckland, new zealand": { lat: -36.8509, lng: 174.7645 },
  // Africa
  "cape town, south africa": { lat: -33.9249, lng: 18.4241 },
  "cairo, egypt": { lat: 30.0444, lng: 31.2357 },
  "marrakech, morocco": { lat: 31.6295, lng: -7.9811 },
  "nairobi, kenya": { lat: -1.2921, lng: 36.8219 },
  // Caribbean
  "havana, cuba": { lat: 23.1136, lng: -82.3666 },
};

function getCoords(location: string): { lat: number; lng: number } | null {
  const normalized = location.toLowerCase().trim();

  if (locationCoords[normalized]) {
    return locationCoords[normalized];
  }

  for (const [key, coords] of Object.entries(locationCoords)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }

  const parts = normalized.split(",").map((p) => p.trim());
  for (const part of parts) {
    for (const [key, coords] of Object.entries(locationCoords)) {
      if (key.includes(part) || part.includes(key.split(",")[0])) {
        return coords;
      }
    }
  }

  return null;
}

export default function TripMap({ trips }: Props) {
  const { svgMap, tripsWithCoords, mapDimensions } = useMemo(() => {
    const map = new DottedMap({ height: 55, grid: "diagonal" });

    const tripsWithCoords = trips
      .map((trip) => ({
        ...trip,
        coords: getCoords(trip.location),
      }))
      .filter((trip) => trip.coords !== null);

    // Get pin positions for overlay
    const pinPositions = tripsWithCoords
      .map((trip) => {
        if (trip.coords) {
          const point = map.getPin({
            lat: trip.coords.lat,
            lng: trip.coords.lng,
          });
          return { ...trip, point };
        }
        return null;
      })
      .filter(Boolean);

    // Add pins for each trip (visual only)
    tripsWithCoords.forEach((trip) => {
      if (trip.coords) {
        map.addPin({
          lat: trip.coords.lat,
          lng: trip.coords.lng,
          svgOptions: { color: "#d97706", radius: 0.6 },
        });
      }
    });

    const svg = map.getSVG({
      radius: 0.35,
      color: "#d4d4d8",
      shape: "circle",
      backgroundColor: "transparent",
    });

    return {
      svgMap: svg,
      tripsWithCoords: pinPositions,
      mapDimensions: { width: map.image.width, height: map.image.height },
    };
  }, [trips]);

  return (
    <div className="relative w-full">
      <div
        className="w-full [&_svg]:w-full [&_svg]:h-auto dark:invert dark:hue-rotate-180"
        dangerouslySetInnerHTML={{ __html: svgMap }}
      />

      {/* Clickable overlay markers */}
      <div className="absolute inset-0">
        {tripsWithCoords.map((trip: any) => (
          <a
            key={trip.slug.current}
            href={`/trips/${trip.slug.current}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full hover:scale-125 transition-transform cursor-pointer group"
            style={{
              left: `${(trip.point.x / mapDimensions.width) * 100}%`,
              top: `${(trip.point.y / mapDimensions.height) * 100}%`,
            }}
            title={`${trip.title} — ${trip.location}`}
          >
            <span className="absolute inset-0 rounded-full bg-amber-500/20 group-hover:bg-amber-500/40 dark:bg-amber-400/20 dark:group-hover:bg-amber-400/40 transition-colors" />
          </a>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 bg-white/80 dark:bg-neutral-900/80 px-2 py-1 rounded">
        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
        <span>
          {tripsWithCoords.length} {tripsWithCoords.length === 1 ? "trip" : "trips"}
        </span>
      </div>
    </div>
  );
}
