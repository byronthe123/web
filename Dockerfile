FROM node:14.16.1

WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

COPY package-lock.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
