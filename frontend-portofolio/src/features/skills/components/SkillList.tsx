import { Box, Typography, Chip } from '@mui/material'
import { motion } from 'framer-motion'
import { Skill } from '../types'

const getSkillIcon = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '').replace(/\./g, 'dot')
    const map: Record<string, string> = {
        'c#': 'csharp', 'c++': 'cplusplus', '.net': 'dotnet'
    }
    return map[slug] || slug
}

export default function SkillList({ skills }: { skills: Skill[] }) {
    const grouped = skills.reduce((acc, skill) => {
        if (!acc[skill.group]) acc[skill.group] = []
        acc[skill.group].push(skill)
        return acc
    }, {} as Record<string, Skill[]>)

    const orderedGroups = Object.keys(grouped)

    return (
        <Box className="flex flex-col gap-6 mt-4">
            {orderedGroups.map((group) => (
                <motion.div key={group} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    <Typography variant="h6" fontWeight={700} className="mb-3 flex items-center gap-2">
                        <span className="w-1 h-6 rounded bg-gradient-to-b from-purple-500 to-cyan-500" />
                        {group}
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                        {grouped[group].map((skill) => (
                            <Chip
                                key={skill.id}
                                label={skill.name}
                                icon={
                                    <img
                                        src={`https://cdn.simpleicons.org/${getSkillIcon(skill.name)}`}
                                        className="w-4 h-4 dark:invert"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                }
                                className="font-semibold"
                            />
                        ))}
                    </div>
                </motion.div>
            ))}
        </Box>
    )
}