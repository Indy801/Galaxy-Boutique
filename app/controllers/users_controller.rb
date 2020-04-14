class UsersController < ApplicationController
  protect_from_forgery unless: -> { request.format.json? }
  before_action :check_login

  def info
    render json: @user
  end

  # Addresses

  def new_address
    unless check_address_params
      render json: { error: "Invalid address params provided." }, status: :bad_request
      return
    end

    begin
      province = Province.find(params[:province_id])
    rescue StandardError
      render json: { errors: "Province #{params[:province_id]} not found." }, status: :not_found
      return
    end

    address = province.addresses.build(
      street_no:   params[:street_no],
      apt_no:      params[:apt_no],
      city:        params[:city],
      postal_code: params[:postal_code],
      user:        @user
    )

    if address.valid?
      address.save
      @address = address
      render template: "users/address.json"
    else
      render json: { errors: address.errors.messages }, status: :bad_request
    end
  end

  def edit_address
    unless check_address_params
      render json: { error: "Invalid address params provided." }, status: :bad_request
      return
    end

    begin
      address = @user.addresses.find(params[:id])
    rescue StandardError
      render json: { errors: "Address #{params[:id]} not found." }, status: :not_found
      return
    end

    begin
      province = Province.find(params[:province_id])
    rescue StandardError
      render json: { errors: "Province #{params[:province_id]} not found." }, status: :not_found
      return
    end

    address.street_no = params[:street_no]
    address.apt_no = params[:apt_no]
    address.city = params[:city]
    address.postal_code = params[:postal_code]
    address.province = province

    if address.valid?
      address.save
      @address = address
      render template: "users/address.json"
    else
      render json: { errors: address.errors.messages }, status: :bad_request
    end
  end

  def get_addresses
    add_list = []
    @user.addresses.includes(:province).each do |ad|
      add_list << ad
    end

    @addresses = add_list
    render template: "users/addresses.json"
  end

  private

  def check_login
    if user_signed_in?
      @user = current_user
    else
      render json: { error: "Please login first." }, status: :unauthorized
    end
  end

  def check_address_params
    params[:street_no] && params[:city] && params[:province_id] && params[:postal_code] && params[:province_id].to_s.match?(/^\d+$/)
  end
end
