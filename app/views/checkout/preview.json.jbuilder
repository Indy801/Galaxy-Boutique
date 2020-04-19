json.products do
  json.array! @order_preview do |o|
    json.detail do
      json.extract! o[:detail], :id, :name
      if o[:detail].image.attached?
        json.image url_for(o[:detail].image)
      else
        json.image image_path("cute_controller.jpg")
      end
    end
    json.quantity o[:quantity]
    json.sale_price o[:sale_price]
  end
end
json.subtotal @total
json.original_total @original_total
json.discount_total @discount_total
json.gst @gst if @gst
json.pst @pst if @pst
json.hst @hst if @hst
json.total @grand_total if @grand_total
