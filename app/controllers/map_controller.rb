class MapController < ApplicationController
  def map; end
  def map_data
    @zipcodes = SalesFigure.zipcode_data
  end
end
