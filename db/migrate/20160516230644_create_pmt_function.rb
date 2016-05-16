class CreatePmtFunction < ActiveRecord::Migration
  def up
    # Create the pmt function
    sql = <<-SQL.strip_heredoc
    CREATE OR REPLACE FUNCTION pmt(
      interest double precision,
      principal integer)
    RETURNS numeric AS $$
      SELECT ROUND(
        CAST(
          (interest/100/12 * principal)
          / (1 - ((1 + (interest/100/12)) ^ -360))
        AS numeric), 0)
    $$ LANGUAGE SQL;
    SQL
    execute(sql)
  end

  def down
    # Drop the pmt function
    execute("DROP FUNCTION pmt(double precision, integer);")
  end
end
