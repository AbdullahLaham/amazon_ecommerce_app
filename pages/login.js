import React, {useContext, useEffect} from 'react'
import {useForm, Controller} from 'react-hook-form';
import Layout from '../components/Layout';
import Form from '../components/Form';
import jsCookie from 'js-cookie';
import { Alert, CircularProgress, Typography,TextField ,  Box, Link, Grid, ListItem, List, Rating, Card, Button } from '@mui/material';
import NextLink from 'next/link';
import { useSnackbar } from 'notistack';
import {Store}  from '../utils/Store';
import { useRouter } from 'next/router';
import { getError } from '../utils/error';
import axios from 'axios';
const LoginScereen = () => {
  // global state data.
  const {state, dispatch} = useContext(Store);
  const {userInfo} = state;
  const router = useRouter();
  // redirect
  const {redirect} = router.query;
  useEffect(() => {
    if (userInfo) router.push(redirect || '/');
  }, [router, userInfo, redirect])
    const { enqueueSnackbar } = useSnackbar();
    const {handleSubmit, control, formState: {errors},} = useForm();
    
    const submitHandler = async ({email, password}) => {
      try {
        const { data } = await axios.post('/api/users/login', {
          email,
          password,
        });
        dispatch({ type: 'USER_LOGIN', payload: data });
        jsCookie.set('userInfo', JSON.stringify(data));
        router.push(redirect || '/');
      } catch (err) {
        enqueueSnackbar(err.response.data.message ? err.response.data.message : err.message, { variant: 'error' });
      }
    }
  return (
    <Layout>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography component='h1' varient='h1' >
          Login
        </Typography>
        <List>
          <ListItem>
            <Controller name='email' control={control} defaultValue='' rules={{required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,}} render={({field}) => <TextField varient='outlined' fullWidth id="email" label="Email" inputProps={{type: 'email'}} error={Boolean(errors.email)} helperText={errors.email ? errors.email.type == 'pattern' ? 'Email is not valid' : 'Email is required' : ''} {...field}></TextField>}>
            </Controller>
          </ListItem>
          <ListItem>
            <Controller name='password' control={control} defaultValue='' rules={{required: true, minLength: 6,}} render={({field}) => <TextField varient='outlined' fullWidth id="password" label="Password" inputProps={{type: 'password'}} error={Boolean(errors.password)} helperText={errors.password ? errors.password.type == 'minLength' ? 'password length is less than 6' : 'Password is required' : ''} {...field}></TextField>}>
            </Controller>
          </ListItem>
          <ListItem >
            <Button variant='contained' type='submit' fullWidth color='primary'>
              Login
            </Button>
          </ListItem>
          <ListItem>
            Do not have an account ? <NextLink href={`/register?redirect=${redirect || '/'}`} passHref><Link>Register</Link></NextLink>
          </ListItem>
        </List>
      </Form>
    </Layout>
  )
}

export default LoginScereen;
