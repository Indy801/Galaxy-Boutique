json.extract! @category, :id, :name, :description, :created_at, :updated_at
json.products do
  json.array! @category.products, partial: "products/product", as: :product
end
