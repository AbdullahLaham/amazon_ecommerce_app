import { Alert, CircularProgress, Grid, List, ListItem, MenuItem, Typography, Box, Select, Button } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import classes from '../utils/classes';
import { client } from '../utils/client';

const Search = () => {

    // prices
    const prices = [
        {
          name: '$1 to $50',
          value: '1-50',
        },
        {
          name: '$51 to $200',
          value: '51-200',
        },
        {
          name: '$201 to $1000',
          value: '201-1000',
        },
      ];
      // ratings
      const ratings = [1, 2, 3, 4, 5];

      
    //router
    const router = useRouter();
    const {category = 'all', query = 'all', price = 'all', rating = 'all', sort = 'default'} = router.query;
    const [state, setState] = useState({
        categories: [],
        products: [],
        loading: false,
        error: '',
    });
    const {loading, error, products} = state;
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
           try {
            const {data} = await axios.get(`/api/product/categories`);
            setCategories(data);
            console.log('data', data)
           }
           catch(err) {
            console.log(err);
           }

        }

        fetchCategories();

        const fetchData = async () => {
            try {
                let query1 = '*[_type == "product"';
                if (category !== 'all') {
                    query1 += `&& category match "${category}"`
                }
                if (query !== 'all') {
                    query1 += `&& name match ${query}`
                }
                if (price !== 'all') {
                    const minPrice = Number(price.split('-')[0]);
                    const maxPrice = Number(price.split('-')[1]);
                    query1 += `&& price >= ${minPrice} && price <= ${maxPrice}`;

                }
                if (rating !== 'all') {
                    query1 += `&& rating >= ${Number(rating)}`
                }
                let order = '';
                if (sort !== 'default') {
                    
                    if (sort == 'lowest') order = '| order(price asc)';
                    if (sort == 'highest') order = '| order(price desc)';
                    if (sort == 'toprated') order = '| order(rating desc)';
                }
                query1 += `] ${order}`;
                setState({loading: true,});
                const products = await client.fetch(query1);
                setState({loading: false, products});
                console.log('our Products', products)
            } catch(err) {
                setState({error: err.message, loading: false,})
            }
        }

        fetchData();
    }, [category, price, query, rating, sort]);
    const filterSearch = ({
        category, min, max, searchQuery, price, rating, sort
    }) => {
        const path = router.pathname;
        const {query} = router;
        if (searchQuery) {
            query.searchQuery = searchQuery;
        }
        if (sort) {
            query.sort = sort;
        }
        if (category) {
            query.category = category;
        }
        if (price) {
            query.price = price;
        }
        if (rating) {
            query.rating = rating;
        }
        router.push({
            pathname: path,
            query: query,
        })
    }
    const categoryHandler = (e) => {
        filterSearch({category: e.target.value});
    }
    const sortHandler = (e) => {
        filterSearch({sort: e.target.value});
    }
    const priceHandler = (e) => {
        filterSearch({price: e.target.value});
    }
    const ratingHandler = (e) => {
        filterSearch({rating: e.target.value});
    }

  return (
    <Layout title='search'>
      <Grid sx={classes?.section} container spacing={2} >
        <Grid item md={3} >
            <List>
                <ListItem>
                    <Box sx={classes.fullWidth}>
                        <Typography>Categories</Typography>
                        <Select fullWidth value={category} onChange={categoryHandler} >
                            <MenuItem value='all' >
                                All
                            </MenuItem>
                            {categories && categories.map((item, i) => {
                               return <MenuItem key={i} value={item}>
                                    {item}
                                </MenuItem>
                            })}
                        </Select>
                    </Box>
                </ListItem>
                <ListItem>
                    <Box sx={classes.fullWidth}>
                        <Typography>Prices</Typography>
                        <Select fullWidth value={price} onChange={priceHandler} >
                            <MenuItem value='all' >
                                All
                            </MenuItem>
                            {prices && prices.map((item, i) => {
                                return <MenuItem key={i} value={item.value}>
                                    {item.name}
                                </MenuItem>
                            })}
                        </Select>
                    </Box>
                </ListItem>
                <ListItem>
                    <Box sx={classes.fullWidth}>
                        <Typography>Ratings</Typography>
                        <Select fullWidth value={price} onChange={ratingHandler} >
                            <MenuItem value='all' >
                                All
                            </MenuItem>
                            {ratings && ratings.map((item, i) => {
                                return <MenuItem key={i} value={item}>
                                    {item}
                                </MenuItem>
                            })}
                        </Select>
                    </Box>
                </ListItem>
            </List>
        </Grid>

        
        <Grid item md={9} >
            <Grid container justifyContent='space-between' alignItems="center" >
            <Grid item>
              {products && products.length !== 0 ? products.length : 'No'}{' '}
              Results
              {query !== 'all' && query !== '' && ' : ' + query}
              {price !== 'all' && ' : Price ' + price}
              {rating !== 'all' && ' : Rating ' + rating + ' & up'}
              {(query !== 'all' && query !== '') ||
              rating !== 'all' ||
              price !== 'all' ? (
                <Button onClick={() => router.push('/search')}>X</Button>
              ) : null}
            </Grid>
            <Grid item>
                <Typography component='span' sx={classes.sort}>Sort By</Typography>
                <Select value={sort} onChange={sortHandler}>
                    <MenuItem value='default'>Default</MenuItem>
                    <MenuItem value='lowest'>Price: low to high</MenuItem>
                    <MenuItem value='highest'>Price: high to low</MenuItem>
                    <MenuItem value='toprated'>Customer Reviews</MenuItem>
                </Select>
            </Grid>
        </Grid>
        <Grid container sx={classes.section} spacing={3} >
            {
                loading ? <CircularProgress /> : error ? <Alert>{error}</Alert> : (
                    <Grid container spacing={3} >
                        {
                            products?.map((product, i) => {
                                return <Grid item key={i} >
                                    <ProductItem  product={product} />
                                </Grid>
                            })
                        }
                    </Grid>
                )
            }    
        </Grid>
      </Grid>
    </Grid>
    </Layout>
  )
}

export default Search
