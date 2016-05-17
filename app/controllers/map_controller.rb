class MapController < ApplicationController
  def index; end
  def map_data
    @zipcodes = SalesFigure.zipcode_data
  end
end
