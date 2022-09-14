import { Typography, List, ListItem, TextField, Button } from '@mui/material';
import React, { useContext, useEffect } from 'react'
import Checkout from '../components/Checkout';
import Layout from '../components/Layout';
import Form from '../components/Form';
import jsCookie from 'js-cookie';
import {useForm, Controller} from 'react-hook-form';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';

const ShippngScreen = () => {
    const {handleSubmit, control, formState: {errors}, setValue} = useForm();
    const router = useRouter();
    const {state: {userInfo, cart: {shippingAddress}}, dispatch} = useContext(Store);
    
    const submitHandler = ({fullName, address, city, postalCode, country}) => {
        dispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {fullName, address, city, postalCode, country}
        });
        jsCookie.set('shippingAddress', JSON.stringify({
            fullName, address, city, postalCode, country,
        }));
        router.push('/payment')
    }
    useEffect(() => {
        if (!userInfo) {
            router.push('/login?redirect=/shipping');
            return;
        }
        setValue('fullName', shippingAddress.fullName)
        setValue('address', shippingAddress.address)
        setValue('city', shippingAddress.city)
        setValue('postalCode', shippingAddress.postalCode)
        setValue('country', shippingAddress.country)

    }, [router, setValue, shippingAddress, userInfo])
    return (
        <Layout title="Shipping Address">
        <Checkout activeStep={1} ></Checkout>
        
        <Form onSubmit={handleSubmit(submitHandler)}>
            <Typography component='h1' variant='h1'>
                Shipping Address
            </Typography>
            <List>
                <ListItem>
                    <Controller name='fullName' control={control} defaultValue='' rules={{required: true, minLength: 2,}} render={({field}) => <TextField varient='outlined' fullWidth id="fullName" label="Full Name" inputProps={{type: 'fullName'}} error={Boolean(errors?.fullName)} helperText={errors?.fullName ? errors?.fullName?.type == 'pattern' ? 'Full Name is not valid' : 'fullName is required' : ''} {...field}></TextField>}>
                    </Controller>
                </ListItem>
                <ListItem>
                    <Controller name='address' control={control} defaultValue='' rules={{required: true, minLength: 2,}} render={({field}) => <TextField varient='outlined' fullWidth id="address" label="Address" inputProps={{type: 'address'}} error={Boolean(errors?.address)} helperText={errors?.address ? errors?.address?.type == 'pattern' ? 'address is not valid' : 'address is required' : ''} {...field}></TextField>}>
                    </Controller>
                </ListItem>
                <ListItem>
                    <Controller name='city' control={control} defaultValue='' rules={{required: true, minLength: 2,}} render={({field}) => <TextField varient='outlined' fullWidth id="city" label="City" inputProps={{type: 'city'}} error={Boolean(errors?.city)} helperText={errors?.city ? errors?.city?.type == 'pattern' ? 'City is not valid' : 'City is required' : ''} {...field}></TextField>}>
                    </Controller>
                </ListItem>
                <ListItem>
                    <Controller name='postalCode' control={control} defaultValue='' rules={{required: true, minLength: 2,}} render={({field}) => <TextField varient='outlined' fullWidth id="postalCode" label="Postal Code" inputProps={{type: 'postalCode'}} error={Boolean(errors?.postalCode)} helperText={errors?.postalCode ? errors?.city?.type == 'pattern' ? 'postalCode is not valid' : 'postalCode is required' : ''} {...field}></TextField>}>
                    </Controller>
                </ListItem>
                <ListItem>
                    <Controller name='country' control={control} defaultValue='' rules={{required: true, minLength: 2,}} render={({field}) => <TextField varient='outlined' fullWidth id="country" label="Country" inputProps={{type: 'country'}} error={Boolean(errors?.country)} helperText={errors?.country ? errors?.city?.type == 'pattern' ? 'country is not valid' : 'country is required' : ''} {...field}></TextField>}>
                    </Controller>
                </ListItem>
                <ListItem>
                    <Button variant='contained' type='submit' fullWidth color='primary'>
                        Continue
                    </Button>
                </ListItem>
            </List>
        </Form>
        
            
        </Layout>
    )
}

export default ShippngScreen
