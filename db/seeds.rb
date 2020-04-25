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

if Rails.env.development?
  # Products
  Product.destroy_all
  Category.destroy_all
  Order.destroy_all
  Status.destroy_all
  Address.destroy_all
  Province.destroy_all
  Page.destroy_all

  # Categories
  Category.create(name: "Physical Games", description: "Video game discs or cartages.")
  Category.create(name: "Digital Games", description: "Video games that you can download from the cloud.")

  # Products
  Category.find_by(name: "Physical Games").products.build(
    product_number:    "P0001",
    name:              "Animal Corssing: New Horizons",
    description:       "The animal crossing you know and love! Except new this time! With more stuffs!",
    price:             79.99,
    quantity_in_stock: 2000,
    discount_price:    57.99
  ).save
  Category.find_by(name: "Physical Games").products.build(
    product_number:    "P0002",
    name:              "Mario Kart 8 Deluxe",
    description:       "Experence the intense races by racing in Mario Kart. Don't forget to use item to your advantage!",
    price:             79.99,
    quantity_in_stock: 3000,
    discount_price:    nil
  ).save
  Category.find_by(name: "Physical Games").products.build(
    product_number:    "P0003",
    name:              "Super Mario Odyssey",
    description:       "Your favourite 3D mario game is back with richer map!",
    price:             79.99,
    quantity_in_stock: 3500,
    discount_price:    nil
  ).save
  Category.find_by(name: "Digital Games").products.build(
    product_number:    "D0001",
    name:              "Half-Life: Alyx",
    description:       "Half-Life is back!! In VR this time! Grab your HTC Vive/Oculus/Valve Index and play!",
    price:             79.99,
    quantity_in_stock: 3500,
    discount_price:    nil
  ).save
  Category.find_by(name: "Digital Games").products.build(
    product_number:    "D0002",
    name:              "UNO",
    description:       "Everyone's faviourite card game is now on Uplay! Come and destroy your friends in a game of UNO!",
    price:             19.99,
    quantity_in_stock: 3500,
    discount_price:    9.99
  ).save
  Category.find_by(name: "Physical Games").products.build(
    product_number:    "P0004",
    name:              "Super Mario Maker 2",
    description:       "Build your dream levels in various 2D mario games!",
    price:             79.99,
    quantity_in_stock: 3500,
    discount_price:    nil
  ).save
  Category.find_by(name: "Physical Games").products.build(
    product_number:    "P0005",
    name:              "Luigi's Mansion 3",
    description:       "Luigi is invited to a hotel with Mario, Peach and Toads. What will happen this time?",
    price:             79.99,
    quantity_in_stock: 2000,
    discount_price:    nil
  ).save
  Category.find_by(name: "Digital Games").products.build(
    product_number:    "D0003",
    name:              "Borderlands 3",
    description:       "After defeating Handsome Jack, what will the vault hunter do? Will they stay on Pandora or go search for another treasure?",
    price:             79.99,
    quantity_in_stock: 1500,
    discount_price:    nil
  ).save
  Category.find_by(name: "Digital Games").products.build(
    product_number:    "D0004",
    name:              "Call of Duty: Modern Warfare",
    description:       "Your favourite Call of Duty series is back! But with more ways to play!",
    price:             79.99,
    quantity_in_stock: 2000,
    discount_price:    59.99
  ).save
  Category.find_by(name: "Digital Games").products.build(
    product_number:    "D0005",
    name:              "Minecraft",
    description:       "Top selling game of all time! Come and join everyone and build your own world. Or play it the way you want!",
    price:             24.99,
    quantity_in_stock: 20_000,
    discount_price:    nil
  ).save
  Category.find_by(name: "Digital Games").products.build(
    product_number:    "D0006",
    name:              "Cities: Skylines",
    description:       "Build your dream city in Cities: Skylines!",
    price:             24.99,
    quantity_in_stock: 2000,
    discount_price:    nil
  ).save
  Category.find_by(name: "Physical Games").products.build(
    product_number:    "P0006",
    name:              "Pokemon: Sword",
    description:       "You are now challenged to defeat our new champion, the Sword. Collect pokemon and challenge the champion!",
    price:             79.99,
    quantity_in_stock: 2000,
    discount_price:    nil
  ).save
  Category.find_by(name: "Physical Games").products.build(
    product_number:    "P0007",
    name:              "Super Smash Bros",
    description:       "Your favorite Nintendo fighting game is back!",
    price:             79.99,
    quantity_in_stock: 2000,
    discount_price:    nil
  ).save

  # Statuses
  pending_status = Status.new(name: "Pending")
  pending_status.id = 1
  pending_status.save

  paid_status = Status.new(name: "Paid")
  paid_status.id = 2
  paid_status.save

  shipped_status = Status.new(name: "Shipped")
  shipped_status.id = 3
  shipped_status.save

  delivered_status = Status.new(name: "Delivered")
  delivered_status.id = 4
  delivered_status.save

  # Provinces
  mb = Province.create(name: "Manitoba", abbr: "MB", gst_rate: 0.05, pst_rate: 0.07)
  Province.create(name: "British Columbia", abbr: "BC", gst_rate: 0.05, pst_rate: 0.07)
  on = Province.create(name: "Ontario", abbr: "ON", hst_rate: 0.13)
  Province.create(name: "Alberta", abbr: "AB", gst_rate: 0.05, pst_rate: 0)
  Province.create(name: "Saskatchewan", abbr: "SK", gst_rate: 0.05, pst_rate: 0.06)
  Province.create(name: "Quebec", abbr: "QC", gst_rate: 0.05, pst_rate: 0.09975)

  # Company Pages
  Page.create(url: "about", title: "About", content: "# Some Title\r\n\r\nSome **information** about your *website*.\r\n\r\n
    The company pages support markdown syntax. To learn more about markdown [click here](https://daringfireball.net/projects/markdown/).\r\n\r\n
    --------\r\n\r\n
    List more information about your website.\r\n\r\n
    * The mission of your company\r\n
    * The strategy plan\r\n
    * The management team\r\n")
  Page.create(url: "contact_us", title: "Contact Us", content: "Your contact information.")

  # User
  user = User.create!(email: "user@example.com", password: "Password01", password_confirmation: "Password01")

  # Address
  user.addresses.create(street_no: "160 Princess Street", apt_no: "P204", city: "Winnipeg", province: mb, postal_code: "R3B 1K9")
  user.addresses.create(street_no: "20 Main Street", city: "Toronto", province: on, postal_code: "M5J 1E6")

end
