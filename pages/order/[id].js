import { Store } from '../../utils/Store';
import { Typography, Button, Link,Select ,MenuItem , Box, Alert, CircularProgress, Grid, Card, List, ListItem, TableCell, TableRow, TableBody, TableContainer, Table, TableHead } from '@mui/material';  
import React, { useReducer, useContext, useEffect, useState } from 'react'
import Layout from '../../components/Layout';
import classes from '../../utils/classes';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import axios from 'axios';
import Image from 'next/image';
import getStripe from '../../utils/getStripe';
const reducer = (state, action) => {
    switch(action.type) {
        case 'FETCH_REQUEST': {
            return {...state, loading: true, error: ''}
        }
        case 'FETCH_SUCCESS': {
            return {...state, loading: false, error: '', order: action.payload}
        }
        case 'FETCH_FAIL': {
            return {...state, loading: false, error: action.payload}
        }
        default: return state;
    }
}
const Order = ({params}) => {
    console.log('ff', params);
    const [clicked, setClicked] = useState(false);
    const {id: orderId} = params;
    const [{loading, error, order}, dispatch] = useReducer(reducer, {
        loading: false,
        order: {},
        error: '',
    });
    const {
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        orderItems ,
        taxPrice,
        totalPrice,
        isPaid,
        paidAt,
        isDelivered,
        deliveredAt,
    } = order ? order : {};
    // our global state
    const {state: {userInfo, cart}} = useContext(Store);
    // router
    const router = useRouter();
    useEffect(() => {
        if (!userInfo) {
            return router.push('/login');
        }
        const fetchOrder = async () => {
            try {
                // const data = await client.fetch(`*[_type == 'order']`);
                // console.log('datadata', data[0]);
                const {data} = await axios.get(`/api/orders/${orderId}`, {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                      },
                });
                console.log('ggg',data)
                dispatch({type: 'FETCH_SUCCESS', payload: data[0]})
            }
            catch(err) {
                dispatch({type: 'FETCH_FAIL', payload: err.message});console.log('err', err)
            }
        }
        if (!order?._id) {
            fetchOrder();
        } 
    }, [router, orderId, userInfo, order?._id]);

    const loadStripeScript = async () => {
        
        const stripe = await getStripe();
        const {data}= await axios.post(`/api/keys/stripe`, 
        {
            orderItems: orderItems,
        },
            {headers: {
                authorization: `Bearer ${userInfo.token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(data);
        stripe.redirectToCheckout({sessionId: data.id});
    }
    const setPayment = async () => {
        const {data}= await axios.post(`/api/orders/pay/${orderId}`, 
        {
            orderItems: orderItems,
        },
            {headers: {
                authorization: `Bearer ${userInfo.token}`,
                'Content-Type': 'application/json',
            },
        });
        setClicked(true);
    }
  return (
    <Layout  title={`Order ${orderId}`}>
      <Typography>
        Order {orderId}
      </Typography>
      {loading ? (<CircularProgress />) : error ? (<Alert varient="danger" />) : 
        <Grid container spacing={1}>
            <Grid item md={9} xs={12}>
                <Card sx={classes.section}>
                <List>
                    <ListItem>
                        <Typography component='h4' variant='h4' >Shipping Address</Typography>
                    </ListItem>
                    <ListItem>
                        {shippingAddress?.fullName}, {shippingAddress?.address}, {' '}, {shippingAddress?.city}, {shippingAddress?.postalCode}, {' '}, {shippingAddress?.country}
                    </ListItem>
                    <ListItem>
                        Status :  {' '} {
                            isDelivered ? `deliverd at ${deliveredAt}` : `not Delivered`
                        }
                    </ListItem>
                </List>
                </Card>
                <Card sx={classes.section}>
                    <List>
                        <ListItem>
                            <Typography component='h4' variant='h4' >Payment Method</Typography>
                        </ListItem>
                        <ListItem>
                            {paymentMethod}
                        </ListItem>
                        <ListItem>
                            Status :  {' '} {
                                isPaid ? `paid at ${paidAt}` : `not paid`
                            }
                        </ListItem>
                    </List>
                </Card>
                <Card sx={classes.section}>
                <List>
                    <ListItem>
                        <Typography component='h4' variant='h4' >Order Items</Typography>
                    </ListItem>
                    <ListItem>
                    
            

        
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderItems?.map((item) => (
                        <TableRow
                          key={item?.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          {/* <TableCell component="th" scope="row">
                            {row._key}
                          </TableCell> */}
                          <TableCell ><NextLink href={`/product/${item?.slug}`} passHref><Link variant='contained'><Image src={item?.image} alt={item?.name} width={50} height={50} /></Link></NextLink></TableCell>
                          <TableCell><NextLink href={`/product/${item?.slug}`} passHref><Link><Typography>{item?.name}</Typography></Link></NextLink></TableCell>
                          <TableCell>
                            <Select value={item?.quantity} onChange={(e) => updateProductQuantity(item, e.target.value)}>
                              {[...Array(item?.countInStock).keys()].map((x) => {
                                return <MenuItem value={x+1} key={x+1}>
                                  {x+1}
                                </MenuItem>
                              })}
                            </Select></TableCell>
                          <TableCell><Typography>$ {item?.price}</Typography></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </TableContainer>
                    </ListItem>
                
                </List>
            </Card>
        </Grid>
        <Grid item md={3} xs={12}>
           <Card>
            <List>
                <ListItem>
                    <Typography variant='h4' >Order Summary</Typography>
                </ListItem>
                <ListItem>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography>
                                Items:
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='right' >${itemsPrice}</Typography>
                        </Grid>
                    </Grid>
                </ListItem>
                <ListItem>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography>
                                Shipping:
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='right' >${shippingPrice}</Typography>
                        </Grid>
                    </Grid>
                </ListItem>
                <ListItem>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography>
                                Tax:
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='right' >${taxPrice}</Typography>
                        </Grid>
                    </Grid>
                </ListItem>
                <ListItem>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography>
                                Total:
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='right' >${totalPrice}</Typography>
                        </Grid>
                    </Grid>
                </ListItem>
                <ListItem>
                    {order?.isPaid ? 'Paid Successfully' : 
                    clicked ? <Box sx={{border: '1px solid #ffffff',}}>Paid Successfully</Box>: 
                    <Button onClick={() => {setPayment();}} variant='contained'>
                        Pay Now
                    </Button>}
                </ListItem>
            </List>                 
            </Card> 
        </Grid>                     
    </Grid>
      }
    </Layout>
  )
}
export const getServerSideProps = async ({params}) => {
    return {props: {params}}
} 
export default Order;
