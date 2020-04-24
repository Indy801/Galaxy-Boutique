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

## Install require modules:
```
bundle && yarn
rails webpacker:install:react
```

## Set up database
```
rails db:create
rails db:migrate
```

## Seed the database with sample data
Use the following command the seed the database with sample data.
```
rails db:seed
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

## Start the development server
```
rails server
```
or
```
rails server -b [your_ip] -p [port]
```
Default binding is localhost and on port 3000.
