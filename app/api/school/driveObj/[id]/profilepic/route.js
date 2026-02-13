//@ts-check
import { prismaError } from "@/lib/prismaErrorResponse";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { NextResponse } from "next/server";
import { PROFLE_PIC } from "@/lib/server_cache/cache_tags_name";

/**
 * 
 * @param {string} url 
 * @returns {string | null}
 */
function extractDriveId(url) {
  try {
    const u = new URL(url);

    const match = u.pathname.match(/\/d\/([^/]+)/);
    if (match) return match[1];

    if (u.searchParams.get("id"))
      return u.searchParams.get("id");

    return null;
  } catch {
    return null;
  }
}

/**
 * @param {import("next/server").NextRequest} request 
 * @param {{params:Promise<{id:string}>}} context
 * @returns {Promise<NextResponse>}
 */
export async function GET(request, context) {
  try {
    const { id } = await context.params;

    const profilepic = await PROFLE_PIC.getProfilePic(id);

    if (!profilepic?.link) {
      return NextResponse.json({data:"Not Found"}, { status: st4xx.notFound });
    }

    const fileId = extractDriveId(profilepic.link);

    if (!fileId) {
      return NextResponse.json({data:"Invalid Drive Link"}, { status: st4xx.notFound });
    }

    // thumbnail = paling stabil
    const driveUrl = `https://drive.google.com/uc?id=${fileId}&sz=w1000`;

    const res = await fetch(driveUrl);

    if (!res.ok) {
      return NextResponse.json({data:"Drive Fetch Failed"}, { status: st5xx.internalServerError });
    }

    return new NextResponse(res.body, {
      status: st2xx.ok,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "text",
        "Cache-Control":
          "public, s-maxage=360, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    const knownErr = prismaError(e);
    if (knownErr) return knownErr;

    console.error(e);

    return new NextResponse("Internal Server Error", {
      status: st5xx.internalServerError,
    });
  }
}