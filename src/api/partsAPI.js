import { db } from "./database";

export const savePart = async (req) => {
  return new Promise(function (resolve, reject) {
    // console.log("req", req);
    let sql = `INSERT INTO parts_master (name, partno, parthsn, location, alertqty)VALUES('${req.name}','${req.partno}','${req.parthsn}', '${req.location}', ${req.alertqty});`;
    db.run(sql, (err) => {
      if (err) {
        console.error(err);
        let data = { result: "error", message: err.message };
        reject(data);
      }
      let data = { result: "success", message: "Part save is successfully" };
      resolve(data);
    });
  });
};

export const updatePart = async (req) => {
  return new Promise(function (resolve, reject) {
    let sql = `UPDATE parts_master SET name = "${req.name}" , partno = "${req.partno}", parthsn = "${req.parthsn}", location = "${req.location}", alertqty = ${req.alertqty} WHERE id = ${req.id}`;
    // console.log("updatePart = ", sql);
    db.run(sql, (err) => {
      if (err) {
        console.error(err);
        let data = { result: "error", message: err.message };
        reject(data);
      }
      let data = { result: "success", message: "Part update is successfully" };
      resolve(data);
    });
  });
};

export const getParts = async (req) => {
  let search = req?.search ? req.search : "";
  return new Promise(function (resolve, reject) {
    let sql = `SELECT pm.*,sum(ps.balance) as balance,sum(ps.qty) as qty FROM parts_master pm LEFT JOIN parts_stock ps ON pm.id=ps.partid WHERE (pm.partno LIKE '${search}%' OR pm.name LIKE '${search}%') GROUP BY pm.id ORDER BY pm.id DESC;`;
    // console.log("getParts = ", sql);
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

export const getPartsAndStockBySearch = async (req) => {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM parts_master pm INNER JOIN parts_stock ps ON pm.id=ps.partid WHERE ps.balance > 0 AND (pm.partno LIKE '${req}%' OR pm.name LIKE '${req}%') LIMIT 5;`;
    // console.log("getPartsAndStockBySearch", sql);
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

// export const getPartsAndStockById = async (id) => {
//   return new Promise(function (resolve, reject) {
//     console.log("req", id);
//     let sql = `SELECT * FROM parts_master pm INNER JOIN parts_stock ps ON pm.id=ps.partid WHERE ps.id = ${id};`;
//     console.log("getPartsAndStockBySearch", sql);
//     db.all(sql, (err, rows) => {
//       if (err) {
//         console.error(err);
//         let data = { result: "error", message: err.message };
//         reject(data);
//       }
//       let data = { result: "success", data: rows };
//       resolve(data);
//     });
//   });
// };

export const saveStock = async (partId, req) => {
  return new Promise(function (resolve, reject) {
    let sql = `INSERT INTO parts_stock (partid, qty, price, balance, adddate)VALUES(${partId}, ${req.qty}, ${req.price}, ${req.qty}, "${req.adddate}");`;
    // console.log("saveStock = ", req);
    db.run(sql, (err) => {
      if (err) {
        console.error(err);
        let data = { result: "error", message: err.message };
        reject(data);
      }
      let data = { result: "success", message: "Part's stock save is successfully" };
      resolve(data);
    });
  });
};

export const updateStock = async (partId, req) => {
  return new Promise(function (resolve, reject) {
    let sql = `UPDATE parts_stock SET qty = "${req.qty}", price = "${req.price}", balance = ${req.qty} - (qty-balance), adddate = "${req.adddate}" WHERE id = ${req.id}`;
    console.log("sql = ", sql);
    db.run(sql, (err) => {
      if (err) {
        console.error(err);
        let data = { result: "error", message: err.message };
        reject(data);
      }
      let data = { result: "success", message: "Part's stock update is successfully" };
      resolve(data);
    });
  });
};

export const getStock = async (id) => {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM parts_stock WHERE partid = ${id} ORDER BY id DESC;`;
    console.log("getStock = ", sql);
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

export const getTotalPartsAmount = async () => {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT sum(balance * price) as totalPartsAmount FROM parts_stock;`;
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

export const getPartsAndQty = async () => {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT pm.id, pm.name,sum(ps.balance) as balance FROM parts_master pm LEFT JOIN parts_stock ps ON pm.id=ps.partid GROUP BY ps.partid ORDER BY balance;`;
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
