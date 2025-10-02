//src/auth/authContext.js
import { createContext } from 'react'

export const AuthContext = createContext({
    token: null,
    login: async () => { },
    logout: () => { },
})
