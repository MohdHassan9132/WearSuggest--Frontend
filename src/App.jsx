import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Outfits from './pages/Outfits';
import SuggestOutfit from './pages/SuggestOutfit';
import AddClothing from './pages/AddClothing';
import DeletedItems from './pages/DeletedItems';
import NotFound from './pages/NotFound';
import AppLayout from './components/AppLayout';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/outfits" element={<Outfits />} />
          <Route path="/suggestions" element={<SuggestOutfit />} />
          <Route path="/add-item" element={<AddClothing />} />
          <Route path="/deleted-items" element={<DeletedItems />} />
          {/* Add more protected routes here later e.g. /wardrobe */}
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
