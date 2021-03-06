FROM ruby:2.6.5
ARG deploy=false

# Add node
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -

# Add yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# Install
RUN apt-get update && \
    apt-get install -y \
    nodejs \
    yarn \
    libsqlite3-dev sqlite3 \
    build-essential libssl-dev libreadline-dev libyaml-dev \
    libxml2-dev libxslt1-dev libcurl4-openssl-dev libffi-dev libpq-dev \
    libmariadb-dev

WORKDIR /appdev

COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock
RUN bundle install

# Add yarn install with argument here
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN test "$deploy" = "true" && yarn install || echo "run yarn install when starting up app"

COPY . .

# EXPOSE 3000

# CMD ["rails", "server", "-b", "0.0.0.0"]
