json.extract! @order, :id, :order_number, :subtotal, :gst, :pst, :hst, :original_total, :discount_total
json.products do
  json.array! @order_products do |o|
    json.detail do
      json.extract! o.product, :id, :name
      if o.product.image.attached?
        json.image url_for(o.product.image)
      else
        json.image image_path("cute_controller.jpg")
      end
    end
    json.quantity o.quantity
    json.sale_price (o.price * o.quantity).round(2)
  end
end
json.total (@order.subtotal + (@order.gst || 0) + (@order.pst || 0) + (@order.hst || 0)).round(2)
