import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {userSignupSchema, userSigninSchema,createRoomSchema} from "@repo/commmon/types"
import {prismaClient} from "@repo/database/client"
import cors from "cors";

const corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200
}

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.post("/signup",async (req,res) => {
    // console.log(req.body);
    const userData = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    }
    const {success} = userSignupSchema.safeParse(userData);
    // console.log(userData);
    if(!success){
        res.status(400).json({
            message: "Data missing.",
        })
        return;
    }

    const existingUser = await prismaClient.user.findFirst({
        where:{
            email: userData.email
        }
    });

    if(existingUser){
        res.json({
            message: "User with this email already exists."
        });
        return;
    }
    
    const user = await prismaClient.user.create({
        data:userData
    });

    if(!user){
        res.json({
            message: "Wrror while creating the user."
        })
        return;
    }

    const token = jwt.sign(
        {
            id:user.id
        },JWT_SECRET
    )
    res.json({
        token,
        // name: user.name,
        message: "User signed up."
    })
    return;
})

app.post("/signin",async (req, res) => {
    const userData = {
        email: req.body.email,
        password: req.body.password,
    }
    const {success} = userSigninSchema.safeParse(userData);
    if(!success){
        res.json({
            message: "Data missing."
        })
        return;
    }
    const user = await prismaClient.user.findFirst({
        where:{
            email: userData.email,
            password: userData.password
        }
    });

    if(!user){
        res.json({
            message: "User Does Not Exist."
        })
        return;
    }

    const token = jwt.sign(
        {
            id:user.id
        },JWT_SECRET
    );
    res.setHeader("authorization",token).json({
        token,
        // name: user.name,
        message: "User Signed in."
    });
})

app.post("/createRoom",middleware,async (req, res) => {
    const parsedData = createRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            message: "Incorrect Inputs"
        })
        return;
    }
    //@ts-ignore  //Fix the error.
    const userId = req.userId
    const room = await prismaClient.room.create({
        data:{
            slug: parsedData.data.name,
            adminId: userId
        }
    })
    if(!room){
        res.json({
            message: "Error while creating the room."
        })
    }
    res.json({
        id: room.id,
        message: "Room created."
    })

})

// Use room name in URL
app.get("/chats/:roomId", async (req,res)=>{
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where:{
            roomId: roomId
        },
        orderBy:{
            id: "desc"
        },
        take: 50
    });
    res.json({
        messages
    })
    return;
})

app.get("/room/:slug",async (req,res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where:{
            slug
        }
    });

    res.json({
        room
    });
})

/*
app.post("/chats/:roomId",async (req,res)=>{
    // console.log(req.body);
    if(req.body.element.type){
        try {
            const message = req.body.element;
            const roomId = parseInt(req.body.roomId);
            const userId = "95746a04-42c7-411a-beb9-5cad43568cef";
            // console.log(JSON.stringify(message));
            await prismaClient.chat.create({
                data:{
                    message: JSON.stringify(message),
                    roomId,
                    userId
                }
            });
            res.status(200).json("Data Recieved");
        } catch (error) {
            console.log(error);
            res.status(400).json("Data Not Recieved");
            return;
        }
    } else{
        res.status(400).json("Data Not Recieved");
    }
})
    */

app.get('/user',middleware, async (req,res) => {
    const user = await prismaClient.user.findUnique({
        where:{
            //@ts-ignore
            id: req.userId
        }
    })
    if(!user){
        res.json({
            message: "User not found."
        })
        return;
    }
    //@ts-ignore
    // console.log(req.userId);
    
    res.json({
        name: user.name
    });
    return;
})

app.listen(8000);