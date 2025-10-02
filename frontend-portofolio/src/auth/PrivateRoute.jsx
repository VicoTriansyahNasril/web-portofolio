//src/auth/PrivateRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export default function PrivateRoute({ children }) {
    const { token } = useAuth()
    if (!token) return <Navigate to="/admin/login" replace />
    return children
}