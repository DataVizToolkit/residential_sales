require 'csv'

namespace :db do
  namespace :seed do
    desc "Import Maryland Residential Sales CSV"
    task :import_maryland_residential_sales => :environment do
      def float(string)
        return nil if string.nil?
        Float(string.sub(/\$/, ''))
      end

      filename = File.join(Rails.root, 'db', 'data_files', 'data.csv')
      CSV.foreach(filename, :headers => true) do |row|
        puts $. if $. % 10000 == 0
        regex  = /.*(\d{2}\.\d*), (-\d{2}\.\d*)/
        latlng = row['Zip Code (Geocoded)'].match(regex)
        values = {
          :year                 => row['Year'],
          :geo_code             => row['Geo Code'],
          :jurisdiction         => row['Jurisdictions'],
          :zipcode              => row['Zipcode'],
          :total_sales          => Integer(row['Tot_Sales']),
          :median_value         => float(row['MedianValue']),
          :mean_value           => float(row['MeanValue']),
          :sales_inside_pfa     => row['Sales_insidePFA'],
          :median_value_in_pfa  => float(row['MedVal_inPFA']),
          :mean_value_in_pfa    => float(row['MeanVal_inPFA']),
          :sales_outside_pfa    => float(row['Sales_OutPFA']),
          :median_value_out_pfa => float(row['MedVal_OutPFA']),
          :mean_value_out_pfa   => float(row['MeanVal_OutPFA']),
          :latitude             => float(latlng[1]),
          :longitude            => float(latlng[2])
        }
        SalesFigure.create(values)
      end
    end
  end
end
