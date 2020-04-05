class CategoriesController < ApplicationController
  def index
    @categories = Category.all
  end

  def show
    @category = Category.includes(:products).find(params[:id])

    @total_product_pages = @category.products.page(1).total_pages
    @product_page_num = extract_page_param(params[:page])
    @products = if @product_page_num
                  @category.products.page(@product_page_num)
                else
                  @category.products.all
                end
    @product_page_num ||= 0
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
