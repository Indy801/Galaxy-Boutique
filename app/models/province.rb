class Province < ApplicationRecord
  validates :name, :abbr, presence: true
end
