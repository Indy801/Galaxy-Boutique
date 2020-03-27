class CreateProvinces < ActiveRecord::Migration[6.0]
  def change
    create_table :provinces do |t|
      t.string :name
      t.string :abbr
      t.float :gst_rate
      t.float :pst_rate
      t.float :hst_rate

      t.timestamps
    end
  end
end
