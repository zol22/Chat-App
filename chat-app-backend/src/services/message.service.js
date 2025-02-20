import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const findAllUsersExceptLoggedInUser = async (loggedInUserId) => {
    const allUsers = await prisma.user.findMany({
        where: {
            NOT: {
                id: loggedInUserId
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            profilePic: true
        }
    })
    return allUsers    

}


/*  Similar Approach:

     where: {
      senderId: { in: [loggedInUserId, userToChatId] }, //  Ensures the sender is either the logged-in user or the other user.
      receiverId: { in: [loggedInUserId, userToChatId] }, // Ensures the receiver is either the logged-in user or the other user.
    }
*/
export const findMessages = async (loggedInUserId, userToChatId) => {
    const messages = await prisma.message.findMany({
        where: {
            OR: [ //  Used to specify that messages can satisfy either of the two conditions within the array.
                {
                    AND: [ // First Condition (AND):
                        {
                            senderId: loggedInUserId // The message was sent by the logged-in user.
                        },
                        {
                            receiverId: userToChatId // The message was received by the other user.
                        }
                    ]
                },
                {
                    AND: [ // Second Condition (AND):
                        {
                            senderId: userToChatId // The message was sent by the other user.
                        },
                        {
                            receiverId: loggedInUserId // The message was received by the logged-in user.
                        }
                    ]
                }
            ]
        },
        select: {
            id: true,
            text: true,
            senderId: true,
            receiverId: true,
            createdAt: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    })
    return messages     
}

export const createNewMessage = async (loggedInUserId, receiverId, text, imageUrl) => {
    const message = await prisma.message.create({
        data: {
            senderId: loggedInUserId,
            receiverId,
            text,
            image: imageUrl
        }
    })

    return message;
}