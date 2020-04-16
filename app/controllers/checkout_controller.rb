class CheckoutController < ApplicationController
  protect_from_forgery unless: -> { request.format.json? }
  before_action :check_login

  def preview
    if check_params

      address = check_address
      if address === false
        render json: { error: "Address #{params[:address]} not found." }, status: :not_found
        return
      end

      products = Product.all
      @order_preview = []
      @total = 0
      @original_total = 0
      @discount_total = 0
      params[:cart].each do |item|
        product_detail = products.find(item[:id]) # N problem
        quantity = item[:quantity]
        sale_price = (product_detail.price * (1 - product_detail.discount_percent)).round(2) * quantity
        @total += sale_price
        @original_total += product_detail.price * quantity
        @discount_total += (product_detail.price * product_detail.discount_percent).round(2) * quantity
        order_item = {
          detail:     product_detail,
          quantity:   quantity,
          sale_price: sale_price
        }
        @order_preview << order_item
      end
      # result = { order: order_preview, subtotal: total, original_total: original_total, discount_total: discount_total }

      if address
        @gst = (@total * address.province.gst_rate).round(2) if address.province.gst_rate
        @pst = (@total * address.province.pst_rate).round(2) if address.province.pst_rate
        @hst = (@total * address.province.hst_rate).round(2) if address.province.hst_rate
        @grand_total = @total + (@gst || 0) + (@pst || 0) + (@hst || 0)
      end

    else
      render json: { error: "Invalid params." }, status: :bad_request
    end
  end

  private

  def check_login
    if user_signed_in?
      @user = current_user
    else
      render json: { error: "Please login first." }, status: :unauthorized
    end
  end

  def check_params
    cart = params[:cart]
    if cart.class.to_s == "Array"
      cart.each do |item|
        return false if !item[:id] || !item[:quantity]
      end
    else
      false
    end
  end

  def check_address
    if params[:address]&.to_s&.match?(/^\d+$/)
      begin
        @user.addresses.find(params[:address])
      rescue StandardError
        false
      end
    end
  end
end
