FROM node:20 AS build
WORKDIR /usr/src/app
COPY backend/package*.json ./
RUN npm i --legacy-peer-deps
COPY backend/ . 
RUN npm run build

FROM node:20
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY backend/package*.json ./  
RUN npm install --only=production
EXPOSE 3000
CMD ["node", "dist/main.js"]