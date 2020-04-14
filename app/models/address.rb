class Address < ApplicationRecord
  belongs_to :user
  belongs_to :province

  validates :street_no, :city, presence: true
  validates :postal_code, format: { with: /\A[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d\z/ }
end
