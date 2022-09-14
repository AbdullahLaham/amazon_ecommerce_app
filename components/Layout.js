import React, {useContext, useEffect, useState} from 'react'
import { createTheme } from '@mui/material/styles';
import {Store} from '../utils/Store';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import {
    CssBaseline,
    AppBar,
    Badge,
    Box,
    Button,
    Container,
    Divider,
    Drawer,
    IconButton,
    InputBase,
    Link,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Switch,
    ThemeProvider,
    Toolbar,
    Typography,
    useMediaQuery,
    
  } from '@mui/material';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import NextLink from 'next/link';
import classes from '../utils/classes'
const Layout = ({title, description, children}) => {
    const {state, dispatch} = useContext(Store);
    const {cart, userInfo} = state;
    const [openSidebar, setOpenSidebar] = useState(false);
    // userInfo = JSON.parse(userInfo)
    console.log(userInfo)
    // console.log(cart.cartItems.length)
    const {darkMode} = state;
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState(null);
    const [query, setQuery] = useState('');
    const MenuCloseHandler = (e, redirect) => {
        setAnchorEl(null);
        if (redirect) {
            router.push(redirect);
        }
    }
    const loginHandler = (e) => {
        setAnchorEl(e.currentTarget);

    }
    const logoutHandler = () => {
        setAnchorEl(null);
        jsCookie.remove('cartItems');
        jsCookie.remove('userInfo');
        jsCookie.remove('shippingAddress');
        jsCookie.remove('paymentMethod');
        dispatch({type: 'USER_LOGOUT'})
        router.push('/');
    }
    const theme = createTheme({
        typography: {
            h1 :{
                fontSize: '1.5rem',
                fontWeight: 400,
                margin: '1rem 0',
            },
            h1 :{
                fontSize: '1.3rem',
                fontWeight: 400,
                margin: '1rem 0',
            },

        },
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: '#f0c000'
            },
            secondary: {
                main: '#208000',
            },
        },
    });
    const darkModeChangeHandler = () => {
        dispatch({
            type: !darkMode ? 'DARK_ON' : 'DARK_OFF'
        })
        const newDarkMode = darkMode;
        jsCookie.set('darkMode', newDarkMode ? 'ON' : 'OFF');
    }
    const sidebarOpenHandler = (e) => {
        setOpenSidebar(true);
    }
    const sidebarCloseHandler = (e) => {
        setOpenSidebar(false);
    }
    // using the media query mui hook to get the size of the screen
    const isDesktop = useMediaQuery('(min-width: 600px)')

    // enqueueSnackbar
    const { enqueueSnackbar } = useSnackbar();

    // categories state
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const {data} = await axios.get('/api/product/categories');
                setCategories(data);
            }
            catch(err) {
                enqueueSnackbar(err.message, {variant: 'error' })
            }
        }
        fetchCategories();
    }, []);
    const queryChangeHandler = (e) => {
        setQuery(e.target.value);
    }
    const submitHandler = (e) => {
        e.preventDefault();
        router.push(`/search?query=${query}`)
    }
  return (
    <div>
      <Head>
        <title>{title ? `${title} - Sanity Amazon` : 'Sanity Amazon'}</title>
        {description && <meta name='description' content={description} ></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position='static' sx={classes.appbar}>
            <Toolbar sx={classes.toolbar}>
                <Box display='flex' alignItems='center'>
                    <IconButton
                        edge="start"
                        aria-label="open drawer"
                        onClick={sidebarOpenHandler}
                        sx={classes.menuButton}
                >
                    <MenuIcon sx={classes.navbarButton} />
                </IconButton>
                    <NextLink href='/' passHref>
                        <Link >
                            <Typography sx={classes.brand}>amazon</Typography>
                        </Link>
                    </NextLink>
                </Box>
                <Drawer anchor='left' open={openSidebar} onClose={sidebarCloseHandler} >
                    <List>
                        <ListItem>
                            <Box display='flex' alignItems='center' justifyContent='space-between' >
                                <Typography>Shopping by category</Typography>
                                <IconButton aria-label='close' onClick={sidebarCloseHandler} >
                                    <CancelIcon />
                                </IconButton>
                            </Box>
                        </ListItem>
                        <Divider light/>
                        {
                            categories?.map((item, i) => {
                                return <NextLink key={i} href={`/search?category=${item}`} passHref>
                                    <ListItem button component='a' onClick={sidebarCloseHandler}>
                                        <ListItemText primary={item}></ListItemText>
                                    </ListItem>
                                </NextLink>
                            })
                        }
                    </List>
                </Drawer>
                <Box sx={isDesktop ? classes.visible : classes.hidden} >
                    <form onSubmit={submitHandler}>
                        <Box sx={classes.searchForm}>
                            <InputBase  name="query"
                                sx={classes.searchInput}
                                placeholder="Search products"
                                onChange={queryChangeHandler} />
                            <IconButton
                                type="submit"
                                sx={classes.searchButton}
                                aria-label="search"
                            >
                                <SearchIcon />
                            </IconButton>

                        </Box>
                    </form>
                </Box>
                
                <Box>
                    <Switch ckecked={darkMode}onChange={darkModeChangeHandler} >

                    </Switch>
                    <NextLink href="/cart" passHref>
                        <Link>
                            <Typography component="span" >
                                {cart?.cartItems?.length > 0 ? (
                                    <Badge color='secondary' badgeContent={cart.cartItems.length}>Cart</Badge>
                                ) : 'Cart'}
                            </Typography>
                        </Link>
                    </NextLink>
                    {userInfo?.name ? (
                        <>
                            <Button aria-controls="simple-menu" aria-haspopup='true' sx={classes.navbarButton} onClick={loginHandler}>
                                {userInfo.name}
                            </Button>
                            <Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={MenuCloseHandler}>
                                <MenuItem onClick={(e) => MenuCloseHandler(e, '/profile')}>
                                    Profile
                                </MenuItem>
                                <MenuItem onClick={(e) => MenuCloseHandler(e, '/order-history')}>
                                    Order History
                                </MenuItem>
                                <MenuItem onClick={(e) => logoutHandler(e)}>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <NextLink href='/login' passHref >
                            <Link>Login</Link>           
                        </NextLink>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
        <Container component='main' sx={classes.main}>
            {children}
        </Container>
        <Box component='footer' sx={classes.footer}>
            <Typography>All rights reserved, Sanity Amazon</Typography>
        </Box>
      </ThemeProvider>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Layout), { ssr: false }); // its a client side page and i canot render it in the server side 

