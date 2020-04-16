class Province < ApplicationRecord
  has_many :addresses

  validates :name, :abbr, presence: true
  validates :abbr, format: { with: /\A[A-Z]{2}\z/ }
  validate :validate_tax

  def validate_tax
    unless (gst_rate && pst_rate && !hst_rate) || (!gst_rate && !pst_rate && hst_rate)
      errors.add(:gst_rate, "Incorrect tax information.")
      errors.add(:pst_rate, "Incorrect tax information.")
      errors.add(:hst_rate, "Incorrect tax information.")
    end
  end
end
