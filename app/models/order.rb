class Order < ApplicationRecord
  belongs_to :status
  belongs_to :user

  has_many :order_products
  has_many :products, through: :order_products

  validates :order_number, :subtotal, presence: true
  validates :order_number, uniqueness: true
end
