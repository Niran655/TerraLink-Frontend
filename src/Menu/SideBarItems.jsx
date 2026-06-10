import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import "../Styles/StyleNav.css";

export default function SideBarItems({ item, isActive, onClick, showLabel = true }) {
    const navigate = useNavigate();
    // const [isOpen, setIsOpen] = useState(false);

    const handleNavigation = () => {
        if (item.path) {
            navigate(item.path);
        }
    };

 
    return (
        <div onClick={() => { handleNavigation(); onClick() }}
            className={`sidebar-item ${isActive ? 'active' : ''} ${!showLabel ? 'icon-only' : ''}`} // Conditionally add active class
        >
            {item.icon && <span className="sidebar-icon">{item.icon}</span>}
            {showLabel && item.label}
        </div>
    )
}
