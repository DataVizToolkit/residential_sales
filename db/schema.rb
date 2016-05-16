# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160516192037) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "sales_figures", force: :cascade do |t|
    t.integer  "year"
    t.string   "geo_code"
    t.string   "jurisdiction"
    t.string   "zipcode"
    t.integer  "total_sales"
    t.float    "median_value"
    t.float    "mean_value"
    t.integer  "sales_inside_pfa"
    t.float    "median_value_in_pfa"
    t.float    "mean_value_in_pfa"
    t.integer  "sales_outside_pfa"
    t.float    "median_value_out_pfa"
    t.float    "mean_value_out_pfa"
    t.float    "latitude"
    t.float    "longitude"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

end
