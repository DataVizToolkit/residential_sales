class CreateSalesFigures < ActiveRecord::Migration
  def change
    create_table :sales_figures do |t|
      t.integer :year
      t.string :geo_code
      t.string :jurisdiction
      t.string :zipcode
      t.integer :total_sales
      t.float :median_value
      t.float :mean_value
      t.integer :sales_inside_pfa
      t.float :median_value_in_pfa
      t.float :mean_value_in_pfa
      t.integer :sales_outside_pfa
      t.float :median_value_out_pfa
      t.float :mean_value_out_pfa
      t.float :latitude
      t.float :longitude

      t.timestamps null: false
    end
  end
end
