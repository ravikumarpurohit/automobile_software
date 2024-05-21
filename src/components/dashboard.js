import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { getTotalPartsAmount, getPartsAndQty } from "../api/partsAPI";

function Dashboard() {
  const [totalPartsAmount, setTotalPartsAmount] = useState();
  const [partsAndQtyData, setPartsAndQtyData] = useState();

  const fnGetCustomer = async () => {
    getTotalPartsAmount().then((result) => {
      console.log("res", result);
      if (result.result === "success") {
        setTotalPartsAmount(result.data[0].totalPartsAmount);
      } else {
      }
    });
  };

  const fnGetPartsAndQty = async () => {
    getPartsAndQty().then((result) => {
      console.log("res", result);
      if (result.result === "success") {
        setPartsAndQtyData(result.data);
      } else {
      }
    });
  };

  useEffect(() => {
    fnGetCustomer();
    fnGetPartsAndQty();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <h4>Dashboard</h4>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-3">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Total Parts Amount</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h4">
                {totalPartsAmount}
              </CardSubtitle>
            </CardBody>
          </Card>
        </div>
        <div className="col-5"></div>
        <div className="col-4" style={{ height: "400px" }}>
          <Card>
            <CardBody>
              <CardTitle tag="h5">Parts Qty Notification</CardTitle>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Parts</th>
                    <th>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {partsAndQtyData?.length > 0 ? (
                    partsAndQtyData?.map((x) => (
                      <tr key={`${x.id}`}>
                        <td>{x.name}</td>
                        <td>{x.balance}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>No Records</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
