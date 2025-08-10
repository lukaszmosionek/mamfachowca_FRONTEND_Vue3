import noPhoto from '@/assets/no-photo.jpg'

let services = []
for(let i=0; i<=10;i++){
   services.push({
          "id":0,
          "provider_id":0,
          "name":"Example",
          "description":"Example",
          "price":"999",
          "currency_id":0,
          "duration_minutes":10,
          "created_at":"",
          "updated_at":"",
          "lang":"",
          "is_favorited":false,
          "provider":{
            "id":0,
            "name":"Adam"
          },
          "photos":[
            {
                "id":0,
                "imageable_type":"",
                "imageable_id":0,
                "thumbnail":noPhoto,
                "medium": noPhoto,
                "large":noPhoto,
                "is_main":0,
                "created_at":"",
                "updated_at":""
            }
          ],
          "favorited_by":[

          ],
          "currency":{
            "id":0,
            "code":"USD",
            "symbol":"",
            "rate":"",
            "language_id":0,
            "created_at":null,
            "updated_at":null
          }
      })
}

export const serviceSchema = services
