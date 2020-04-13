class UsersController < ApplicationController
  # before_action :authenticate_user!

  def info
    if user_signed_in?
      @user = current_user
      render json: @user
    else
      render json: { error: "Please login first" }, status: :unauthorized
    end
  end
end
