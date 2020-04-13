class RegistrationsController < Devise::RegistrationsController
  protect_from_forgery unless: -> { request.format.json? }
  respond_to :json

  private

  # def respond_with(resource, _opts = {})
  #   render json: resource
  # end

  # def respond_to_on_destroy
  #   head :no_content
  # end

  # def create
  #   build_resource(sign_up_params)

  #   resource.save
  #   render_resource(resource)
  # end
end
