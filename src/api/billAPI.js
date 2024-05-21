import { db } from "./database";

export const getBillData = async (req) => {
  let search = req?.search ? req.search : "";
  return new Promise((resolve, reject) => {
    let sql = `SELECT bm.*,cm.name FROM bill_master bm INNER JOIN customer_master cm ON cm.id=bm.customerId WHERE cm.name LIKE '${search}%' ORDER BY bm.id DESC`;
    console.log("sql", sql);
    db.all(sql, (err, rows) => {
      if (err) {
        console.error(err);
        let data = { result: "error", message: err.message };
        reject(data);
      }
      let data = { result: "success", data: rows };
      resolve(data);
    });
  });
};

export const getBillDataById = async (id) => {
  console.log("req == ", id);
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM bill_master WHERE id = ${id}`;
    db.all(sql, (err, rows) => {
      if (err) {
        console.error(err);
        let data = { result: "error", message: err.message };
        reject(data);
      }
      let itemSql = `SELECT bt.*, pm.name as item FROM bill_items bt INNER JOIN parts_master pm ON bt.partId = pm.id WHERE billId = ${id}`;
      db.all(itemSql, (err, rowsItem) => {
        if (err) {
          console.error(err);
          let data = { result: "error", message: err.message };
          reject(data);
        }
        rows[0].items = rowsItem;
        let data = { result: "success", data: rows[0] };
        resolve(data);
      });
    });
  });
};

export const saveBill = async (req) => {
  return new Promise(async (resolve, reject) => {
    console.log("req", req);

    let sql = `INSERT INTO bill_master (customerId, kilometer, vehicleNo, billDate, nextDate, totalAmount, discount, netAmount)VALUES(${req.customerId},${req.kilometer},"${req.vehicleNo}","${req.billDate}","${req.nextDate}",${req.totalAmount},${req.discount},${req.netAmount});`;
    db.run(sql, async (err) => {
      if (err) {
        console.log(err);
        let data = { result: "error", message: err.message };
        reject(data);
      }
      db.get("SELECT last_insert_rowid() as id", (err, row) => {
        if (err) {
          console.log(err);
          let data = { result: "error", message: err.message };
          reject(data);
        }
        let lastId = row["id"];
        let items = req.items;
        items.length > 0 &&
          items.forEach(async (item) => {
            console.log("item", item);
            let billItemSql = `INSERT INTO bill_items (billId, partStockId, partId, qty, price, amount)VALUES(${lastId},${item.partStockId},${item.partId},${item.qty},${item.price},${item.amount});`;
            db.run(billItemSql, (err) => {
              if (err) {
                console.log(err);
                let data = { result: "error", message: err.message };
                reject(data);
              }
              let stockSql = `UPDATE parts_stock SET balance = balance - ${item.qty} WHERE id = ${item.partStockId};`;
              db.run(stockSql, (err) => {
                if (err) {
                  console.log(err);
                  let data = { result: "error", message: err.message };
                  reject(data);
                }
              });
            });
          });
        let data = { result: "success", message: "Bill is save successfully" };
        resolve(data);
      });
    });
  });
};

export const updateBill = async (req) => {
  return new Promise(async (resolve, reject) => {
    console.log("req", req);

    let deleteItems = req.deteleItems;
    deleteItems?.length > 0 &&
      deleteItems.forEach(async (item) => {
        console.log("item", item);
        let deleteItemSql = `DELETE FROM bill_items WHERE id=${item.id};`;
        db.run(deleteItemSql, (err) => {
          if (err) {
            console.log(err);
            let data = { result: "error", message: err.message };
            reject(data);
          }
          let stockSql = `UPDATE parts_stock SET balance = balance + ${item.qty} WHERE id = ${item.partStockId};`;
          db.run(stockSql, (err) => {
            if (err) {
              console.log(err);
              let data = { result: "error", message: err.message };
              reject(data);
            }
          });
        });
      });

    let sql = `UPDATE bill_master SET customerId = ${req.customerId}, kilometer = ${req.kilometer}, vehicleNo ="${req.vehicleNo}", billDate="${req.billDate}", nextDate="${req.nextDate}", totalAmount=${req.totalAmount}, discount= ${req.discount}, netAmount = ${req.netAmount} WHERE id=${req.id};`;
    db.run(sql, async (err) => {
      if (err) {
        console.log(err);
        console.log("sql =", sql);
        let data = { result: "error", message: err.message };
        reject(data);
      }
      let items = req.items;
      items?.length > 0 &&
        items.forEach(async (item) => {
          console.log("item", item);
          let billItemSql = "";
          if (!item.id) {
            billItemSql = `INSERT INTO bill_items (billId, partStockId, partId, qty, price, amount)VALUES(${req.id},${item.partStockId},${item.partId},${item.qty},${item.price},${item.amount});`;
            db.run(billItemSql, (err) => {
              if (err) {
                console.log(err);
                let data = { result: "error", message: err.message };
                reject(data);
              }
              let stockSql = `UPDATE parts_stock SET balance = balance - ${item.qty} WHERE id = ${item.partStockId};`;
              db.run(stockSql, (err) => {
                if (err) {
                  console.log(err);
                  let data = { result: "error", message: err.message };
                  reject(data);
                }
              });
            });
          }
        });
      //  else {
      //    billItemSql = `UPDATE bill_items Set partStockId= ${item.partStockId}, partId, qty, price, amount)VALUES(,${item.partId},${item.qty},${item.price},${item.amount});`;
      // }

      let data = { result: "success", message: "Bill is update successfully" };
      resolve(data);
    });
  });
};

export const getBillDataByIdForView = async (id) => {
  console.log("req == ", id);
  return new Promise((resolve, reject) => {
    let sql = `SELECT bm.*, cm.* FROM bill_master bm INNER JOIN customer_master cm ON cm.id=bm.customerId WHERE bm.id = ${id}`;
    db.all(sql, (err, rows) => {
      if (err) {
        console.error(err);
        let data = { result: "error", message: err.message };
        reject(data);
      }
      let itemSql = `SELECT bt.*, pm.name as item FROM bill_items bt INNER JOIN parts_master pm ON bt.partId = pm.id WHERE billId = ${id}`;
      db.all(itemSql, (err, rowsItem) => {
        if (err) {
          console.error(err);
          let data = { result: "error", message: err.message };
          reject(data);
        }
        rows[0].items = rowsItem;
        let data = { result: "success", data: rows[0] };
        resolve(data);
      });
    });
  });
};
