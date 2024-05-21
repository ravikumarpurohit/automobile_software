const sqlite3 = window.require("sqlite3");
const dbFile = "c:/shivam_bill_data/shivam_database.db";
console.log("dbFile", dbFile);
export const db = new sqlite3.Database(dbFile, (err) => {
  if (err) console.error("Database opening error: ", err);
});
