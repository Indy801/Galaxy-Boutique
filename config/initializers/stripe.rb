Rails.configuration.stripe = {
  publishable_key: ENV["STRIPE_PUB_KEY"],
  secret_key: ENV["STRIPE_SECRET_KEY"]
}

puts "Stripe secret key is not set." unless Rails.configuration.stripe[:secret_key]
puts "Stripe publishable key is not set." unless Rails.configuration.stripe[:publishable_key]

Stripe.api_key = Rails.configuration.stripe[:secret_key]
