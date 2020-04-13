class RegistrationsController < Devise::RegistrationsController
  before_action :configure_permitted_parameters
  protect_from_forgery unless: -> { request.format.json? }
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    render json: resource
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:alias])
  end
end
