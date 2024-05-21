import React, { useState, useEffect, useRef, createRef } from "react";
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { savePart, getParts, updatePart, getStock, saveStock, updateStock } from "../api/partsAPI";
import { useOutletContext } from "react-router-dom";
import Moment from "moment";

const Parts = () => {
  const { setAlertData } = useOutletContext();
  const [modelOpen, setModelOpen] = useState(false);
  const [partData, setPartData] = useState({});
  const [partDataList, setPartDataList] = useState({});

  let initPartStockData = { qty: "", price: "", adddate: Moment().format("YYYY-MM-DD") };
  const [partStockData, setPartStockData] = useState(initPartStockData);
  const [partStockList, setPartStockList] = useState({});
  const [stockModelOpen, setStockModelOpen] = useState(false);
  const [partId, setPartId] = useState("");
  let refName = useRef();

  const handleChange = (e) => {
    setPartData(Object.assign({}, partData, { [e.target.name]: e.target.value }));
  };

  const handleChangeStock = (e) => {
    setPartStockData(Object.assign({}, partStockData, { [e.target.name]: e.target.value }));
  };

  const addPart = async () => {
    if (partData.isEdit) {
      await updatePart(partData).then((result) => {
        if (result.result === "success") {
          setPartData({});
          setModelOpen(false);
          fnGetParts();
          setAlertData({ isAlertOpen: true, isError: false, message: result.message });
        } else {
          setAlertData({ isAlertOpen: true, isError: true, message: result.message });
        }
      });
    } else {
      await savePart(partData).then((result) => {
        console.log("res", result);
        if (result.result === "success") {
          setPartData({});
          setModelOpen(false);
          fnGetParts();
          setAlertData({ isAlertOpen: true, isError: false, message: result.message });
        } else {
          setAlertData({ isAlertOpen: true, isError: true, message: result.message });
        }
      });
    }
  };

  const addStock = async () => {
    console.log("partStockData", partStockData);
    if (partStockData.isEdit) {
      await updateStock(partId, partStockData).then((result) => {
        if (result.result === "success") {
          setPartStockData(initPartStockData);
          fnGetStock(partId);
          fnGetParts();
          setAlertData({ isAlertOpen: true, isError: false, message: result.message });
        } else {
          setAlertData({ isAlertOpen: true, isError: true, message: result.message });
        }
      });
    } else {
      await saveStock(partId, partStockData).then((result) => {
        console.log("res", result);
        if (result.result === "success") {
          setPartStockData(initPartStockData);
          fnGetStock(partId);
          fnGetParts();
          setAlertData({ isAlertOpen: true, isError: false, message: result.message });
        } else {
          setAlertData({ isAlertOpen: true, isError: true, message: result.message });
        }
      });
    }
  };

  const fnGetParts = async () => {
    getParts().then((result) => {
      console.log("res", result);
      if (result.result === "success") {
        setPartDataList(result.data);
      } else {
      }
    });
  };

  const fnGetStock = async (partId) => {
    getStock(partId).then((result) => {
      console.log("res", result);
      if (result.result === "success") {
        setPartStockList(result.data);
      } else {
      }
    });
  };

  const fnSerachList = async (e) => {
    let data = { search: e.target.value };
    getParts(data).then((result) => {
      console.log("res", result);
      if (result.result === "success") {
        setPartDataList(result.data);
      } else {
      }
    });
  };

  const fnOpenPartModel = () => {
    setPartData({});
    setModelOpen(true);
    // refName.current.focus();
  };
  useEffect(() => {
    fnGetParts();
  }, []);

  useEffect(() => {
    if (!stockModelOpen) {
      setPartStockData(initPartStockData);
    }
  }, [stockModelOpen]);

  return (
    <div>
      <div className="container-fluid">
        <div className="row mt-1 mb-1">
          <div className="col-6">
            <button type="button" className="btn btn-success" onClick={() => fnOpenPartModel()}>
              Add Part
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
                <th>Name</th>
                <th>Parts No</th>
                <th>Parts HSN</th>
                <th>Location</th>
                <th>Alert QTY</th>
                <th>QTY</th>
                <th>Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="tbody-scroll">
              {partDataList?.length > 0 ? (
                partDataList?.map((x) => (
                  <tr key={`${x.id}`}>
                    <td className="col-1">{x.id}</td>
                    <td>{x.name}</td>
                    <td>{x.partno}</td>
                    <td>{x.parthsn}</td>
                    <td>{x.location}</td>
                    <td>{x.alertqty}</td>
                    <td>{x.qty}</td>
                    <td>{x.balance}</td>
                    <td>
                      <Button
                        className="btn btn-success me-1"
                        onClick={(e) => {
                          setModelOpen(true);
                          x.isEdit = true;
                          setPartData(x);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        className="btn btn-success"
                        onClick={(e) => {
                          setStockModelOpen(true);
                          fnGetStock(x.id);
                          setPartId(x.id);
                          setPartStockData(initPartStockData);
                        }}
                      >
                        Stock
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
      </div>
      {/* parts modal add update */}
      <Modal isOpen={modelOpen} toggle={() => setModelOpen(false)}>
        <ModalHeader toggle={() => setModelOpen(false)}>{partData.isEdit ? "Edit Parts" : " Add Parts"}</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col">
              <div className="row">
                <div className="col">
                  <div className="input-group mb-3">
                    <span className="input-group-text">Parts Name</span>
                    <input type="text" className="form-control" id="name" name="name" value={partData.name} onChange={(e) => handleChange(e)} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="input-group  mb-3">
                    <span className="input-group-text">Part No</span>
                    <input type="text" className="form-control" id="partno" name="partno" value={partData.partno} onChange={(e) => handleChange(e)} />
                  </div>
                </div>
                <div className="col">
                  <div className="input-group mb-3">
                    <span className="input-group-text">Part HSN</span>
                    <input
                      type="text"
                      className="form-control"
                      id="parthsn"
                      name="parthsn"
                      value={partData.parthsn}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="input-group mb-3">
                    <span className="input-group-text">Location</span>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      name="location"
                      value={partData.location}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="input-group mb-3">
                    <span className="input-group-text">Alert For Qty</span>
                    <input
                      type="number"
                      className="form-control"
                      id="alertqty"
                      name="alertqty"
                      value={partData.alertqty}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="btn btn-success" onClick={() => addPart()}>
            Save
          </Button>
          <Button className="btn btn-danger" onClick={() => setModelOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {/* stock 0parts modal add update */}
      <Modal isOpen={stockModelOpen} toggle={() => setStockModelOpen(false)} className="modal-fullscreen">
        <ModalHeader toggle={() => setStockModelOpen(false)}>Stocks</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col">
              <div className="row">
                <div className="col">
                  <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text">QTY</span>
                    <Input
                      type="number"
                      className="form-control"
                      id="qty"
                      name="qty"
                      value={partStockData.qty}
                      onChange={(e) => handleChangeStock(e)}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text">Part Price</span>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={partStockData.price}
                      onChange={(e) => handleChangeStock(e)}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text">Add Date</span>
                    <input
                      type="date"
                      className="form-control"
                      id="adddate"
                      name="adddate"
                      value={partStockData.adddate}
                      onChange={(e) => handleChangeStock(e)}
                    />
                  </div>
                </div>
                <div className="col">
                  <Button className="btn btn-success" onClick={() => addStock()}>
                    {partStockData.isEdit ? "Edit" : "Add"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="thead-scroll">
                <tr>
                  <th>No</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Balance</th>
                  <th>Add Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="tbody-scroll">
                {partStockList?.length > 0 ? (
                  partStockList?.map((x) => (
                    <tr key={`${x.id}`}>
                      <td>{x.id}</td>
                      <td>{x.qty}</td>
                      <td>{x.price}</td>
                      <td>{x.balance}</td>
                      <td>{Moment(x.adddate, "YYYY-MM-DD").format("DD-MM-YYYY")}</td>
                      <td>
                        <Button
                          className="btn btn-success btn-sm"
                          onClick={() => {
                            x.isEdit = true;
                            setPartStockData(x);
                          }}
                        >
                          Edit
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
        </ModalBody>
        <ModalFooter>
          <Button className="btn btn-danger" onClick={() => setStockModelOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Parts;
