import { ReactNode, useRef } from 'react'
import { useInView } from 'framer-motion'
import { Box, CircularProgress } from '@mui/material'

interface LazySectionProps {
    children: ReactNode
    minHeight?: string | number
}

export default function LazySection({ children, minHeight = '50vh' }: LazySectionProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "0px 0px 200px 0px" })

    return (
        <div ref={ref} style={{ minHeight }}>
            {isInView ? (
                children
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight }}>
                    <CircularProgress color="secondary" size={40} thickness={4} />
                </Box>
            )}
        </div>
    )
}