json.array! @products do |product|
  json.extract! product, :id, :name, :description, :price, :quantity_in_stock, :discount_percent, :created_at, :updated_at
  if product.image.attached?
    json.image url_for(product.image)
  else
    json.image image_path("cute_controller.jpg")
  end
end
