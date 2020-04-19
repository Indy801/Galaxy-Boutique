json.extract! @order, :id, :order_number, :subtotal, :gst, :pst, :hst, :original_total, :discount_total, :status
json.address do
  json.extract! @order.address, :id, :street_no, :apt_no, :city, :postal_code, :province, :created_at, :updated_at
end
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
