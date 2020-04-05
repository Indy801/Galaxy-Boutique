json.extract! @category, :id, :name, :description, :created_at, :updated_at
json.products do
  json.array! @products, partial: "products/product", as: :product
end
json.product_page @product_page_num
json.total_product_page @total_product_pages
