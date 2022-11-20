import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import * as IoIcons from 'react-icons/io';

const NavIcon = styled(Link)`
  font-size: 2rem;
  height: 50px;
  display: flex;
  align-items: center;
  border: 1px solid ${(props)=>props.theme.gray['1']};
  color: ${(props)=>props.theme.gray['4']} !important;
  justify-content: space-between;
`;

const SidebarNav = styled.nav`
  background: ${props=>props.theme.gray['0']};
  width: 250px;
  height: 55vh;
  display: flex;
  justify-content: center;
  position: absolute;
  top: 515px;
  color: ${(props)=>props.theme.gray['4']} !important;
  scrollbar-width: none;
  left: ${({ sidebar }) => (sidebar ? '0' : '-200px')};
  transition: 350ms;
  z-index: 10;
  overflow-y: scroll;
  @media (min-width: ${props => props.theme.viewport.mobile}) {
    height: 48vh;
  }
  @media (min-width: ${props => props.theme.viewport.tablet}) {
    height: 49.5vh;
  }
  @media (min-width: ${props => props.theme.viewport.desktop}) {
    height: 62vh;
  }
  @media (min-width: ${props => props.theme.viewport.desktopXl}) {
    height: 45vh;
  }
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = ({sidebarChange}) => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => {
    setSidebar(!sidebar);
    sidebarChange();
  }

  return (
    <>
      
    </>
  );
};

export default Sidebar;