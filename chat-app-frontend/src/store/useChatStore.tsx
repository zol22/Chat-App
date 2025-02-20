import { create } from 'zustand'
import { axiosInstance } from '../lib/axios';
import { ChatState } from "../types/chatTypes";

export const useChatStore = create<ChatState> ((set, get) => ({
    messages:[],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading:false,
    getUsers: async () => {
        set({isUsersLoading: true})
        try {
            const res = await axiosInstance.get("/message/users")
            set({ users: res.data.filteredUsers}) // ✅ Only store the array, not the whole object
        } finally {
            set({isUsersLoading: false})
        }
    },
    getMessages: async (userToChatId) => {
        set({ isMessagesLoading: true})
        try {
            const res = await axiosInstance.get(`/message/${userToChatId}`)
            set({ messages : res.data})
        } finally {
            set({isMessagesLoading: false})
        }
    },
    sendMessage: async ({ text, image }) => {
        const {selectedUser, messages } = get()
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser?.id}`, {text, image})
            set({ messages: [...messages, res.data]})
        } finally {

        }
    },
    // Todo: optimize this one later
    setSelectedUser: (selectedUser) => {
        set({ selectedUser})
    }
}))