class Address < ApplicationRecord
  belongs_to :province
  belongs_to :user

  validates :street_no, :city, presence: true
  validates :postal_code, format: { with: /\A[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d\z/ }
end
