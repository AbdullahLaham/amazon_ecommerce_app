import React, { useContext, useEffect, useReducer } from 'react';
import { Alert, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import {Store} from '../utils/Store';

const OrderHistory = () => {
    function reducer(state, action) {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true, error: '' };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false, orders: action.payload, error: '' };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      default:
        state;
    }
  }
    //router
    const router = useRouter();
    const {state: {userInfo}} = useContext(Store);
    const [{loading, error, orders}, dispatch] = useReducer(reducer, {
        loading: false,
        orders: [],
        error: '',
    });
    useEffect(() => {
        const fetchOrders = async () => {
            if (!userInfo) {
                router.push('/login');
            } else {
                try {
                    dispatch({type: 'FETCH_REQUEST',})
                    const {data} = await axios.get(`/api/orders/history`,  {
                        headers: {
                            authorization: `Bearer ${userInfo.token}`,
                            'Content-Type': 'application/json',
                    },
                });
                    dispatch({type: 'FETCH_SUCCESS', payload: data});
                    console.log('data', data)
                }
                catch(err) {
                    dispatch({type: 'FETCH_FAIL', payload: err.message})
                }  
            }
             

        }
        fetchOrders();
    }, [router, userInfo])
  return (
    <Layout>
      <Typography variant='h1' component='h1'>
        Order History
      </Typography>
      {
        loading ? (
            <CircularProgress />
        ) : error ? (
            <Alert variant='danger'>{error}</Alert>
        ) : (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableCell>ID</TableCell>
                        <TableCell>DATE</TableCell>
                        <TableCell>TOTAL</TableCell>
                        <TableCell>PAID</TableCell>
                        <TableCell>ACTION</TableCell>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => {
                            return <TableRow key={order._id}>
                                <TableCell>{order._id}</TableCell>
                                <TableCell>{order.createdAt}</TableCell>
                                <TableCell>{order.totalPrice}</TableCell>
                                <TableCell>{order.isPaid ? `paid at ${order?.paidAt.slice(0,10)}` : 'not paid'}</TableCell>
                                <TableCell><NextLink href={`/order/${order._id}`}>
                                    <Button variant='contained'>
                                        Details
                                    </Button>
                                    </NextLink></TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
      }
    </Layout>
  )
}

export default OrderHistory
