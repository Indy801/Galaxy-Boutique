class SearchController < ApplicationController
  def search
    puts generate_query_name
    @search_result_name = Product.where(generate_query_name)
    @search_result_desc = Product.where(generate_query_desc)
    @search_result = @search_result_name | @search_result_desc
  end

  private

  def generate_query_name
    return "name LIKE '%'" if params[:q] == ""

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
    return "description LIKE '%'" if params[:q] == ""

    search_keywords = params[:q].split(" ")

    sql_querys = []
    sql_params = []
    search_keywords.each do |keyword|
      sql_querys.push("description LIKE ?")
      sql_params.push("%#{keyword}%")
    end

    [sql_querys.join(" AND ")] + sql_params
  end
end
