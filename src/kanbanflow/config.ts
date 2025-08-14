export const KANBAN_CONFIG = {
    BASE_URL: 'https://kanbanflow.com/api/v1',
    API_TOKEN: process.env.KANBAN_API_TOKEN || '',
    ENDPOINTS: {
        BOARD: '/board',
        TASKS: '/tasks'
    }
} as const;

export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json'
} as const;