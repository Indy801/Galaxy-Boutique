class Address < ApplicationRecord
  belongs_to :user
  belongs_to :province
  before_save :change_postal

  validates :street_no, :city, :postal_code, presence: true
  validates :postal_code, format: { with: /\A[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d\z/ }

  def change_postal
    if postal_code.upcase!.length != 7
      self.postal_code = "#{postal_code[0, 3]} #{postal_code[3, 3]}"
    end
  end
end
