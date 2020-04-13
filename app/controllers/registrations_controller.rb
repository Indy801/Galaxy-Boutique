class RegistrationsController < Devise::RegistrationsController
  protect_from_forgery unless: -> { request.format.json? }
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    render json: resource
  end
end
