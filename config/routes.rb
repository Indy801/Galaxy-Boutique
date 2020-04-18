Rails.application.routes.draw do
  scope "/api" do
    resources :provinces, :categories, :products,
              only: %i[index show], defaults: { format: :json }
    resources :pages, param: :url_link, only: %i[index show], defaults: { format: :json }
    get "search", to: "search#search", as: "search", defaults: { format: :json }
    get "/shopping_cart", to: "products#shopping_cart", as: "shopping_cart", defaults: { format: :json }
    post "/checkout/preview", to: "checkout#preview", as: "checkout_preview", defaults: { format: :json }
    post "/checkout/place", to: "checkout#place_order", as: "checkout_place_order", defaults: { format: :json }
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

  scope "/api/user/" do
    get "info", to: "users#info", as: "user_info"
    post "addresses/new", to: "users#new_address", as: "user_address_new"
    post "addresses/edit/:id", to: "users#edit_address", as: "user_address_edit"
    get "addresses", to: "users#get_addresses", as: "user_address_get"
    delete "addresses/del/:id", to: "users#delete_address", as: "user_address_delete"
    get "orders", to: "users#orders", as: "user_orders", defaults: { format: :json }
  end

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  # React routes
  root to: "client#index"
  get "*path", to: "client#index", as: "react", constraints: lambda { |req|
    req.path.exclude? "rails/active_storage"
  }
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
