FROM mhart/alpine-node:10

# Add wait-for-it
COPY wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh

ENTRYPOINT [ "/bin/bash", "-c" ]
CMD ["./wait-for-it.sh" , "--strict" , "--timeout=300" , "curl" , "-f" , "http://localhost:1337"]

WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY ./ ./

ENV NUXT_HOST=0.0.0.0
ENV NODE_ENV=production

RUN npm run generate
CMD [ "npm", "start" ]
