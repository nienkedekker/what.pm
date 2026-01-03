import { useMemo } from "react";
import DottedMapModule from "dotted-map";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// @ts-expect-error - CJS/ESM interop
const DottedMap = DottedMapModule.default || DottedMapModule;

interface Trip {
  title: string;
  slug: { current: string };
  location: string;
  date: string;
}

interface Props {
  trips: Trip[];
}

const previousTrips: string[] = [
  "Bali, Indonesia",
  "Bangkok, Thailand",
  "Chiang Mai, Thailand",
  "Copenhagen, Denmark",
  "Lisbon, Portugal",
  "Oslo, Norway",
  "Paris, France",
  "Stockholm, Sweden",
  "Willemstad, Curaçao",
  "Berlin, Germany",
  "London, Uk",
  "Vienna, Austria",
  "Dublin, Ireland",
  "Glasgow, Scotland",
  "Palermo, Italy",
  "Taghazout, Morocco"
];

// City coordinates (lat, lng)
const locationCoords: Record<string, { lat: number; lng: number }> = {
  // Europe
  "Copenhagen, Denmark": { lat: 55.6761, lng: 12.5683 },
  "Amsterdam, Netherlands": { lat: 52.3676, lng: 4.9041 },
  "Paris, France": { lat: 48.8566, lng: 2.3522 },
  "London, Uk": { lat: 51.5074, lng: -0.1278 },
  "Berlin, Germany": { lat: 52.52, lng: 13.405 },
  "Rome, Italy": { lat: 41.9028, lng: 12.4964 },
  "Palermo, Italy": { lat: 38.1157, lng: 13.3615 },
  "Barcelona, Spain": { lat: 41.3851, lng: 2.1734 },
  "Lisbon, Portugal": { lat: 38.7223, lng: -9.1393 },
  "Dublin, Ireland": { lat: 53.3498, lng: -6.2603 },
  "Stockholm, Sweden": { lat: 59.3293, lng: 18.0686 },
  "Oslo, Norway": { lat: 59.9139, lng: 10.7522 },
  "Helsinki, Finland": { lat: 60.1699, lng: 24.9384 },
  "Prague, Czech Republic": { lat: 50.0755, lng: 14.4378 },
  "Vienna, Austria": { lat: 48.2082, lng: 16.3738 },
  "Budapest, Hungary": { lat: 47.4979, lng: 19.0402 },
  "Athens, Greece": { lat: 37.9838, lng: 23.7275 },
  "Edinburgh, Scotland": { lat: 55.9533, lng: -3.1883 },
  "Glasgow, Scotland": { lat: 55.8642, lng: -4.2518 },
  "Reykjavik, Iceland": { lat: 64.1466, lng: -21.9426 },
  "Tbilisi, Georgia": { lat: 41.6938, lng: 44.8015 },
  // Asia
  "Tokyo, Japan": { lat: 35.6762, lng: 139.6503 },
  "Kyoto, Japan": { lat: 35.0116, lng: 135.7681 },
  "Seoul, South Korea": { lat: 37.5665, lng: 126.978 },
  "Beijing, China": { lat: 39.9042, lng: 116.4074 },
  "Shanghai, China": { lat: 31.2304, lng: 121.4737 },
  "Hong Kong": { lat: 22.3193, lng: 114.1694 },
  "Bangkok, Thailand": { lat: 13.7563, lng: 100.5018 },
  "Chiang Mai, Thailand": { lat: 18.7883, lng: 98.9853 },
  "Bali, Indonesia": { lat: -8.3405, lng: 115.092 },
  "Mumbai, India": { lat: 19.076, lng: 72.8777 },
  "Delhi, India": { lat: 28.6139, lng: 77.209 },
  "Dubai, Uae": { lat: 25.2048, lng: 55.2708 },
  "Istanbul, Turkey": { lat: 41.0082, lng: 28.9784 },
  // North America
  "New York, Usa": { lat: 40.7128, lng: -74.006 },
  "San Francisco, Usa": { lat: 37.7749, lng: -122.4194 },
  "Cleveland, Usa": { lat: 41.4993, lng: -81.6944 },
  "Honolulu, Hawaii": { lat: 21.3069, lng: -157.8583 },
  // South America
  "Buenos Aires, Argentina": { lat: -34.6037, lng: -58.3816 },
  "Rio De Janeiro, Brazil": { lat: -22.9068, lng: -43.1729 },
  "Sao Paulo, Brazil": { lat: -23.5505, lng: -46.6333 },
  "Lima, Peru": { lat: -12.0464, lng: -77.0428 },
  "Bogota, Colombia": { lat: 4.711, lng: -74.0721 },
  // Oceania
  "Sydney, Australia": { lat: -33.8688, lng: 151.2093 },
  "Melbourne, Australia": { lat: -37.8136, lng: 144.9631 },
  "Auckland, New Zealand": { lat: -36.8509, lng: 174.7645 },
  // Africa
  "Cape Town, South Africa": { lat: -33.9249, lng: 18.4241 },
  "Marrakech, Morocco": { lat: 31.6295, lng: -7.9811 },
  "Taghazout, Morocco": { lat: 30.545, lng: -9.7083 },
  // Caribbean
  "Willemstad, Curaçao": { lat: 12.1696, lng: -68.99 },
};

function getCoords(location: string): { lat: number; lng: number } | null {
  const normalized = location.toLowerCase().trim();

  for (const [key, coords] of Object.entries(locationCoords)) {
    if (key.toLowerCase() === normalized) {
      return coords;
    }
  }

  for (const [key, coords] of Object.entries(locationCoords)) {
    const keyLower = key.toLowerCase();
    if (normalized.includes(keyLower) || keyLower.includes(normalized)) {
      return coords;
    }
  }

  const parts = normalized.split(",").map((p) => p.trim());
  for (const part of parts) {
    for (const [key, coords] of Object.entries(locationCoords)) {
      const keyLower = key.toLowerCase();
      if (keyLower.includes(part) || part.includes(keyLower.split(",")[0])) {
        return coords;
      }
    }
  }

  return null;
}

export default function TripMap({ trips }: Props) {
  const now = new Date();

  const { svgMap, tripsWithCoords, previousTripsWithCoords, mapDimensions, pastCount, futureCount, previousCount } = useMemo(() => {
    const map = new DottedMap({ height: 55, grid: "diagonal" });

    const tripsWithCoords = trips
      .map((trip) => ({
        ...trip,
        coords: getCoords(trip.location),
        isFuture: new Date(trip.date) > now,
      }))
      .filter((trip) => trip.coords !== null);

    const pastCount = tripsWithCoords.filter((t) => !t.isFuture).length;
    const futureCount = tripsWithCoords.filter((t) => t.isFuture).length;

    // Get coordinates for previous trips (no blog posts)
    const previousTripsWithCoords = previousTrips
      .map((location) => ({ location, coords: getCoords(location) }))
      .filter((t) => t.coords !== null);
    const previousCount = previousTripsWithCoords.length;

    // Get pin positions for overlay (only trips with blog posts are clickable)
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

    // Get pin positions for previous trips (for tooltip overlay)
    const previousPinPositions = previousTripsWithCoords
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

    // Add pins for previous trips (dark grey, no links)
    previousTripsWithCoords.forEach((trip) => {
      if (trip.coords) {
        map.addPin({
          lat: trip.coords.lat,
          lng: trip.coords.lng,
          svgOptions: {
            color: "#71717a",
            radius: 0.6
          },
        });
      }
    });

    // Add pins for each trip with blog post
    tripsWithCoords.forEach((trip) => {
      if (trip.coords) {
        map.addPin({
          lat: trip.coords.lat,
          lng: trip.coords.lng,
          svgOptions: {
            color: trip.isFuture ? "#0ea5e9" : "#d97706",
            radius: 0.6
          },
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
      previousTripsWithCoords: previousPinPositions,
      mapDimensions: { width: map.image.width, height: map.image.height },
      pastCount,
      futureCount,
      previousCount,
    };
  }, [trips]);

  return (
    <TooltipProvider>
      <div className="relative w-full">
        <div
          className="w-full [&_svg]:w-full [&_svg]:h-auto dark:invert dark:hue-rotate-180"
          dangerouslySetInnerHTML={{ __html: svgMap }}
        />

        {/* Previous trips tooltip overlay (rendered first so clickable trips are on top) */}
        <div className="absolute inset-0">
          {previousTripsWithCoords.map((trip: any) => (
            <Tooltip key={trip.location}>
              <TooltipTrigger asChild>
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
                  style={{
                    left: `${(trip.point.x / mapDimensions.width) * 100}%`,
                    top: `${(trip.point.y / mapDimensions.height) * 100}%`,
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{trip.location}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Clickable overlay markers */}
        <div className="absolute inset-0 pointer-events-none">
          {tripsWithCoords.map((trip: any) => (
            <Tooltip key={trip.slug.current}>
              <TooltipTrigger asChild>
                <a
                  href={`/trips/${trip.slug.current}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full hover:scale-125 transition-transform cursor-pointer pointer-events-auto group ${
                    trip.isFuture
                      ? "[&>span]:bg-sky-500/20 [&>span]:group-hover:bg-sky-500/40 dark:[&>span]:bg-sky-400/20 dark:[&>span]:group-hover:bg-sky-400/40"
                      : "[&>span]:bg-amber-500/20 [&>span]:group-hover:bg-amber-500/40 dark:[&>span]:bg-amber-400/20 dark:[&>span]:group-hover:bg-amber-400/40"
                  }`}
                  style={{
                    left: `${(trip.point.x / mapDimensions.width) * 100}%`,
                    top: `${(trip.point.y / mapDimensions.height) * 100}%`,
                  }}
                >
                  <span className="absolute inset-0 rounded-full transition-colors" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>{trip.title} — {trip.location}{trip.isFuture ? " (upcoming)" : ""}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3 bg-white/80 dark:bg-neutral-900/80 px-2 py-1 rounded">
          {pastCount > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              {pastCount} recents
            </span>
          )}
          {futureCount > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              {futureCount} planned
            </span>
          )}
          {previousCount > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
              previous 5 years
            </span>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
