class ResidentialController < ApplicationController
  def index
  end

  def data
    totals = SalesFigure.group(:jurisdiction).sum(:total_sales)
    render :json => { :totals => totals }
  end

  def bar_chart; end
  def bar_data
    bar_data = SalesFigure.
      select(:id, :zipcode, :median_value).
      where(:jurisdiction => 'Baltimore').
      order('median_value DESC, zipcode')
    render :json => { :bar_data => bar_data }
  end
end
