json.type "FeatureCollection"
json.features @zipcodes do |zipcode|
  json.type "Feature"
  json.id Integer(zipcode["id"])
  json.properties do
    json.zipcode zipcode["zipcode"]
    json.county zipcode["jurisdiction"]
    json.total_sales Integer(zipcode["total_sales"])
    json.median_value Integer(zipcode["median_value"])
  end
  json.geometry JSON.parse(zipcode["geometry"])
end
