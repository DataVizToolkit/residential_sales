class SalesFigure < ActiveRecord::Base
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
end
