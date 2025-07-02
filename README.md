### App URL
[http://mamfachowca.mosioneklukasz.pl](http://mamfachowca.mosioneklukasz.pl)

### Docker
Launch Docker app if using Windows
```sh
git clone https://github.com/lukaszmosionek/mamfachowca-FRONTEND-Vue3.git && cd mamfachowca-FRONTEND-Vue3
docker build -t mam_fachowca-vue3 .
docker run -p 8080:80 mam_fachowca-vue3
 ```

### Standard installation(  npm -v 10.9.0, node -v v22.12.0 )
```sh
git clone https://github.com/lukaszmosionek/mamfachowca-FRONTEND-Vue3.git && cd mamfachowca-FRONTEND-Vue3
npm install
npm run dev
npm run build
```
