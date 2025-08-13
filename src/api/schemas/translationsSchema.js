import { languagesSchema } from '@/api/schemas/languagesSchema.js'

let translations = [
            {
                "id": 0,
                "service_id": 0,
                "language_id": 0,
                "name": "Loading...",
                "description": "Loading...",
                "created_at": "",
                "updated_at": "",
                "language": languagesSchema[0]
            },
            {
                "id": 0,
                "service_id": 0,
                "language_id": 0,
                "name": "Ładowanie...",
                "description": "Ładowanie...",
                "created_at": "",
                "updated_at": "",
                "language": languagesSchema[1]
            }
]



export const translationsSchema = translations
