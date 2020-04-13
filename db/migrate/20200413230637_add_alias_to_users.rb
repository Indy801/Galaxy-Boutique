class AddAliasToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :alias, :string
  end
end
