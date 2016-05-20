# Maryland Residential Sales

This repository provides downloadable code 
for the book, "Data Visualization Toolkit"; see [DataVisualizationToolkit.com](http://www.datavisualizationtoolkit.com).

These example programs are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.<br/>
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"/></a>

## To Run

This is a rails app that runs on Ruby 2.2.3.  Clone the repo and run:

* `bundle install`
* `bundle exec rake db:create db:migrate`

## Checkpoints

* Ch 1, "D3 and Rails"
  - Initial setup ([21ca40f](https://github.com/DataVizToolkit/residential_sales/tree/ch01.1))
  - Import residential sales ([d5f88f1](https://github.com/DataVizToolkit/residential_sales/tree/ch01.2))
  - Draw the pie chart ([23a7d53](https://github.com/DataVizToolkit/residential_sales/tree/ch01.3))
* Ch 2, "Transforming Data with ActiveRecord and D3"
  - Legible labels and Mouseover Effects ([92e2198](https://github.com/DataVizToolkit/residential_sales/tree/ch02.1))
  - You Can Function ([d750142](https://github.com/DataVizToolkit/residential_sales/tree/ch02.2))
  - Bar chart ([9038c66](https://github.com/DataVizToolkit/residential_sales/tree/ch02.3))
  - Scatter Plot ([322cf3e](https://github.com/DataVizToolkit/residential_sales/tree/ch02.4))
  - Scatter Plot Revisited ([90c69fc](https://github.com/DataVizToolkit/residential_sales/tree/ch02.5))
  - Boxplot ([2ab0aaf](https://github.com/DataVizToolkit/residential_sales/tree/ch02.6))
* Ch 5, "Window Functions, Subqueries, and Common Table Expression"
  - Scatter Plot with mortgage pmt ([ac2f6c9](https://github.com/DataVizToolkit/residential_sales/tree/ch05.1))
  - `row_number()` window function in console (not in app)
* Ch 10, "Making Maps with Leaflet and Rails"
  - Import zip code shapefile and map zip codes ([75c7845](https://github.com/DataVizToolkit/residential_sales/tree/ch10.1))
  - Choropleth ([6dcae4d](https://github.com/DataVizToolkit/residential_sales/tree/ch10.2))
* Ch 11, "Querying Geospatial Data"
  - Bounding box in console (not in app)
  - Items near a point in console (not in app)
  - Calculating distance in console (not in app)
