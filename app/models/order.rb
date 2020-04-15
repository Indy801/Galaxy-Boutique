class Order < ApplicationRecord
  belongs_to :user
  belongs_to :address
  belongs_to :status
  has_many :order_products
  has_many :products, through: :order_products

  accepts_nested_attributes_for :order_products, allow_destroy: true
end
