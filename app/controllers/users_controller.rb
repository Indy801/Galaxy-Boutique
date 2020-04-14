class UsersController < ApplicationController
  protect_from_forgery unless: -> { request.format.json? }
  before_action :check_login

  def info
    render json: @user
  end

  def new_address
    unless check_address_params
      render json: { error: "Invalid address params provided." }, status: :bad_request
      return
    end

    begin
      province = Province.find(params[:province])
    rescue StandardError
      render json: { errors: "Province #{params[:province]} not found." }, status: :not_found
      return
    end

    address = province.addresses.build(
      street_no:   params[:street],
      apt_no:      params[:apt],
      city:        params[:city],
      postal_code: params[:pcode],
      user:        @user
    )

    if address.valid?
      address.save
      render json: { address: address }
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
      province = Province.find(params[:province])
    rescue StandardError
      render json: { errors: "Province #{params[:province]} not found." }, status: :not_found
      return
    end

    address.street_no = params[:street]
    address.apt_no = params[:apt]
    address.city = params[:city]
    address.postal_code = params[:pcode]
    address.province = province

    if address.valid?
      address.save
      render json: { address: address }
    else
      render json: { errors: address.errors.messages }, status: :bad_request
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

  def check_address_params
    params[:street] && params[:city] && params[:province] && params[:pcode] && params[:province].match?(/^\d+$/)
  end
end
