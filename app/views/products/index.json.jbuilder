json.array! @products do |product|
  json.extract! product, :id, :name, :description, :price, :quantity_in_stock, :discount_percent, :created_at, :updated_at
end