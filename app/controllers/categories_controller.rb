class CategoriesController < ApplicationController
  def index
    @categories = Category.all
  end

  def show
    @category = Category.includes(:products).find(params[:id])

    @filtered_products = @category.products.where(extract_filter_param)
    @total_product_pages = @filtered_products.page(1).total_pages
    @product_page_num = extract_page_param(params[:page])
    @products = if @product_page_num
                  @filtered_products.page(@product_page_num)
                else
                  @filtered_products.all
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

  def extract_filter_param
    sql_fragment = []
    sql_fragment.push("date(created_at) >= date('now','-3 day')") if params.key?(:new)
    if params.key?(:ru)
      sql_fragment.push("(date(created_at) <> date(updated_at) AND date(updated_at) >= date('now','-3 day'))")
    end
    sql_fragment.push("discount_percent > 0") if params.key?(:os)
    sql_fragment.join(" OR ")
  end
end
