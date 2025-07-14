import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function middleware(req: NextRequest) {
  try {
    const response = await fetch(`https://cbc388888bb7.ngrok-free.app/api/auth/check-auth`, {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });
    
    const data: { success: boolean } = await response.json();
    
    if (!data.success) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Auth check failed:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
