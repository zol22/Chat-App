import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const registerUser = async (name, email, password, profilePic) => {
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password,
            profilePic        }
    })
    return user 
}

export const findUser = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    return user
}
