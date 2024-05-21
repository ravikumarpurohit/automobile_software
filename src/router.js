import React, { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import App from "./App";
const Dashboard = lazy(() => import("./components/dashboard"));
const Bill = lazy(() => import("./components/bill"));
const BillView = lazy(() => import("./components/billview"));
const Customer = lazy(() => import("./components/customer"));
const Parts = lazy(() => import("./components/parts"));

const Router = (props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<App {...props} />}>
          <Route index element={<Dashboard {...props} />}></Route>
          <Route path="bill" element={<Bill {...props} />}></Route>
          <Route path="bill/:id" element={<BillView {...props} />}></Route>
          <Route path="customer" element={<Customer {...props} />}></Route>
          <Route path="parts" element={<Parts {...props} />}></Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default Router;
