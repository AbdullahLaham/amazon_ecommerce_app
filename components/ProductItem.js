import React, {useContext} from 'react'
import NextLink from 'next/link';
import {Card, CardActionArea, CardActions, CardContent, CardMedia, Typography, Button, Rating } from '@mui/material';
import { urlFor } from '../utils/client';
import {Store} from '../utils/Store';
import {useRouter} from 'next/router';
import { useSnackbar } from 'notistack';

import axios from 'axios'
const ProductItem = ({product}) => {
  // snackbar
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const {state: {cart}, dispatch} = useContext(Store);
  console.log('uuuuuuuu', cart.cartItems, product)
  const addToCart = () => {
    
    const existItem = cart.cartItems.find(x => x?._key === product?._id);
    const quantity = existItem ? existItem?.quantity + 1: 1;
    const data = axios.get(`/api/products/${product?._id}`);
    if (quantity > data.countInStock) {
      enqueueSnackbar('Sorry Produc is out of Stock!', {varient: error});
      return;
    }
    const {name, countInStock, price, image} = product;
    const prodData = {name, countInStock, price, image}
    dispatch({type: 'CART_ADD_ITEM', payload: {
      _key: product._id,
      ...prodData,
      image: urlFor(image),
      slug: product.slug.current,
      quantity,

    }});
    enqueueSnackbar(`${product?.name} added to the cart`, {variant: 'success'});
    router.push('/cart')
  }
  return (
    <Card sx={{width: '16rem', padding: '1rem', margin: 'auto', borderRadius: '1rem', boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',}}>
      <NextLink href={`/product/${product?.slug.current}`} passHref>
        <CardActionArea>
            <CardMedia
            component='img'
            image={urlFor(product.image)}
            title={product.name}
            sx={{objectFit: 'cover'}}
            >
                
            </CardMedia>
            <CardContent>
                <Typography>{product?.name}</Typography>
                
            </CardContent>
            <Typography><Rating value={product?.rating}/> {product?.numReviews} reviews</Typography>
        </CardActionArea>
      </NextLink>
        <Typography>{product?.price} $ </Typography>
        <Button size='small' color='primary' onClick={addToCart} variant='contained'>Add To Cart</Button>
    </Card>
  )
}

export default ProductItem

