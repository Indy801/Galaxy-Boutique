class SessionsController < Devise::SessionsController
  protect_from_forgery unless: -> { request.format.json? }
  respond_to :json

  def auth_options
    { scope: resource_name, recall: "#{controller_path}#failure" }
  end

  def failure
    resource = { error: "Incorrect email or password." }
    render json: resource, status: :unauthorized
  end

  private

  def respond_with(resource, _opts = {})
    render json: resource
  end

  def respond_to_on_destroy
    head :no_content
  end
end
