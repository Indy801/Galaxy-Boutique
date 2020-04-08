class CreateOrders < ActiveRecord::Migration[6.0]
  def change
    create_table :orders do |t|
      t.string :order_number
      t.float :subtotal
      t.float :gst
      t.float :pst
      t.float :hst
      t.references :status, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
