class CreateProducts < ActiveRecord::Migration[6.0]
  def change
    create_table :products do |t|
      t.string :product_number
      t.string :name
      t.text :description
      t.float :price
      t.integer :quantity_in_stock
      t.float :discount_percent
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
