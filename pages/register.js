import React, { useContext, useEffect } from 'react'
import {useForm, Controller} from 'react-hook-form';
import Layout from '../components/Layout';
import Form from '../components/Form';
import {useRouter} from 'next/router';
import { useSnackbar } from 'notistack';
import jsCookie from 'js-cookie';
import { Store } from '../utils/Store';
import { Alert, CircularProgress, Typography,TextField ,  Box, Link, Grid, ListItem, List, Rating, Card, Button } from '@mui/material';
import NextLink from 'next/link';
import axios from 'axios';
import { Router } from '@mui/icons-material';
const RegisterScereen = () => {
  
  console.log(process.env.JWT_SECRET)
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  // redirect
  const {redirect} = router.query;
  const {state, dispatch} = useContext(Store);
  const {userInfo} = state;
  console.log('ll', userInfo);
  
  useEffect(() => {
    if (userInfo?.name) router.push(redirect || '/');
  }, [router, userInfo, redirect]);

    const {handleSubmit, control, formState: {errors},} = useForm();
    const submitHandler = async ({name, email, password, confirmPassword}) => {
      console.log({name, email, password, confirmPassword})
      if (password !== confirmPassword) {
        enqueueSnackbar('Password dont match', {varient: 'error'});
        return;

      }
      try {
        const {data} = await axios.post('/api/users/register', {
          name, email, password, 
        });
        dispatch({type: 'USER_LOGIN', payload: JSON.stringify(data)});
        jsCookie.set('userInfo', JSON.stringify(data));
        router.push(redirect || '/');
      }
      catch(err) {
        enqueueSnackbar(err?.response?.data?.message ? err.response.data.message : err.message, {variant: 'error'});
        // console.log(err)
      }
    }
  return (
    <Layout>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography component='h1' varient='h1' >
          Register
        </Typography>
        <List>
          <ListItem>
            <Controller name='name' control={control} defaultValue='' rules={{required: true, minLength: 2,}} render={({field}) => <TextField varient='outlined' fullWidth id="name" label="Name" inputProps={{type: 'name'}} error={Boolean(errors?.name)} helperText={errors?.email ? errors?.name?.type == 'pattern' ? 'Name is not valid' : 'Name is required' : ''} {...field}></TextField>}>
            </Controller>
          </ListItem>
          <ListItem>
            <Controller name='email' control={control} defaultValue='' rules={{required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,}} render={({field}) => <TextField varient='outlined' fullWidth id="email" label="Email" inputProps={{type: 'email'}} error={Boolean(errors?.email)} helperText={errors?.email ? errors?.email?.type == 'pattern' ? 'Email is not valid' : 'Email is required' : ''} {...field}></TextField>}>
            </Controller>
          </ListItem>
          <ListItem>
            <Controller name='password' control={control} defaultValue='' rules={{required: true, minLength: 6,}} render={({field}) => <TextField varient='outlined' fullWidth id="password" label="Password" inputProps={{type: 'password'}} error={Boolean(errors?.password)} helperText={errors?.password ? errors?.password?.type == 'minLength' ? 'password length is less than 6' : 'Password is required' : ''} {...field}></TextField>}>
            </Controller>
          </ListItem>
          <ListItem>
            <Controller name='confirmPassword' control={control} defaultValue='' rules={{required: true, minLength: 6,}} render={({field}) => <TextField varient='outlined' fullWidth id="confirmPassword" label="Confirm Password" inputProps={{type: 'confirmPassword'}} error={Boolean(errors.confirmPassword)} helperText={errors.confirmPassword ? errors?.confirmPassword?.type == 'minLength' ? 'confirmPassword length is less than 6' : 'confirmPassword is required' : ''} {...field}></TextField>}>
            </Controller>
          </ListItem>
          <ListItem >
            <Button varient='contained' type='submit' fullWidth color='primary'>
              Register
            </Button>
          </ListItem>
          <ListItem>
            Already have an account ? <NextLink href={`/login?redirect=${redirect || '/'}`} passHref><Link>Login</Link></NextLink>
          </ListItem>
        </List>
      </Form>
    </Layout>
  )
}

export default RegisterScereen;
