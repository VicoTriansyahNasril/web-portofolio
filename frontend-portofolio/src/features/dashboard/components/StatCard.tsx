import { ReactNode } from 'react'
import { Paper, Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'

interface StatCardProps {
    icon: ReactNode
    title: string
    value: number | string
    color: 'primary' | 'secondary' | 'success' | 'warning'
}

export default function StatCard({ icon, title, value, color }: StatCardProps) {
    return (
        <motion.div whileHover={{ y: -4 }}>
            <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3, borderRadius: 3 }}>
                <Box sx={{
                    width: 56, height: 56, borderRadius: '50%',
                    display: 'grid', placeItems: 'center',
                    bgcolor: `${color}.main`, color: 'white',
                    boxShadow: 3
                }}>
                    {icon}
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>{title}</Typography>
                    <Typography variant="h4" fontWeight={800}>{value}</Typography>
                </Box>
            </Paper>
        </motion.div>
    )
}