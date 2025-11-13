FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]
