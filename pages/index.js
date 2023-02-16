import Head from 'next/head';
import Image from 'next/image';
import {CircularProgress, Typography, Grid, Alert} from '@mui/material';
import Layout from '../components/Layout';
import {client} from '../utils/client';
import {useEffect, useState} from 'react';
import Product from '../amazonecommerceapp/schemas/product';
import ProductItem from '../components/ProductItem';
export default function Home() {
  const [state, setState] = useState({
    products: [],
    error: '',
    loading: false,
  });
  const {loading, error, products} = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await client.fetch(`*[_type == "product"]`);
        setState({...state, products, loading: false});
      }
      catch(err) {
        setState({...state, error: err.message, loading: false});
      }
    }
    fetchData();
  }, []);

  return (
    <div className=''>
      <Layout>
      <Grid container spacing={3} >
        {loading ? (<CircularProgress />) : error ? (<Alert varient="danger" />) : 
        products.map((product, i) => {
          return (
            <Grid item md={4} key={i} >
              <ProductItem product={product}></ProductItem>
            </Grid>
          )
        })
      }
     </Grid>
      </Layout>
    </div>
  )
}

