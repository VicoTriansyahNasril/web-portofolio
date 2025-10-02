//src/providers/colorMode.js
import { createContext, useContext } from 'react'

export const ColorModeContext = createContext({
    mode: 'light',
    toggle: () => { },
    setMode: () => { },
})

export const useColorMode = () => useContext(ColorModeContext)
