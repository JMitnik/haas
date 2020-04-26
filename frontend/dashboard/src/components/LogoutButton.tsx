import React from 'react'
import useUser from 'hooks/useUser';
import styled from 'styled-components/macro';
import { LogOut } from 'react-feather';
import { motion } from 'framer-motion';

const StyledButton = styled(motion.button)`
  padding: 12px 12px;
  border: 0;
  width: 200px;
  font-weight: bolder;
  font-size: 1rem;
  display: flex;
  align-items: center;

  border-radius: 50px;
  background: linear-gradient(145deg, #e3e3e3, #ffffff);
  box-shadow:  18px 18px 23px #e5e5e5,
              -18px -18px 23px #ffffff;

  transition: box-shadow .3s cubic-bezier(.55,0,.1,1);


  &:active {
    border-radius: 50px;
    background: #fcfcfc;
    transition: all .3s ease-in;
  }

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  span {
    display: inline-block;
    margin-left: 12px;

  }
`;

const LogoutButton = () => {
  const { logout } = useUser();
  return (
      <StyledButton whileHover={{ scale: 0.9 }} onClick={() => logout()}>
        <LogOut />
        <span>
          Logout
        </span>
      </StyledButton>
  )
}

export default LogoutButton;
