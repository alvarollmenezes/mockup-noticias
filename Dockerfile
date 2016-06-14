FROM mhart/alpine-node:5.11.1

# add project to build
COPY src /root/mockup-agenda
WORKDIR /root/mockup-agenda
RUN npm install

EXPOSE 4242

CMD ["node", "app.js"]
