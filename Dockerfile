###########
## base_ ##
###########

FROM ubuntu:bionic-20181018 as base_

RUN echo 'Installing essential packages.' \
    && \
    apt-get update \
    && \
    apt-get install --assume-yes --no-install-recommends --fix-missing --fix-broken \
        iputils-ping \
        postgresql-client \
        osm2pgsql

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


##########
## dev_ ##
##########

FROM base_ as dev_

# Copy and setup Docker healthcheck.
COPY healthcheck/docker-healthcheck /usr/local/bin/
RUN chmod a+rx /usr/local/bin/docker-healthcheck

# Copy and setup Docker entrypoint.
COPY ./entrypoint/docker-entrypoint.sh /usr/local/bin/
RUN chmod a+rx /usr/local/bin/docker-entrypoint.sh

# Copy and setup other executables/scripts.
COPY ./bin/wait-for-it.sh /usr/local/bin/
RUN chmod a+rx /usr/local/bin/wait-for-it.sh
