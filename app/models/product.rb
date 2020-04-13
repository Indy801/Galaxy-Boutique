class Product < ApplicationRecord
  belongs_to :category
  # has_many :order_products
  # has_many :orders, through: :order_products

  validates :product_number, :name, :price, presence: true
  validates :product_number, uniqueness: true
  has_one_attached :image
end
