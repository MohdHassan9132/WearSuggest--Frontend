import { Routes, Route } from 'react-router-dom';
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

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/outfits" element={<Outfits />} />
          <Route path="/suggestions" element={<SuggestOutfit />} />
          <Route path="/add-item" element={<AddClothing />} />
          <Route path="/deleted-items" element={<DeletedItems />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
