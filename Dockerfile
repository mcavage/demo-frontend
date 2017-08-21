# docker build -t mcavage/crow-demo_frontend .
FROM node:8.0
WORKDIR /app
COPY package.json .
# COPY package.json package-lock.json .
COPY . .
RUN npm install
expose 8080
CMD [ "npm", "start" ]
