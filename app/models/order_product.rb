class OrderProduct < ApplicationRecord
  belongs_to :order
  belongs_to :product

  validates :price, :quantity, presence: true
end
