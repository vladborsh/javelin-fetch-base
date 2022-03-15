FROM node:12.18.3
WORKDIR /app 

COPY package.json package.json 
COPY package-lock.json package-lock.json 
RUN npm ci 
COPY . . 
EXPOSE 3000 
RUN npm install -g nodemon


CMD [ "nodemon", "index.js" ]
