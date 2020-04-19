class AddOriginalTotalAndDiscountTotalToOrders < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :original_total, :float
    add_column :orders, :discount_total, :float
  end
end
