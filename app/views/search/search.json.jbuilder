json.results do
  json.array! @search_result, partial: "products/product", as: :product
end
