import { http, HttpResponse } from 'msw'

const skills = [
    { id: 1, name: 'React', group: 'Frontend' },
    { id: 2, name: 'Go', group: 'Backend' },
]

export const handlers = [
    http.get('/api/admin/skills', () => {
        return HttpResponse.json(skills)
    }),
]