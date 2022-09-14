import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react'
import { Store } from '../utils/Store';
import Form from '../components/Form'
import {Controller, useForm} from 'react-hook-form';
import { useSnackbar } from 'notistack';
import jsCookie from 'js-cookie';
import Layout from '../components/Layout';
import { List, ListItem, TextField, Typography, Button } from '@mui/material';
import axios from 'axios';

const Profile = () => {
    const {state: {userInfo}, dispatch} = useContext(Store);
    const router = useRouter();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const {
        handleSubmit,
        control,
        formState: {errors},
        setValue,

    } = useForm();

    useEffect(() => {
        if (!userInfo) {
            return router.push('/login');
        }
        setValue('name', userInfo?.name);
        setValue('email', userInfo?.email);
    }, [router, setValue, userInfo]);

    const submitHandler = async ({name, email, password, confirmPassword}) => {
      closeSnackbar();
      if (password != confirmPassword) {
        enqueueSnackbar('Password dont match', {variant: 'error'});
        return ;
      } 
      try {
        const {data} = await axios.put(`/api/users/profile`,
        {
          name, email, password,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          }
        });
        console.log('datadatadatadata', data)
        dispatch({type: 'USER_LOGIN', payload: data});
        jsCookie.set('userInfo', JSON.stringify(data));
        enqueueSnackbar('Profile details updated successfully', {variant: 'success',});

      } catch(err) {
        enqueueSnackbar(err.message, {variant: 'error',})
      }
    }
  return (
    <Layout title='Profile'>
      <Typography style={{fontSize: '2.8rem', borderBottom: '1px solid grey',color: 'grey', marginBottom: '3rem',}} component='h5' variant='h5'>Profile Details</Typography>
      <Form  onSubmit={handleSubmit(submitHandler)}>
      <List>
          <ListItem>
            <Controller name='name' control={control} defaultValue='' rules={{required: true, minLength: 2,}} render={({field}) => <TextField varient='outlined' fullWidth id="name" label="Name" inputProps={{type: 'name'}} error={Boolean(errors.name)} helperText={errors.name ? errors.name.type == 'minLength' ? 'Name length is less than 2' : 'Name is required' : ''} {...field}></TextField>}>
            </Controller>
          </ListItem>
          <ListItem>
            <Controller name='email' control={control} defaultValue='' rules={{required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,}} render={({field}) => <TextField varient='outlined' fullWidth id="email" label="Email" inputProps={{type: 'email'}} error={Boolean(errors.email)} helperText={errors.email ? errors.email.type == 'pattern' ? 'Email is not valid' : 'Email is required' : ''} {...field}></TextField>}>
            </Controller>
          </ListItem>
          <ListItem>
            <Controller name='password' control={control} defaultValue='' rules={{
              validate: (value) => 
                value === '' || value.length > 5 || 'password length is more than 5'

            }} render={({field}) => <TextField varient='outlined' fullWidth id="password" label="Password" inputProps={{type: 'password'}} error={Boolean(errors.password)} helperText={errors.password ? 'password length is more than 5' : ''} {...field}></TextField>}>
            </Controller>
          </ListItem>
          <ListItem>
            <Controller name='confirmPassword' control={control} defaultValue='' rules={{
              validate: (value) => 
                value === '' || value.length > 5 || 'password length is more than 5'

            }} render={({field}) => <TextField varient='outlined' fullWidth id="confirmPassword" label="Confirm Password" inputProps={{type: 'confirmPassword'}} error={Boolean(errors.confirmPassword)} helperText={errors.confirmPassword ? 'confirmPassword length is more than 5' : ''} {...field}></TextField>}>
            </Controller>
          </ListItem>
          <ListItem >
            <Button variant='contained' type='submit' fullWidth color='primary'>
              Update
            </Button>
          </ListItem>
        </List>
      </Form>
    </Layout>
  )
}

export default Profile
