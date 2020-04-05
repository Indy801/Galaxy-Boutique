json.products do
  json.array! @products, partial: "product", as: :product
end
json.page @page_num
json.total_pages @total_pages
