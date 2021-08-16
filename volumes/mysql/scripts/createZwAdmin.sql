CREATE USER zw_admin IDENTIFIED BY "zw_pass";
GRANT ALL ON zw_db.windsData TO zw_admin@"%";