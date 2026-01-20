import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">WearSuggest</div>
      
      <nav className="nav-menu">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Wardrobe
        </NavLink>
        
        <NavLink 
          to="/outfits" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Outfits
        </NavLink>
        
        <NavLink 
          to="/suggestions" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Get Suggestions
        </NavLink>

        <NavLink 
          to="/add-item" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Add Item
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          style={{ marginTop: 'auto' }}
        >
          Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
