class SearchController < ApplicationController
  def search
    puts generate_query_name
    @search_result_name = generate_category.where(generate_query_name)
    # @search_result_desc = generate_category.where(generate_query_desc)
    # @search_result = @search_result_name | @search_result_desc
    @search_result = @search_result_name
  end

  private

  def generate_query_name
    return "name LIKE '%'" if params[:q] == "" || params[:q].nil?

    search_keywords = params[:q].split(" ")

    sql_querys = []
    sql_params = []
    search_keywords.each do |keyword|
      sql_querys.push("name LIKE ?")
      sql_params.push("%#{keyword}%")
    end

    puts sql_params
    [sql_querys.join(" AND ")] + sql_params
  end

  def generate_query_desc
    return "description LIKE '%'" if params[:q] == "" || params[:q].nil?

    search_keywords = params[:q].split(" ")

    sql_querys = []
    sql_params = []
    search_keywords.each do |keyword|
      sql_querys.push("description LIKE ?")
      sql_params.push("%#{keyword}%")
    end

    [sql_querys.join(" AND ")] + sql_params
  end

  def generate_category
    category_id = params[:c].to_i if !params[:c].nil? && params[:c].match?(/^\d+$/)
    if category_id.nil? || category_id < 1
      Product.all
    else
      Category.find(category_id).products
    end
  end
end
