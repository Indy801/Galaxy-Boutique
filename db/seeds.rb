# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
if Rails.env.development?
  AdminUser.create!(email: "admin@example.com", password: "password", password_confirmation: "password")
end

# Products
Product.destroy_all
Category.destroy_all

Category.create(name: "Physical Games", description: "Video game discs or cartages.")
Category.create(name: "Digital Games", description: "Video games that you can download from the cloud.")

Category.find_by(name: "Physical Games").products.build(
  product_number:    "P0001",
  name:              "Animal Corssing: New Horizons",
  description:       "The animal crossing you know and love! Except new this time! With more stuffs!",
  price:             79.99,
  quantity_in_stock: 2000,
  discount_price:    0.3
).save
Category.find_by(name: "Physical Games").products.build(
  product_number:    "P0002",
  name:              "Mario Kart 8 Deluxe",
  description:       "Experence the intense races by racing in Mario Kart. Don't forget to use item to your advantage!",
  price:             79.99,
  quantity_in_stock: 3000,
  discount_price:    0
).save
Category.find_by(name: "Physical Games").products.build(
  product_number:    "P0003",
  name:              "Super Mario Odyssey",
  description:       "Your favourite 3D mario game is back with richer map!",
  price:             79.99,
  quantity_in_stock: 3500,
  discount_price:    0
).save
Category.find_by(name: "Digital Games").products.build(
  product_number:    "D0001",
  name:              "Half-Life: Alyx",
  description:       "Half-Life is back!! In VR this time! Grab your HTC Vive/Oculus/Valve Index and play!",
  price:             79.99,
  quantity_in_stock: 3500,
  discount_price:    0
).save
Category.find_by(name: "Digital Games").products.build(
  product_number:    "D0002",
  name:              "UNO",
  description:       "Everyone's faviourite card game is now on Uplay! Come and destroy your friends in a game of UNO!",
  price:             19.99,
  quantity_in_stock: 3500,
  discount_price:    0.5
).save
Category.find_by(name: "Physical Games").products.build(
  product_number:    "P0004",
  name:              "Super Mario Maker 2",
  description:       "Build your dream levels in various 2D mario games!",
  price:             79.99,
  quantity_in_stock: 3500,
  discount_price:    0
).save
Category.find_by(name: "Physical Games").products.build(
  product_number:    "P0005",
  name:              "Luigi's Mansion 3",
  description:       "Luigi is invited to a hotel with Mario, Peach and Toads. What will happen this time?",
  price:             79.99,
  quantity_in_stock: 2000,
  discount_price:    0
).save
Category.find_by(name: "Digital Games").products.build(
  product_number:    "D0003",
  name:              "Borderlands 3",
  description:       "After defeating Handsome Jack, what will the vault hunter do? Will they stay on Pandora or go search for another treasure?",
  price:             79.99,
  quantity_in_stock: 1500,
  discount_price:    0
).save
Category.find_by(name: "Digital Games").products.build(
  product_number:    "D0004",
  name:              "Call of Duty: Modern Warfare",
  description:       "Your favourite Call of Duty series is back! But with more ways to play!",
  price:             79.99,
  quantity_in_stock: 2000,
  discount_price:    0
).save
Category.find_by(name: "Digital Games").products.build(
  product_number:    "D0005",
  name:              "Minecraft",
  description:       "Top selling game of all time! Come and join everyone and build your own world. Or play it the way you want!",
  price:             24.99,
  quantity_in_stock: 20_000,
  discount_price:    0
).save
Category.find_by(name: "Digital Games").products.build(
  product_number:    "D0006",
  name:              "Cities: Skylines",
  description:       "Build your dream city in Cities: Skylines!",
  price:             24.99,
  quantity_in_stock: 2000,
  discount_price:    0
).save
Category.find_by(name: "Physical Games").products.build(
  product_number:    "P0006",
  name:              "Pokemon: Sword",
  description:       "You are now challenged to defeat our new champion, the Sword. Collect pokemon and challenge the champion!",
  price:             79.99,
  quantity_in_stock: 2000,
  discount_price:    0
).save
Category.find_by(name: "Physical Games").products.build(
  product_number:    "P0007",
  name:              "Super Smash Bros",
  description:       "Your favorite Nintendo fighting game is back!",
  price:             79.99,
  quantity_in_stock: 2000,
  discount_price:    0
).save
