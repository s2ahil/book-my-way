// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   // List of protected routes
//   const protectedRoutes = ["/book", "/profile"];

//   // If the user is NOT authenticated and tries to visit a protected route
//   if (!token && protectedRoutes.includes(req.nextUrl.pathname)) {
//     return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login
//   }

//   return NextResponse.next();
// }

// // Apply middleware only to certain routes
// export const config = {
//   matcher: ["/book", "/profile"], // Only protect these pages
// };
