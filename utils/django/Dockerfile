FROM python:3.8-slim-buster

ENV PYTHONBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /exo

RUN apt-get update \
  # dependencies for building Python packages
  && apt-get install -y build-essential \
  # psycopg2 dependencies
  && apt-get install -y libpq-dev \
  # Translations dependencies
  && apt-get install -y gettext \
  # versatileimage dependencies
  && apt-get install -y libmagic-dev \
  # postgres client install
  && apt-get install -f -y postgresql-client \
  # cleaning up unused files
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /exo/

RUN python -m pip install --upgrade pip  \
    && pip install -r requirements.txt \
    && useradd -ms /bin/bash 1000


COPY --chown=1000:1000 . /exo/

RUN chmod 0700 entrypoint.sh


ENTRYPOINT [ "./entrypoint.sh" ]

USER 1000
