class Province < ApplicationRecord
  has_many :addresses

  validates :name, :abbr, presence: true
  validates :abbr, format: { with: /\A[A-Z]{2}\z/ }
end
