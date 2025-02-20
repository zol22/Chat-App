import { User } from "./userTypes";

interface Message {
    id: number;  // Unique identifier for each message
    text: string;  // Message content
    image?: string | null;  // Message content
    senderId: number;  // ID of the user who sent the message
    receiverId: number;  // ID of the user receiving the message
    createdAt: string;  // Timestamp
}


export interface ChatState {
    messages: Message[]; // For now is any
    users: User[]; //  ✅ Uses shared User type
    selectedUser: User | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    getUsers: () => Promise<void>;
    getMessages: (userToChatId: number) => Promise<void>
    sendMessage: (messageData: { text: string , image?: string }) => Promise<void> // For now is any
    setSelectedUser: (selectedUser: User) => void

}