json.addresses do
  json.array! @addresses do |ad|
    json.extract! ad, :id, :street_no, :apt_no, :city, :postal_code, :user_id, :province_id
    json.province ad.province
  end
end
