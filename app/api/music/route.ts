import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const res = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=shinyhats&api_key=${process.env.LAST_FM_KEY}&limit=2&extended=1&format=json`,
    {
      cache: "no-store",
      method: "GET",
    }
  );
  const data = await res.json();
  return NextResponse.json(data);
}
