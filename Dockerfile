FROM mhart/alpine-node:6.2.1

# add project to build
COPY src /root/mockup-noticias/src
COPY package.json /root/mockup-noticias/package.json
COPY newrelic.js /root/mockup-noticias/newrelic.js
WORKDIR /root/mockup-noticias
RUN npm install

ENV PORT 4242

EXPOSE 4242

CMD ["npm", "start"]
