import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { ReactNode } from 'react'

interface PrivateRouteProps {
    children: ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
    const { token } = useAuth()
    if (!token) return <Navigate to="/admin/login" replace />
    return <>{children}</>
}