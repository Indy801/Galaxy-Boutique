class ProductsController < ApplicationController
  def index
    @total_pages = Product.page(1).total_pages
    @page_num = extract_page_param(params[:page])
    @products = if @page_num
                  Product.page(@page_num)
                else
                  Product.all
                end
    @page_num ||= 0
  end

  def show
    @product = Product.find(params[:id])
  end

  private

  def extract_page_param(page_num)
    if !page_num.nil? && page_num.match?(/^\d+$/)
      page_num.to_i
    else
      false
    end
  end
end
