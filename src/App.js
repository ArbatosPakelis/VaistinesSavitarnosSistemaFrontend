import React from 'react'
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
// pages
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import BasketPage from './pages/BasketPage';
import ProductListPage from './pages/ProductListPage';
import InventoryPage from './pages/InventoryPage';
import OrderListPage from './pages/OrderListPage';
import OrderPage from './pages/orderPage';
import AccountPage from './pages/accountPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ErrorPage from './pages/ErrorPage';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/unauthorized" element={<UnauthorizedPage/>}/>

        <Route element={<RequireAuth allowedRoles={[1, 2]}/>}>
          <Route path="/basket" element={<BasketPage/>}/>
          <Route path="/productList" element={<ProductListPage/>}/>
        </Route>

        <Route element={<RequireAuth allowedRoles={[2]}/>}>
          <Route path="/inventory" element={<InventoryPage/>}/>
          <Route path="/orderList" element={<OrderListPage/>}/>
          <Route path="/order/:id" element={<OrderPage/>}/>
        </Route>

        <Route element={<RequireAuth allowedRoles={[3]}/>}>
          <Route path="/accounts" element={<AccountPage />}/>
        </Route>


        <Route path="*" element={<ErrorPage/>}/>
      </Routes>
    </>
  )
}

export default App