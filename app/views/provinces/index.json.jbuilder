json.array! @provinces do |province|
  json.id province.id
  json.name province.name
  json.abbr province.abbr
end
