import { PrismaClient } from '@prisma/client'

// Create(), findUnique() are methods provided by PrismaClient
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

// The password field is excluded only in this query
export const findUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        omit: {
            password: true
        }
    })
    return user 
}

// Update the user's profilePic based on the provided id and return the updated user object.
export const updateUserProfile = async (id, profilePic) => {   
    const user = await prisma.user.update({
        where: {
            id
        },
        data: {
            profilePic
        }
    })
    return user
}