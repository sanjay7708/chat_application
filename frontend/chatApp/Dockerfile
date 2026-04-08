FROM node:20-alpine AS build 

WORKDIR /chatapp

COPY package*.json ./
RUN npm install 

COPY . .
RUN npm run build

# production stage
FROM nginx:alpine

# copy build files
COPY --from=build /chatapp/dist /usr/share/nginx/html

# 🔥 ADD THIS LINE (IMPORTANT)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
