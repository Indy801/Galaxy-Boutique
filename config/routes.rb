Rails.application.routes.draw do
  scope "/api" do
    resources :provinces, :categories, :products,
              only: %i[index show], defaults: { format: :json }
  end

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  # React routes
  root to: "client#index"
  get "*", to: "client#index", as: "react"

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
