Rails.application.routes.draw do
  scope "/api" do
    resources :provinces, :categories, :products,
              only: %i[index show], defaults: { format: :json }
    resources :pages, param: :url_link, only: %i[index show], defaults: { format: :json }
    get "search", to: "search#search", as: "search", defaults: { format: :json }
    get "/shopping_cart", to: "products#shopping_cart", as: "shopping_cart", defaults: { format: :json }
  end

  devise_for :users, path: "/api/user", path_names: {
    sign_in:      "login",
    sign_out:     "logout",
    registration: "signup"
  },
  controllers: {
    sessions:      "sessions",
    registrations: "registrations"
  },
  default: { format: :json }
  get "/api/users/info", to: "users#info", as: "user_info"

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  # React routes
  root to: "client#index"
  get "*path", to: "client#index", as: "react", constraints: lambda { |req|
    req.path.exclude? "rails/active_storage"
  }
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
