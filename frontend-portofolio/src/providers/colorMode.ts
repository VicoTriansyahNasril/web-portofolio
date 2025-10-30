import { createContext, useContext } from 'react'

interface ColorModeContextType {
    mode: 'light' | 'dark'
    toggle: () => void
    setMode: (mode: 'light' | 'dark') => void
}

export const ColorModeContext = createContext<ColorModeContextType>({
    mode: 'light',
    toggle: () => { },
    setMode: () => { },
})

export const useColorMode = () => useContext(ColorModeContext)