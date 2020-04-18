json.orders do
  json.array! @orders do |order|
    json.extract! order, :id, :order_number, :subtotal, :gst, :pst, :hst, :status, :created_at, :updated_at
    json.address do
      json.extract! order.address, :id, :street_no, :apt_no, :city, :postal_code, :province, :created_at, :updated_at
    end

    json.products do
      json.array! order.order_products do |ordpro|
        json.extract! ordpro, :price, :quantity
        json.sale_price (ordpro.price * ordpro.quantity)
        json.detail do
          json.extract! ordpro.product, :id, :name
          if ordpro.product.image.attached?
            json.image url_for(ordpro.product.image)
          else
            json.image image_path("cute_controller.jpg")
          end
        end
      end
    end

    json.total (order.subtotal + (order.gst || 0) + (order.pst || 0) + (order.hst || 0)).round(2)
  end
end
