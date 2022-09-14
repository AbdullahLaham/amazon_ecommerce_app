import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout';
import Checkout from '../components/Checkout';
import classes from '../utils/classes';
import { Store } from '../utils/Store';
import { Button, Link, Grid, Select, ListItem, Typography, Card, List, TableContainer, Table, MenuItem , TableHead, TableRow, TableCell, TableBody, CircularProgress} from '@mui/material';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import jsCookie from 'js-cookie';
import cart from './cart';
import axios from 'axios';
const PlaceOrder = () => {
    const {state, dispatch} = useContext(Store);
    const {userInfo, cart: {cartItems, shippingAddress, paymentMethod}} = state;
    const router = useRouter();
    const round2 = (num) => Math.round(num*100+Number.EPSILON) / 100; // 123.456 => 123,45
    const itemsPrice = round2(cartItems.reduce((a,c) => a+c.price*c.quantity, 0));
    const shippingPrice = itemsPrice > 200 ? 0 : 15;
    const taxPrice = round2(itemsPrice * 0.15);
    const totalPrice = round2(shippingPrice+taxPrice+itemsPrice);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        
        if (cart.length == 0) {
            router.push('/cart');

        }
    }, [router, cartItems, paymentMethod]);
    const placeOrderHandler = async () => {
        try {
          setLoading(true);
          const { data } = await axios.post(
            '/api/orders',
            {
              orderItems: cartItems.map((x) => ({
                ...x,
                countInStock: undefined,
                slug: undefined,
              })),
              shippingAddress,
              paymentMethod,
              itemsPrice,
              shippingPrice,
              taxPrice,
              totalPrice,
            },
            {
              headers: {
                authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
          dispatch({ type: 'CART_CLEAR' });
          jsCookie.remove('cartItems');
          setLoading(false);
          console.log('data', data)
          router.push(`/order/${data}`);
        } catch (err) {
          setLoading(false);
          enqueueSnackbar(err, { variant: 'error' });
        }
      };
  return (
    <Layout title='Place Order'>
      <Checkout activeStep={3}></Checkout>
      <Typography component='h1' variant='h1'>
        Place Order
      </Typography>
      <Grid container spacing={1}>
        <Grid item md={9} xs={12} >
            <Card sx={classes.section}>
                <List>
                    <ListItem>
                        <Typography component='h4' variant='h4' >Shipping Address</Typography>
                    </ListItem>
                    <ListItem>
                        {shippingAddress.fullName}, {shippingAddress.address}, {' '}, {shippingAddress.city}, {shippingAddress.postalCode}, {' '}, {shippingAddress.country}
                    </ListItem>
                    <ListItem>
                        <Button onClick={(() => {router.push('/shipping')})} variant='contained' color='secondary' >Edit </Button>
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
                        <Button onClick={(() => {router.push('/payment')})} variant='contained' color='secondary' >Edit </Button>
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
                      {cartItems?.map((item) => (
                        <TableRow
                          key={item?.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          {/* <TableCell component="th" scope="row">
                            {row._key}
                          </TableCell> */}
                          <TableCell ><NextLink href={`/product/${item?.slug}`} passHref><Link ><Image src={item?.image} alt={item?.name} width={50} height={50} /></Link></NextLink></TableCell>
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
                    <ListItem>
                        <Button onClick={(() => {router.push('/payment')})} variant='contained' color='secondary' >Edit </Button>
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
                                Total:
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='right' >${totalPrice}</Typography>
                        </Grid>
                    </Grid>
                </ListItem>
                <ListItem>
                    <Button onClick={placeOrderHandler} variant='contained' color='primary' fullWidth disabled={loading}>
                        Place Order      
                    </Button>
                </ListItem> 
                <ListItem>
                    {
                        loading && (
                            <CircularProgress />
                        )
                    }
                </ListItem> 
                             
            </List>                 
            </Card>                   
        </Grid>
      </Grid>
    </Layout>
  )
}

export default PlaceOrder
