import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Alertmsg from "./components/alertmsg";

function App() {
  const [alertData, setAlertData] = useState({
    isAlertOpen: false,
    isError: false,
    message: "",
  });
  // const setAlert = (val) => setAlertData(Object.assign({}, alertData, { isAlertOpen: val.isAlertOpen, isError: val.isError, message: val.message }));
  const closeAlert = () => setAlertData(Object.assign({}, alertData, { isAlertOpen: false }));

  return (
    <React.Fragment>
      <div className="app">
        <main>
          <header>
            <div className="row border-bottom border-3 pb-2 mb-2">
              <div className="col-6"></div>
              <div className="col-6">
                <div className="m-2 float-end">
                  <Link to="/" className="btn btn-success btn-nav me-2">
                    Dashboard
                  </Link>
                  <Link to="/bill" className="btn btn-success btn-nav me-2">
                    Bill
                  </Link>
                  <Link to="/parts" className="btn btn-success btn-nav me-2">
                    Parts
                  </Link>
                  <Link to="/customer" className="btn btn-success btn-nav me-2">
                    Customer
                  </Link>
                </div>
              </div>
            </div>
          </header>
          <div className="content">
            <div className="mt-2">
              <Alertmsg {...alertData} closeAlert={closeAlert} />
              <Outlet context={{ setAlertData }} />
            </div>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
}

export default App;
