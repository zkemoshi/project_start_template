import { Container, makeStyles } from '@material-ui/core';

import React, { useContext, useEffect } from 'react';
import authContext from '../../../context/auth/authContext';
import paymentContext from '../../../context/payment/paymentContext';

const useStyle = makeStyles({
  box: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Home = () => {
  const classes = useStyle();
  const { token, loadUser } = useContext(authContext);
  const { current } = useContext(paymentContext);

  useEffect(() => {
    if (token !== null) loadUser();
    // eslint-disable-next-line
  }, [current]);

  return <Container className={classes.box}>Welcome Home</Container>;
};

export default Home;
