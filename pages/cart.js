import { Grid, Button, Link, Typography, Box, List, Select, Table, TableBody, TableCell, TableContainer, TableHead , TableRow, Paper, MenuItem, ListItem} from '@mui/material';
import react, {useContext} from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
const CartScreen = () => {
    const router = useRouter();
    const {state: {cart: {cartItems}}, dispatch} = useContext(Store);
    // console.log('ddd', cartItems)
    // console.log([...Array(cartItems[0].countInStock).keys()])
    const updateProductQuantity = async (item, quantity) => {

    }
    const removeItemHandler = async (item) => {
      dispatch({type: 'CART_REMOVE_ITEM', payload: {
       item,
      }});
    }
  return (
    <div>
      <Layout title='Shoping cart' >
        <Typography comonent='h1' varient='h1'>
            Shopping cart
        </Typography>
        {cartItems?.length == 0 ? 
        <Box>
            <Typography>Cart is empty 
                <NextLink href="/" passHref>
                    <Link>Go Shopping</Link>
                </NextLink>
            </Typography>
            

        </Box> : (
            <Grid container>
                <Grid item md={9} xs={12}>
                <TableContainer component={Paper} >
                  <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Action</TableCell>
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
                          <TableCell>
                            <Button varient='contained' color='secondary' onClick={() => removeItemHandler(item)}> 
                              <DeleteIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </TableContainer>
                </Grid>
                <Grid md={3} xs={12}>
                  <List>
                    <ListItem>
                      <Typography varient='h2'>
                        Subtotal {cartItems?.reduce((a,c) => a + c?.quantity, 0)} items : ${' '}
                        {cartItems?.reduce((a,c) => a +(c?.quantity * c?.price), 0) }
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Button onClick={() => {router.push('/shipping')}} fullWidth color='primary' varient='contained' sx={{width: '100%'}}>
                         Checkout     
                      </Button>
                    </ListItem>
                  </List>          

                </Grid>
            </Grid>
        )}
      </Layout>
    </div>
  )
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false }); // its a client side page and i canot render it in the server side 
