class Zipcode < ActiveRecord::Base
  belongs_to :sales_figure, :primary_key => :zipcode, :foreign_key => :zcta5ce10
end
