class SalesFigure < ActiveRecord::Base
  has_many :zipcodes, :primary_key => :zipcode, :foreign_key => :zcta5ce10

  def self.mortgage_payment_data
    sql = <<-SQL.strip_heredoc
      SELECT id, year, jurisdiction, zipcode, total_sales,
        median_value, pmt(4.25, median_value::int)
      FROM sales_figures
      WHERE median_value > 999
      ORDER BY 3, 6;
    SQL
    connection.execute(sql)
  end

  def self.zipcode_data
    sql = <<-SQL
      SELECT sales.id, sales.zipcode, sales.jurisdiction, sales.total_sales,
        sales.median_value, z.gid, z.statefp10, z.zcta5ce10, z.geoid10,
        z.classfp10, z.mtfcc10, z.funcstat10,
        ST_AsGeoJSON(z.geom)::JSON AS geometry
      FROM sales_figures sales
      JOIN zipcodes z ON sales.zipcode = z.zcta5ce10
    SQL
    connection.execute(sql)
  end
end
