class ProvincesController < ApplicationController
  def index
    @provinces = Province.all
  end

  def show
    @province = Province.find(params[:id])
  end
end
