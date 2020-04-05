json.partial! "product", product: @product
json.category do
  json.extract! @product.category, :id, :name
end
