class ProductsController < ApplicationController
  def index
    @filtered_products = Product.where(extract_filter_param)
    @total_pages = @filtered_products.page(1).total_pages
    @page_num = extract_page_param(params[:page])
    @products = if @page_num
                  @filtered_products.page(@page_num)
                else
                  @filtered_products.all
                end
    @page_num ||= 0
  end

  def show
    @product = Product.find(params[:id])
  end

  def shopping_cart
    @products = Product.find(params[:id])
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
    sql_params = []
    if params.key?(:new)
      sql_fragment.push("created_at >= ?")
      sql_params << (DateTime.now - 3.day)
    end
    if params.key?(:ru)
      sql_fragment.push("(created_at <> updated_at AND updated_at >= ?)")
      sql_params << (DateTime.now - 3.day)
    end
    sql_fragment.push("discount_price IS NOT NULL") if params.key?(:os)
    sql_statement = sql_fragment.join(" OR ")
    if sql_statement != ""
      [sql_statement] + sql_params
    else
      ""
    end
  end
end
