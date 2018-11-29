##########
## Base ##
##########

# Sets up the base image.

# FROM ubuntu:bionic-20181018 as base_
FROM node:10.13.0-stretch as base_

RUN echo 'Installing essential packages.' \
    && \
    apt-get update \
    && \
    apt-get install --assume-yes --no-install-recommends --fix-missing --fix-broken \
        iputils-ping \
        postgresql-client \
        osm2pgsql \
        postgis

RUN echo '>>> Cleaning up' \
    && \
    apt-get clean --yes \
    && \
    apt-get autoclean --yes \
    && \
    apt-get autoremove --yes \
    && \
    rm -rf /var/lib/apt/lists/* \
    && \
    rm -rf /tmp/*

ENV APP_DIR='/app'

WORKDIR ${APP_DIR}

COPY package*.json ./

# Copy and setup Docker healthcheck.
COPY healthcheck/docker-healthcheck /usr/local/bin/
RUN chmod a+rx /usr/local/bin/docker-healthcheck

# Copy and setup Docker entrypoint.
COPY ./entrypoint/docker-entrypoint.sh /usr/local/bin/
RUN chmod a+rx /usr/local/bin/docker-entrypoint.sh

# Copy and setup other executables/scripts.
COPY ./bin/wait-for-it.sh /usr/local/bin/
RUN chmod a+rx /usr/local/bin/wait-for-it.sh

#################
## Development ##
#################

# Installs packages needed for building.

FROM base_ AS dev_

ENV NODE_ENV='development'

COPY .eslintignore ./
COPY *.json ./
COPY *.js ./
COPY .*.js ./
COPY .*rc ./

RUN npm install

##########
## Test ##
##########

# Runs tests.

FROM dev_ AS test_

ENV NODE_ENV='test'

COPY src ./src

###########
## Build ##
###########

# Build the app.

FROM dev_ AS build_

COPY src ./src
RUN npm run build

################
## Production ##
################

# Contains only the built files for production use.

FROM base_ AS prod_

ENV NODE_ENV='production'

COPY --from=build_ "${APP_DIR}/dist" ./dist
RUN chown --recursive node:node "${APP_DIR}"

USER node
RUN npm install
