import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout';
import Checkout from '../components/Checkout';
import Form from '../components/Form';
import { useRouter } from 'next/router';
import jsCookie from 'js-cookie';
import { Store } from '../utils/Store';
import { useSnackbar } from 'notistack';

import { ListItem, Typography, List, FormControl, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const router = useRouter();
    const {state, dispatch} = useContext(Store)
    const {cart: {shippingAddress}} = state;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    // 
    useEffect(() => {
        if (!shippingAddress.address) {
            router.push('/shipping');
        } else {
            setPaymentMethod(jsCookie.get('paymentMethod') || '');
        }
    }, [router, shippingAddress])
    const submitHandler = (e) => {
        e.preventDefault();
        if (!paymentMethod) {
            enqueueSnackbar('Payment method is required', {varient: 'error'});
        }
        else {
            jsCookie.set('paymentMethod', paymentMethod);
            dispatch({type: 'SAVE_PAYMENT_METHOD', payload: 
                paymentMethod,
            });
            router.push('/placeorder');
        }
    }
  return (
    <Layout title="Payment Method">
      <Checkout activeStep={2}></Checkout>
      <Form onSubmit={submitHandler}>
        <Typography component='h1' variant='h1'>
            Payment Method
        </Typography>
        <List>
            <ListItem>
                <FormControl component='fieldset'>
                    <RadioGroup
                    aria-label='Payment Method' name='PaymentMethod' value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <FormControlLabel label='PayPal' value='PayPal' control={<Radio />}>

                        </FormControlLabel>
                        <FormControlLabel label='Stripe' value='Stripe' control={<Radio />}>

                        </FormControlLabel>
                        <FormControlLabel label='Cash' value='Cash' control={<Radio />}>
                            
                        </FormControlLabel>
                    </RadioGroup>
                </FormControl>
            </ListItem>
            <ListItem>
                <Button fullWidth type="submit" variant='contained' color='primary'>
                    Continue
                </Button>
            </ListItem>
            <ListItem>
                <Button fullWidth type="button" variant='contained' color='secondary' onClick={() => {router.push('/shipping')}}>
                    Back
                </Button>
            </ListItem>
        </List>

      </Form>
    </Layout>
  )
}

export default PaymentScreen
