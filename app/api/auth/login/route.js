// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

// export async function POST(req) {
//     try {
//         const { email, password } = await req.json();
//         if ( !email || !password) {
//             return NextResponse.json(
//               { message: "All fields are required." },
//               { status: 400 }
//             );
//           }


//           const existingUser=await prisma.user.findUnique({
//             where:{
//                 email
//             }
//           })

//           if(!existingUser){
//             return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
//           }

//           const isPasswordValid = await bcrypt.compare(password, user.password);
//           if (!isPasswordValid) {
//             return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
//           }



//     } catch (err) {
//         console.log(err)
//     }


// }