import { Paper, Stack, Typography, Box, Button } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { Achievement } from '../types'

export default function AchievementList({ achievements }: { achievements: Achievement[] }) {
    if (!achievements.length) return null

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {achievements.map((ach) => (
                <Paper key={ach.id} className="p-4 flex flex-col h-full hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                    <Stack spacing={2} flex={1}>
                        <Box className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white">
                            <EmojiEventsIcon fontSize="medium" />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>{ach.title}</Typography>
                            <Typography variant="subtitle2" color="primary" className="mt-1">{ach.issuer}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(ach.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" flex={1}>
                            {ach.description}
                        </Typography>
                        {ach.credential_url && (
                            <Button
                                variant="outlined"
                                size="small"
                                endIcon={<OpenInNewIcon />}
                                href={ach.credential_url}
                                target="_blank"
                                fullWidth
                            >
                                {ach.link_text || 'View Credential'}
                            </Button>
                        )}
                    </Stack>
                </Paper>
            ))}
        </div>
    )
}