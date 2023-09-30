import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { sign } from "jsonwebtoken";

export async function POST(req){
    const { email, password } = await req.json();

    try {
        const findUser = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!findUser){
            return NextResponse.json({message:"User not found"}, {status:400})
        }

        const isPasswordValid = await bcrypt.compare(password, findUser.password);
        
        if(!isPasswordValid){
            return NextResponse.json({message:"Invalid Password"}, {status:400});
        }

        const payLoad = {
            id: findUser.id,
            name: findUser.name,
            email: findUser.email
        }
       
        const token = sign(payLoad, process.env.SECRET_KEY, {expiresIn: "1d"});

        return NextResponse.json({token, data:payLoad, message:"User Login Succesfully"},{status:201})
    } catch (error) {
        return NextResponse.json({message:"Error"},{status:500})
    }
}

    