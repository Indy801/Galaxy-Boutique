json.extract! @category, :id, :name, :description, :created_at, :updated_at
json.products do
  json.array! @category.products do |product|
    json.extract! product, :id, :name, :description, :price, :quantity_in_stock, :discount_percent, :created_at, :updated_at
    json.image url_for(product.image) if product.image.attached?
  end
end
