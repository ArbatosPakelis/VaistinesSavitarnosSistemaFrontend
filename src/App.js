import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import RequireAuth from './components/RequireAuth';
// pages
import LoginPage from './pages/Login';
import MainPage from './pages/MainPage';
import BasketPage from './pages/Basket';
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
        <Route path="/" element={<MainPage/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/unauthorized" element={<UnauthorizedPage/>}/>

        <Route element={<RequireAuth allowedRoles={[1, 2]}/>}>
          <Route path="/basket" element={<BasketPage/>}/>
          <Route path="/productList/:id" element={<ProductListPage/>}/>
        </Route>

        <Route element={<RequireAuth allowedRoles={[2]}/>}>
          <Route path="/inventory/:id" element={<InventoryPage/>}/>
          <Route path="/orderList/:id" element={<OrderListPage/>}/>
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