import noPhoto from '@/assets/no-photo.jpg'
import { translationsSchema } from '@/api/schemas/translationsSchema.js'
import { currenciesSchema } from '@/api/schemas/currenciesSchema.js'
import { photosSchema } from '@/api/schemas/photosSchema.js'

let services = []
for(let i=0; i<=10;i++){
   services.push({
          "id":0,
          "provider_id":0,
          "name": "...",
          "description" : "...",
          "price": "0",
          "currency_id":0,
          "duration": 0,
          "created_at":"",
          "updated_at":"",
          "lang":"",
          "is_favorited":false,
          "provider":{
            "id":0,
            "name":"..."
          },
          "photos" : photosSchema,
          "favorited_by" : [],
          "currency" : currenciesSchema,
          "translations" : translationsSchema
      })
}

export const serviceSchema = services
