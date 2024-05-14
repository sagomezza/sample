FROM node:16-alpine as build_image
RUN apk update && apk upgrade --no-cache 
# TODO: temporary workaround until UID issue with Alpine is fixed https://github.com/npm/uid-number/issues/3
RUN npm config set unsafe-perm true
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package*.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
RUN npm run build
CMD [ "npm", "start" ]


FROM node:16-alpine as final_image 
RUN apk update && apk upgrade --no-cache  
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY --chown=node --from=build_image /usr/src/app/package*.json ./
COPY --chown=node --from=build_image /usr/src/app/tsconfig*.json ./
COPY --chown=node --from=build_image /usr/src/app/tslint.json ./
COPY --chown=node --from=build_image /usr/src/app/node_modules ./node_modules
COPY --chown=node --from=build_image /usr/src/app/dist ./dist
EXPOSE 3000
RUN export PACKAGE_VERSION=$(npm run version --silent)
CMD [ "npm", "start" ]