import { db } from "./database";

export const getCustomer = async (req) => {
  let search = req?.search ? req.search : "";
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM customer_master WHERE name LIKE '${search}%' ORDER BY id DESC;`;
    // console.log("getCustomer = ", sql);
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

export const getOnlyCustomerName = async (req) => {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT id, name FROM customer_master WHERE name LIKE '${req}%' LIMIT 5;`;
    // console.log("getOnlyCustomerName = ", sql);
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

export const getCustomerById = async (req) => {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM customer_master where id = ${req.id};`;
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

export const saveCustomer = async (req) => {
  return new Promise(function (resolve, reject) {
    let sql = `INSERT INTO customer_master (name, mobile, address)VALUES("${req.name}",${req.mobile},"${req.address}");`;
    db.run(sql, (err) => {
      if (err) {
        console.error(err);
        let data = { result: "error", message: err.message };
        reject(data);
      }
      let data = { result: "success", message: "Customer is save successfully" };
      resolve(data);
    });
  });
};

export const updateCustomer = async (req) => {
  return new Promise(function (resolve, reject) {
    let sql = `UPDATE customer_master SET name = "${req.name}" , mobile= ${req.mobile}, address = "${req.address}" WHERE id = ${req.id}`;
    console.log("updateCustomer = ", sql);
    db.run(sql, (err) => {
      if (err) {
        console.error(err);
        let data = { result: "error", message: err.message };
        reject(data);
      }
      let data = { result: "success", message: "Customer is update successfully" };
      resolve(data);
    });
  });
};
