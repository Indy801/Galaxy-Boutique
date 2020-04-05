json.products do
  json.array! @products, partial: "product", as: :product
end
