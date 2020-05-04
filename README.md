# Galaxy Boutique

This react and rails project is a project for an academic course.
React is served using the "react-rails" gem.

## Descriptions
This is an eCommerce website built on react (front-end) and rails (back-end) that simulate the selling of video games online.

It contains the following functionalities:

* View all the products of the website
* Add products to shopping cart
* Register and login as a user
* Add or edit address information as a user
* Checkout and place order as a user
* Make a payment as a user (Powered by Stripe)
* View order history as a user
* Edit the company information page as an admin
* Add or edit products or orders as an admin
* Upload images for products as an admin

## Develop locally
To develop the project locally, you need to install the following:

* Ruby 2.6.5
* Node.js
* Yarn
* Sqlite 3
* The following libaraies: `libsqlite3-dev`, `build-essential`, `libssl-dev`, `libreadline-dev`, `libyaml-dev`, `libxml2-dev`, `libxslt1-dev`, `libcurl4-openssl-dev`, `libffi-dev`, `libpq-dev`, `libmariadb-dev`

### Change the configuration file
In config/database.yml

Uncomment in (or put in) the following
```yaml
development:
  <<: *default
  database: db/development.sqlite3
```
And comment out (or delete) the following
```yaml
development:
  adapter: mysql2
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  host: db
  database: galaxy_dev
  username: root
  password: Password01
  timeout: 5000
```

In config/webpacker.yml

Find these lines in the `dev_server` section
```yaml
host: webpacker
port: 3035
public: webpacker:3035
hmr: true
```
Change them to
```yaml
host: localhost
port: 3035
public: localhost:3035
hmr: false
```

### Instal dependencies
```
bundle install && yarn install
```

### Set up database
```
rails db:create
rails db:migrate
```

### Start the development server locally
```
rails server
```
or
```
rails server -b [your_ip] -p [port]
```
Default binding is localhost and on port 3000.

## Develop on Docker
To develop using docker, you need to install the following:

* Docker
* Docker Compose

### Build the image
```
docker-compose build
```

### Install the dependencies
```
docker-compose run --rm app yarn install
```

### Set up the database
```
docker-compose run --rm app rails db:migrate
```
Or after starting up the development server
```
docker-compose exec app rails db:migrate
```

### Starting the development server
```
docker-compose up
```
You can access your development server at localhost:3000.

### Persist database data to local file system
By default the database data for the database container only saved inside the container. These data will be lost if the container is removed.

To enable database data to store in the local file system, modified the docker-compose.yml file and uncomment the following
```yaml
# At the end of "db" section
    volumes:
        - galaxy-dev-vol:/var/lib/mysql
# At the very bottom (Not in the "db" section)
volumes:
    galaxy-dev-vol:
```

## Seed the database with sample data
Use the following command the seed the database with sample data.
```sh
# Local
rails db:seed

# Docker
docker-compose exec app rails db:seed
```
The sample data contains

* 1 admin user to access active admin
* 2 sample categories
* 13 sample products
* 4 order status
* 6 Canadian provinces with their sales tax rate
* About page and contact us page with sample content
* 1 sample user
* 2 sample address associate with the user

Modify the seed.rb file to change the data to be seeded into the database.

## Reset database

### Local
Reset the database without seeding
```
rails db:drop
rails db:create
rails db:migrate
```
Reset and re-seed the database
```
rails db:reset
```

### Docker
You can use the command above to reset the database using `docker-compose exec app [command]`, for example:
```
docker-compose exec app rails db:create
```
Use of `db:reset` in docker environment is not recommended as it will cause errors.
