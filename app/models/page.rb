class Page < ApplicationRecord
  validates :url, :title, presence: true
end
