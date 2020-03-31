class Product < ApplicationRecord
  belongs_to :category

  validates :product_number, :name, :price, presence: true
  validates :product_number, uniqueness: true
  has_one_attached :image
end
