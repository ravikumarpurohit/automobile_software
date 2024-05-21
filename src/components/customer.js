import React, { useState, useEffect } from "react";
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from "reactstrap";
import { saveCustomer, getCustomer, updateCustomer } from "../api/customerAPI";
import { useOutletContext } from "react-router-dom";

const Customer = (props) => {
  const { setAlertData } = useOutletContext();
  const [modelOpen, setModelOpen] = useState(false);
  const [customerData, setCustomerData] = useState({});
  const [customerDataList, setCustomerDataList] = useState();

  const handleChange = (e) => {
    setCustomerData(Object.assign({}, customerData, { [e.target.name]: e.target.value }));
  };

  const addCustomer = async () => {
    if (customerData.isEdit) {
      await updateCustomer(customerData).then((result) => {
        console.log("res", result);
        if (result.result === "success") {
          setModelOpen(false);
          fnGetCustomer();
          setAlertData({ isAlertOpen: true, isError: false, message: result.message });
        } else {
          setAlertData({ isAlertOpen: true, isError: true, message: result.message });
        }
      });
    } else {
      await saveCustomer(customerData).then((result) => {
        console.log("res", result);
        if (result.result === "success") {
          setModelOpen(false);
          fnGetCustomer();
          setAlertData({ isAlertOpen: true, isError: false, message: result.message });
        } else {
          setAlertData({ isAlertOpen: true, isError: true, message: result.message });
        }
      });
    }
  };

  const fnGetCustomer = async () => {
    getCustomer().then((result) => {
      console.log("res", result);
      if (result.result === "success") {
        setCustomerDataList(result.data);
      } else {
      }
    });
  };

  const fnSerachList = async (e) => {
    let data = { search: e.target.value };
    getCustomer(data).then((result) => {
      console.log("res", result);
      if (result.result === "success") {
        setCustomerDataList(result.data);
      } else {
      }
    });
  };

  useEffect(() => {
    fnGetCustomer();
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
                setCustomerData({});
                setModelOpen(true);
              }}
            >
              Add Customer
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
                <th>No</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="tbody-scroll">
              {customerDataList?.length > 0 ? (
                customerDataList?.map((x) => (
                  <tr key={`${x.id}`}>
                    <td>{x.id}</td>
                    <td>{x.name}</td>
                    <td>{x.mobile}</td>
                    <td>{x.address}</td>
                    <td>
                      <Button
                        className="btn btn-success btn-sm"
                        onClick={(e) => {
                          setModelOpen(true);
                          x.isEdit = true;
                          setCustomerData(x);
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
      </div>

      <Modal isOpen={modelOpen} toggle={() => setModelOpen(false)} className="">
        <ModalHeader toggle={() => setModelOpen(false)}>{customerData.isEdit ? "Edit Customer" : " Add Customer"}</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col">
              <div className="row">
                <div className="col">
                  <div className="input-group  mb-3">
                    <span className="input-group-text">Customer Name</span>
                    <Input type="text" className="form-control" id="name" name="name" value={customerData.name} onChange={(e) => handleChange(e)} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="input-group  mb-3">
                    <span className="input-group-text">Mobile</span>
                    <input
                      type="number"
                      className="form-control"
                      id="mobile"
                      name="mobile"
                      placeholder=""
                      value={customerData.mobile}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="input-group  mb-3">
                    <span className="input-group-text">Address</span>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={customerData.address}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="btn btn-success" onClick={() => addCustomer()}>
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

export default Customer;
