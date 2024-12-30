import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(req:Request) {
    await  dbConnect()
    const {username,content} = await req.json()
    try {
        const user = await UserModel.findOne({username})
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message:'User not found',
                },
                { status: 404 }
            ) 
        }

        // is  user accepting the messages
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message:'User is not accepting messages',
                },
                { status: 400 }
            ) 
        }

        const newMessage = {content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                message:'message sent successfully',
            },
            { status: 400 }
        ) 
    } catch (error) {
        console.log("failed to send messages",error)
        return Response.json(
            {
                success: false,
                message:'internal server error',
            },
            { status: 500 }
        )
    }
}