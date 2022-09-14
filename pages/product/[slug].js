import React, {useEffect, useState, useContext} from 'react'
import { client, urlFor } from '../../utils/client';
import classes from '../../utils/classes';
import Layout from '../../components/Layout';
import Image from 'next/image';
import NextLink from 'next/link';
import {Store} from '../../utils/Store';
import jsCookie from 'js-cookie';
import { useSnackbar } from 'notistack';
import {useRouter} from 'next/router';
import { Alert, CircularProgress, Typography, Box, Link, Grid, ListItem, List, Rating, Card, Button } from '@mui/material';
import axios from 'axios';
import { Router } from 'next/router';
const ProductDetails = ({slug}) => {
  //router 
  const router = useRouter();
  const {state: {cart}, dispatch} = useContext(Store);
  // enqueueSnackbar function
  const { enqueueSnackbar } = useSnackbar();
 const [currenState, setState] = useState({
    product: '',
    loading: false,
    error: '',
 });
 
 useEffect(() => {
  const fetchData = async () => {
       try {
        const product = await client.fetch(`*[_type == "product" && slug.current == '${slug}']`);
        setState({...currenState, product, loading: false});
      currenState
       }
       catch (error) {
        setState({...currenState, error: err.message, loading: false});
       }
    
  }
  fetchData();
}, [])
console.log('rere', currenState.product, 'roro', cart.cartItems)
// add to cart
const addToCartHandler = () => {
  console.log('cliked');
  // const product = currenState.product;
  const existItem = cart.cartItems.find(x => x?._key === product?._id);
  console.log('uuuuuuuu', cart.cartItems, currenState.product)
  const quantity = existItem ? existItem.quantity + 1: 1;
  const data = axios.get(`/api/products/${product?._id}`);
  if (quantity > data.countInStock) {
    enqueueSnackbar('Sorry Produc is out of Stock!', {variant: error});
    return;
  }
  const {name, countInStock, price, image} = product;
  const prodData = {name, countInStock, price, image}
  dispatch({type: 'CART_ADD_ITEM', payload: {
    _key: product._id,
    ...prodData,
    image: urlFor(image),
    slug: product?.slug?.current,
    quantity,

  }});
  enqueueSnackbar(`${product?.name} added to the cart`, {variant: 'success'});
  router.push('/cart')
}
 let {product, loading, error} = currenState;
 product = product[0];
 console.log('rating', product?.rating);
  return (
    <div>
      <Layout title={product?.title}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert variant='error'>{error}</Alert> 
        ) :
        (
          <Box>
            <Box sx={classes.section}>
              <NextLink href={"/"} passHref>
                <Link> 
                <Typography>
                  back to result
                </Typography>
                </Link>
              </NextLink>
            </Box>
            <Grid container spacing={1} >
              <Grid item xs={12} md={6} >
                <Image 
                  src={product?.image ? urlFor( product.image) : ''}
                  alt={product?.name}
                  width={440}
                  height={440}/>

              </Grid>
              <Grid md={3} xs={12} >
                <List>
                  <ListItem>
                    <Typography component='h1' variant='h1'>
                      {product?.name}
                    </Typography>

                  </ListItem>
                  <ListItem>
                    Category: {product?.category}
                  </ListItem>
                  <ListItem>
                    Brand: {product?.brand}
                  </ListItem>
                   <ListItem sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start',}}>
                     <Typography><Rating value={product?.rating ? product?.rating > 5 ? 5 : product?.rating : 3} readOnly/></Typography>
                     <Typography sx={{fontSize: '15px'}}>(${product?.numReviews} reviews)</Typography>
                  </ListItem>
                  <ListItem>                     
                     <Typography>Description: {product?.description}</Typography>
                  </ListItem>
                </List>
              </Grid>
              <Grid item md={3} xs={12}>
                <Card>
                  <List>
                    <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Price</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>$ {product?.price}</Typography>
                      </Grid>
                    </Grid>
                    </ListItem>

                    <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Status</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>$ {product?.countInStock > 0 ? 'In Stock' : 'Unavailable'}</Typography>
                      </Grid>
                    </Grid>
                    </ListItem>

                    <ListItem>
                      <Button variant='contained' fullWidth onClick={addToCartHandler}>Add To Cart</Button>
                    </ListItem>
                  </List>
                </Card>
              </Grid>
            </Grid>
          </Box>
        ) 
        }
      </Layout>
    </div>
  )
}

export default ProductDetails
export const getServerSideProps = ({params: {slug}}) => {
    return {props: {slug: slug}}
}