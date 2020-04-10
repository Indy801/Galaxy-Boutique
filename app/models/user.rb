class User < ApplicationRecord
  has_many :addresses
  has_many :orders

  validates :email, :password, :alias, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
end
