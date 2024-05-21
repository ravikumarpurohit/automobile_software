import React, { useState, useEffect } from "react";
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import SimpleReactValidator from "simple-react-validator";
import Select from "react-select";
import { saveBill, updateBill, getBillData, getBillDataById } from "../api/billAPI";
import { getOnlyCustomerName } from "../api/customerAPI";
import { getPartsAndStockBySearch } from "../api/partsAPI";
import { Link, useOutletContext } from "react-router-dom";
import Moment from "moment";

const Bill = (props) => {
  const { setAlertData } = useOutletContext();
  const [modelOpen, setModelOpen] = useState(false);
  const [customerList, setCustomerList] = useState();
  let initBillData = {
    kilometer: "",
    vehicleNo: "",
    billDate: Moment().format("YYYY-MM-DD"),
    nextDate: Moment().format("YYYY-MM-DD"),
    totalAmount: 0,
    discount: 0,
    netAmount: 0,
    items: [],
  };
  let initItem = {
    partId: "",
    partStockId: "",
    item: "",
    qty: "",
    price: "",
    amount: "",
  };
  const [deteleItems, setDeleteItems] = useState([]);
  const [billData, setBillData] = useState(initBillData);
  const [billDataList, setBillDataList] = useState();
  const [itemData, setItemData] = useState(initItem);
  const [partSelect, setPartSelect] = useState({});
  const [partOptionList, setPartOptionList] = useState();

  const [validatorCount, setValidatorCount] = useState(0);
  const forceUpdate = () => setValidatorCount(validatorCount + 1);
  const [validator] = useState(
    new SimpleReactValidator({
      locale: "en",
      autoForceUpdate: { forceUpdate },
    })
  );

  const fnBillDataEdit = (id) => {
    getBillDataById(id).then((result) => {
      console.log("getBillDataById ", result);
      if (result.result === "success") {
        result.data.isEdit = true;
        setBillData(result.data);
      } else {
      }
    });
  };
  const handleChange = (e) => {
    setBillData(Object.assign({}, billData, { [e.target.name]: e.target.value }));
  };

  const [searchData, setSearchData] = useState("");
  // const calcAmount = () => {
  //   let totalAmount;
  //   let netAmount;

  //   billData.items && billData.items.filter((item) => {
  //     totalAmount += item.amount;
  //   });
  //   netAmount = totalAmount - billData.discount;

  //   Object.assign({}, billData, {
  //       items: [...billData.items, itemData],
  //       totalAmount: billData.totalAmount + itemData.amount,
  //       netAmount: billData.totalAmount + itemData.amount - billData.discount,
  //     })
  // };

  const handleAddItem = () => {
    console.log("itemData", itemData);
    // var errorFlag= true;
    if (validator.fieldValid("item") && validator.fieldValid("qty") && validator.fieldValid("price") && validator.fieldValid("amount")) {
      let sameItem = billData.items.find((y) => y.partStockId === itemData.partStockId);
      console.log("sameItem", sameItem);
      if (!sameItem) {
        setBillData(
          Object.assign({}, billData, {
            items: [...billData.items, itemData],
            totalAmount: billData.totalAmount + itemData.amount,
            netAmount: billData.totalAmount + itemData.amount - billData.discount,
          })
        );
        setItemData(initItem);
        setPartSelect({});
      } else {
        setAlertData({ isAlertOpen: true, isError: true, message: "Duplicate Part" });
      }
    } else {
      console.log("hello");
      validator.showMessages();
    }
  };

  const addBill = async () => {
    if (billData.isEdit) {
      billData.deteleItems = deteleItems;
      console.log("billData", billData);
      updateBill(billData).then((result) => {
        console.log("res", result);
        if (result.result === "success") {
          setDeleteItems([]);
          setModelOpen(false);
          setBillData(initBillData);
          fnGetBillData();
          setAlertData({ isAlertOpen: true, isError: false, message: result.message });
        } else {
          setAlertData({ isAlertOpen: true, isError: true, message: result.message });
        }
      });
    } else {
      saveBill(billData).then((result) => {
        console.log("res", result);
        if (result.result === "success") {
          setDeleteItems([]);
          setModelOpen(false);
          setBillData(initBillData);
          fnGetBillData();
          setAlertData({ isAlertOpen: true, isError: false, message: result.message });
        } else {
          setAlertData({ isAlertOpen: true, isError: true, message: result.message });
        }
      });
    }
  };

  const fnGetCustomerList = async (e) => {
    if (e.length > 0) {
      getOnlyCustomerName(e).then((result) => {
        console.log("res", result);
        if (result.result === "success") {
          const customerOption = [];
          result.data.forEach((val) => {
            customerOption.push({ value: val.id, label: val.name });
          });
          setCustomerList(customerOption);
        } else {
        }
      });
    }
  };

  const fnGetpartOptionList = async (e) => {
    console.log("e = ", e);
    if (e.length > 0) {
      getPartsAndStockBySearch(e).then((result) => {
        console.log("res", result);
        if (result.result === "success") {
          const partOption = [];
          result.data.forEach((val) => {
            partOption.push({
              value: val.id,
              label: val.name + " | No = " + val.partno + " | Balance =  " + val.balance + " | Price = " + val.price,
              price: val.price,
              name: val.name,
              partId: val.partid,
            });
          });
          setPartOptionList(partOption);
        } else {
        }
      });
    }
  };

  const fnGetBillData = async () => {
    getBillData().then((result) => {
      console.log("res", result);
      if (result.result === "success") {
        setBillDataList(result.data);
      } else {
      }
    });
  };

  const fnSerachList = async (e) => {
    let data = { search: e.target.value };
    getBillData(data).then((result) => {
      console.log("res", result);
      if (result.result === "success") {
        setBillDataList(result.data);
      } else {
      }
    });
  };

  useEffect(() => {
    fnGetBillData();
  }, []);

  return (
    <div>
      <div className="container-fluid">
        <div className="row mt-1 mb-1">
          <div className="col-6">
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                setModelOpen(true);
                setBillData(initBillData);
              }}
            >
              Create new bill
            </button>
          </div>
          <div className="col-6">
            <input type="text" className="form-control" id="search" name="search" placeholder="Search" onChange={(e) => fnSerachList(e)} />
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="thead-scroll">
              <tr>
                <th className="col-1">#</th>
                <th>Date</th>
                <th>Customer</th>
                <th>vehicle No</th>
                <th>Kilometer</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="tbody-scroll">
              {billDataList?.length > 0 ? (
                billDataList?.map((x) => (
                  <tr key={`${x.id}`}>
                    <td className="col-1">{x.id}</td>
                    <td>{Moment(x.billDate, "YYYY-MM-DD").format("DD-MM-YYYY")}</td>
                    <td>{x.name}</td>
                    <td>{x.vehicleNo}</td>
                    <td>{x.kilometer}</td>
                    <td>{x.netAmount}</td>
                    <td>
                      <Button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => {
                          setModelOpen(true);
                          fnBillDataEdit(x.id);
                        }}
                      >
                        Edit
                      </Button>
                      <Link to={`/bill/${x.id}`} className="btn btn-success btn-sm ">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No Records</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modelOpen} toggle={() => setModelOpen(false)} className="modal-fullscreen">
        <ModalHeader toggle={() => setModelOpen(false)}> {billData.isEdit ? "Edit bill" : "Add new bill"}</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col">
              <div className="row mb-1">
                <div className="col-4">
                  <Select
                    name="selectCustomer"
                    placeholder="Select Customer"
                    value={customerList?.find((x) => x.value === billData?.customerId)}
                    options={customerList}
                    onInputChange={(e) => {
                      fnGetCustomerList(e);
                    }}
                    onChange={(e) => {
                      console.log(e);
                      setBillData(Object.assign({}, billData, { customerId: e.value }));
                    }}
                  />
                </div>
                <div className="col">
                  <div className="input-group  mb-3">
                    <span className="input-group-text">Kilometer</span>
                    <input
                      type="text"
                      className="form-control"
                      id="kilometer"
                      name="kilometer"
                      placeholder=""
                      value={billData.kilometer}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="input-group  mb-3">
                    <span className="input-group-text">Vehicle No.</span>
                    <input
                      type="text"
                      className="form-control"
                      id="vehicleNo"
                      name="vehicleNo"
                      value={billData.vehicleNo}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="input-group  mb-3">
                    <span className="input-group-text">Bill Date</span>
                    <input
                      type="date"
                      className="form-control"
                      id="billDate"
                      name="billDate"
                      value={billData.billDate}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="input-group  mb-3">
                    <span className="input-group-text">Next Service</span>
                    <input
                      type="date"
                      className="form-control"
                      id="nextDate"
                      name="nextDate"
                      value={billData.nextDate}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>
              <div className="row mb-1"></div>
              <div className="row">
                <div className="col">
                  <h6>Select Parts</h6>
                  <div className="border border-1 p-2">
                    <div className="row">
                      <div className="col-6">
                        <Select
                          name="selectPart"
                          placeholder="Select part"
                          value={partSelect}
                          options={partOptionList}
                          onInputChange={(e) => {
                            fnGetpartOptionList(e);
                          }}
                          onChange={(e) => {
                            console.log(e);
                            setPartSelect(e);
                            setItemData(Object.assign({}, itemData, { partId: e.partId, partStockId: e.value, price: e.price, item: e.name }));
                          }}
                        />
                        <span className="text-danger">{validator.message("item", partSelect.partId, "required")}</span>
                      </div>
                      <div className="col-1">
                        <Input
                          type="text"
                          name="qty"
                          placeholder="QTY"
                          value={itemData.qty}
                          onKeyUp={(e) => {
                            if (e.target.value && itemData.price) {
                              setItemData(Object.assign({}, itemData, { amount: e.target.value * itemData.price }));
                            }
                          }}
                          onChange={(e) => setItemData(Object.assign({}, itemData, { qty: e.target.value }))}
                        />
                        <span className="text-danger">{validator.message("qty", itemData.qty, "required|numeric")}</span>
                      </div>
                      <div className="col-2">
                        <Input
                          type="text"
                          name="price"
                          placeholder="Price"
                          value={itemData.price}
                          onKeyUp={(e) => {
                            setItemData(Object.assign({}, itemData, { amount: e.target.value * itemData.qty }));
                          }}
                          onChange={(e) => setItemData(Object.assign({}, itemData, { price: e.target.value }))}
                        />
                        <span className="text-danger">{validator.message("price", itemData.price, "required|numeric")}</span>
                      </div>
                      <div className="col-2">
                        <Input
                          disabled
                          type="text"
                          name="amount"
                          placeholder="Amount"
                          value={itemData.amount}
                          onChange={(e) => setItemData(Object.assign({}, itemData, { amount: e.target.value }))}
                        />
                        <span className="text-danger">{validator.message("amount", itemData.amount, "required|numeric")}</span>
                      </div>
                      <div className="col-1">
                        <Button color="btn btn-success" onClick={() => handleAddItem()}>
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table id="itemTable" name="itemTable" className="table table-hover">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Item</th>
                          <th>QTY</th>
                          <th>Rate</th>
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody className="tbody-bill">
                        {billData.items?.length > 0 ? (
                          billData.items?.map((x, i) => (
                            <tr key={`${i}`}>
                              <td>{i + 1}</td>
                              <td>{x.item}</td>
                              <td>{x.qty}</td>
                              <td>{x.price}</td>
                              <td>{x.amount}</td>
                              <td>
                                <Button
                                  className="btn btn-danger"
                                  onClick={(e) => {
                                    setDeleteItems([...deteleItems, billData.items.find((y) => y.partStockId === x.partStockId)]);
                                    setBillData(
                                      Object.assign({}, billData, {
                                        items: [...billData.items.filter((y) => y.partStockId !== x.partStockId)],
                                        totalAmount: billData.totalAmount - x.amount,
                                        netAmount: billData.totalAmount - billData.discount - x.amount,
                                      })
                                    );
                                  }}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5}>No Records</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="">
                    <div className="row justify-content-end">
                      <label className="col-2">Total Amount </label>
                      <div className="col-2 mb-3">
                        <input
                          disabled
                          type="text"
                          className="form-control"
                          id="totalAmount"
                          name="totalAmount"
                          value={billData.totalAmount}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                    <div className="row justify-content-end">
                      <label className="col-2">Discount </label>
                      <div className="col-2 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="discount"
                          name="discount"
                          value={billData.discount}
                          onKeyUp={(e) => {
                            console.log(e.target.value);
                            if (billData.totalAmount && e.target.value) {
                              setBillData(Object.assign({}, billData, { netAmount: billData.totalAmount - e.target.value }));
                            }
                          }}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                    <div className="row justify-content-end">
                      <label className="col-2">Net Amount </label>
                      <div className="col-2 mb-3">
                        <input
                          disabled
                          type="text"
                          className="form-control"
                          id="netAmount"
                          name="netAmount"
                          value={billData.netAmount}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="btn btn-success" onClick={() => addBill()}>
            Save
          </Button>
          <Button className="btn btn-danger" onClick={() => setModelOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Bill;
