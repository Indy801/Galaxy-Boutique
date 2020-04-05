json.extract! @product, :id, :name, :description, :price, :quantity_in_stock, :discount_percent, :created_at, :updated_at
json.image url_for(@product.image) if @product.image.attached?
