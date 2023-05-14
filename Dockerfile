FROM node:18.5.0

WORKDIR /app/medusa

COPY package.json .
COPY yarn.* .

# RUN npm install -g yarn
RUN yarn
# RUN npm install -g npm@8.1.2
# RUN npm install -g @medusajs/medusa-cli@latest
# RUN npm install -g typescript
# RUN npm install

# RUN ./node_modules/.bin/medex init

COPY . .

RUN yarn build

# ENTRYPOINT ["npm","run", "start:prod"]
ENTRYPOINT ["yarn","start"]
