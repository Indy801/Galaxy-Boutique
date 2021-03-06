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
        cur_price = product_detail.discount_price || product_detail.price
        sale_price = (cur_price * quantity).round(2)
        @total += sale_price
        @original_total += (product_detail.price * quantity).round(2)
        @discount_total += (product_detail.price - (product_detail.discount_price || product_detail.price)).round(2) * quantity
        order_item = {
          detail:     product_detail,
          quantity:   quantity,
          cur_price:  cur_price,
          sale_price: sale_price
        }
        @order_preview << order_item
      end

      @original_total = @original_total.round(2)
      @discount_total = @discount_total.round(2)
      @total = @total.round(2)

      if address
        @gst = (@total * address.province.gst_rate).round(2) if address.province.gst_rate
        @pst = (@total * address.province.pst_rate).round(2) if address.province.pst_rate
        @hst = (@total * address.province.hst_rate).round(2) if address.province.hst_rate
        @grand_total = @total + (@gst || 0) + (@pst || 0) + (@hst || 0)
        @grand_total = @grand_total.round(2)
      end

    else
      render json: { error: "Invalid params." }, status: :bad_request
    end
  end

  def place_order
    address = check_address
    if check_params && address
      @subtotal = 0
      preview
      @order = Order.create(user: @user, address: address, subtotal: @total, gst: @gst, pst: @pst, hst: @hst,
        original_total: @original_total, discount_total: @discount_total,
        order_number: order_number(address),
        status: Status.find_by(name: "Pending"))
      @order_preview.each do |order_item|
        @order.order_products.create(
          product:  order_item[:detail],
          price:    order_item[:cur_price],
          quantity: order_item[:quantity]
        )
      end

      @order_products = @order.order_products

      render template: "checkout/show"
    else
      render json: { error: "Invalid params." }, status: :bad_request
    end
  end

  def retrieve_order
    @order = @user.orders.find(params[:id])
    @order_products = @order.order_products

    render template: "checkout/show"
  end

  def payment
    order = @user.orders.find(params[:id])
    amount_to_pay = (order.subtotal + (order.gst || 0) + (order.pst || 0) + (order.hst || 0)).round(2)
    intent = Stripe::PaymentIntent.create(
      amount:   (amount_to_pay * 100).to_i,
      currency: "cad"
    )
    render json: { client_secret: intent.client_secret }
  end

  def mark_paid
    if params[:stripe_id] && params[:order_id]
      order = @user.orders.find(params[:order_id])
      order.stripe_id = params[:stripe_id]
      order.status = Status.find_by(name: "Paid")
      order.save
      head :no_content
    else
      render json: { error: "Invalid params." }, status: :bad_request
    end
  end

  def stripe_pub_key
    render json: { pub_key: Rails.configuration.stripe[:publishable_key] }
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

  def order_number(address)
    address_num = address.id if address
    timestamp = (Time.now.to_i % 10_000).to_s
    "R#{@user.id}#{rand(100)}#{address_num}#{rand(10)}#{timestamp}#{rand(20)}"
  end
end
