class RenameDiscountColumn < ActiveRecord::Migration[6.0]
  def change
    rename_column :products, :discount_percent, :discount_price
  end
end
