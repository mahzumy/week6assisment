import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(req){
    const { name, email, password } = await req.json();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data:{
                name,
                email,
                password: hashedPassword
            }
        })
        return NextResponse.json({message:"Member Created Succesfully"},{status:200})
    } catch (error) {
        return NextResponse.json({message:"Error"},{status:500})
    }
}

    