class Order < ApplicationRecord
  belongs_to :user
  belongs_to :address
  belongs_to :status
  has_many :order_products, dependent: :delete_all
  has_many :products, through: :order_products

  accepts_nested_attributes_for :order_products, allow_destroy: true

  validates :order_number, :subtotal, presence: true
  validates :order_number, uniqueness: true
  validate :validate_tax

  def validate_tax
    unless (gst && pst && !hst) || (!gst && !pst && hst)
      errors.add(:gst, "Incorrect tax information.")
      errors.add(:pst, "Incorrect tax information.")
      errors.add(:hst, "Incorrect tax information.")
    end
  end

  def name
    order_number
  end
end
