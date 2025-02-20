import { create } from 'zustand'


interface ThemeState {
    theme: string
    setTheme: (theme: string) => void // ✅ Accepts a string directly
}
export const useThemeStore = create<ThemeState>((set)=> ({
    theme: localStorage.getItem("chat-theme") || "coffee", //chat-theme is the key name of localstorage. 'Coffee' is the default theme
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme)
        set({theme})
    }
}))