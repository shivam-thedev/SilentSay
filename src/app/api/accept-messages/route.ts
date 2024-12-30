import { getServerSession } from "next-auth"; //is session se ham user ko extract kr skte hai
import { authOptions } from "../auth/[...nextauth]/option"; //session ko auth-option chahiye hote hai
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request:Request){
    dbConnect()

    const session = await getServerSession(authOptions)

    const user : User = session?.user

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message:'Not authenticated',
            },
            { status: 401 }
        ) 
    }

    const userId = user._id

    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage:acceptMessages},
            {new:true}
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message:'failed to update user status to accept messages',
                },
                { status: 400 }
            ) 
        }

        return Response.json(
            {
                success: true,
                message:'Message acceptance status updated successfully',
                updatedUser
            },
            { status: 400 }
        ) 
    } catch (error) {
        console.log("failed to update user status to accept messages",error)
        return Response.json(
            {
                success: false,
                message:'failed to update user status to accept messages',
            },
            { status: 500 }
        ) 
    }
}