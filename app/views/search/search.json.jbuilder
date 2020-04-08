json.results do
  json.array! @search_result, partial: "products/product", as: :product
end
json.page @page_num
json.total_pages @total_pages
