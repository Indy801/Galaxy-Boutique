class Page < ApplicationRecord
  validates :url, :title, presence: true
  validates :url, uniqueness: true
end
