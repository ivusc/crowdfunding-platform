import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import Button from './Button';
import { logo, menu, search, thirdweb } from '../assets';
import { navlinks } from '../constants';

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  return (
    <div>Navbar</div>
  )
}

export default Navbar


//TIMESTAMP: 1.05.59