import "./App.scss";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "pages/Dashboard";
import { AddressPage } from "pages/Address";
import Layout from "layout";
import SuppliersOfProduct from "pages/ProductSupplier";
import Supplier from "./components/supplier/supplier";
import Report from "./components/report/report";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="reports" element={<Report />} />
          <Route path="suppliers" element={<Supplier />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
