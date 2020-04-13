import React from "react"
import PropTypes from "prop-types"
import { Router, Redirect, Link } from 'react-router-dom'
import { createBrowserHistory } from "history";
import Route from './Route'
import axios from 'axios'

import { Container, AppBar, Typography, Toolbar, createMuiTheme, ThemeProvider, Box, makeStyles, InputLabel } from '@material-ui/core'
import { Button, Menu, MenuItem, Divider, Hidden, IconButton, SwipeableDrawer } from '@material-ui/core'
import { List, ListItem, ListItemText, Collapse, TextField, InputBase } from '@material-ui/core'
import { FormControl, withStyles } from '@material-ui/core'

import { fade } from '@material-ui/core'
import 'typeface-roboto'
import { grey, indigo } from "@material-ui/core/colors"
import { ExpandMore, Menu as MenuIcon, Search as SearchIcon, ShoppingCart, AccountCircle } from "@material-ui/icons"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[800]
    },
    secondary: indigo
  },
})

const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
})

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      productMenuOpen: false,
      productMenuAncher: null,
      companyPagesPath: null,
      companyMenuAncher: null,
      sideBarOpen: false,
      productsCollapseOpen: false,
      companyCollapseOpen: false,
      history: createBrowserHistory(),
    };
  }

  componentDidMount() {
    axios({
      url: "/api/categories",
      method: "get"
    }).then(response => {
      this.setState({categories: response.data})
    })

    axios({
      method: "get",
      url: "/api/pages"
    }).then(response => {
      this.setState({ companyPagesPath: response.data })
    })
  }

  onProductNavButtonClick = (event) => {
    this.setState({ productMenuAncher: event.currentTarget })
  }
  onProductMenuClose = () => {
    this.setState({ productMenuAncher: null })
  }

  onCompanyNavButtonClick = (event) => {
    this.setState({ companyMenuAncher: event.currentTarget })
  }
  onCompanyMenuClose = () => {
    this.setState({ companyMenuAncher: null })
  }

  toggleSideBar = (openState) => (event) => {
    this.setState({ sideBarOpen: openState })
  }
  toggleProductList = (event) => {
    this.setState({ productsCollapseOpen: !this.state.productsCollapseOpen })
  }
  toggleCompanyList = (event) => {
    this.setState({ companyCollapseOpen: !this.state.companyCollapseOpen })
  }

  searchBarKeyDown = (event) => {
    if (event.keyCode == 13) {
      this.state.history.push({
        pathname: "/search",
        search: `?q=${event.target.value}`,
      })
      console.log(event.target)
      event.target.value = ""
    }
  }

  render () {
    if (this.state.categories == null || this.state.companyPagesPath == null) {
      return (<div></div>)
    }

    const productMenuItems = this.state.categories.map((item) => {
      return (<MenuItem key={item.id} component={Link} to={`/category/${item.id}`} onClick={this.onProductMenuClose}>{ item.name }</MenuItem>)
    })

    const companyMenuItems = this.state.companyPagesPath.map(item => {
      return (<MenuItem key={item.id} component={Link} to={`/${item.url}`} onClick={this.onCompanyMenuClose}>{ item.title }</MenuItem>)
    })

    const productListItems = this.state.categories.map(item => {
      return (
      <ListItem button key={item.id} component={Link} to={`/category/${item.id}`} onClick={this.toggleSideBar(false)}>
        <ListItemText primary={item.name} />
      </ListItem>)
    })

    const companyListItems = this.state.companyPagesPath.map(item => {
      return (
      <ListItem button key={item.id} component={Link} to={`/${item.url}`} onClick={this.toggleSideBar(false)}>
        <ListItemText primary={item.title} />
      </ListItem>)
    })

    const classes = this.props.classes

    return (
      <Router history={this.state.history}>
        <ThemeProvider theme={theme}>
        <div>
          <AppBar position="static">
            <Toolbar>
              <Hidden xsDown>
                <Box><Link to="/" id="logo"><Typography variant="h5">Galaxy Boutique</Typography></Link></Box>
                <Box ml={2}>
                  <Button style={{color: grey[50]}} endIcon={<ExpandMore />}
                    aria-controls="products-category-menu" aria-haspopup="true" onClick={this.onProductNavButtonClick}
                  >
                    Products
                  </Button>
                  <Menu id="products-category-menu" anchorEl={this.state.productMenuAncher} open={Boolean(this.state.productMenuAncher)} onClose={this.onProductMenuClose}>
                    <MenuItem component={Link} key="0" onClick={this.onProductMenuClose} to="/products">All Products</MenuItem>
                    <Divider />
                    {productMenuItems}
                  </Menu>
                </Box>
                <Box ml={2}>
                  <Button style={{color: grey[50]}} endIcon={<ExpandMore />}
                    aria-controls="company-menu" aria-haspopup="true" onClick={this.onCompanyNavButtonClick}
                  >
                    Company
                  </Button>
                  <Menu id="company-menu" anchorEl={this.state.companyMenuAncher} open={Boolean(this.state.companyMenuAncher)} onClose={this.onCompanyMenuClose}>
                    {companyMenuItems}
                  </Menu>
                </Box>
                <Hidden smDown>
                  <Box ml={4}>
                    <div className={classes.search}>
                      <div className={classes.searchIcon}>
                        <SearchIcon />
                      </div>
                      <InputBase
                        placeholder="Search…"
                        classes={{
                          root: classes.inputRoot,
                          input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                        onKeyDown={this.searchBarKeyDown}
                      />
                    </div>
                  </Box>
                </Hidden>
                <div className={classes.grow} />
                <Hidden mdUp>
                  <Box>
                    <IconButton component={Link} to="/search" color="inherit">
                      <SearchIcon />
                    </IconButton>
                  </Box>
                </Hidden>
                <Box>
                  <IconButton component={Link} to="/user" color="inherit">
                    <AccountCircle />
                  </IconButton>
                </Box>
                <Box>
                  <IconButton component={Link} to="/cart" color="inherit">
                    <ShoppingCart />
                  </IconButton>
                </Box>
              </Hidden>

              <Hidden smUp>
                <Box>
                  <IconButton edge="start" color="inherit" onClick={this.toggleSideBar(true)}>
                    <MenuIcon />
                  </IconButton>
                </Box>
                <SwipeableDrawer
                  anchor="left"
                  open={this.state.sideBarOpen}
                  onOpen={this.toggleSideBar(true)}
                  onClose={this.toggleSideBar(false)}
                >
                  <List>
                    <ListItem>
                      <Typography variant="h5">Galaxy Boutique</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem button component={Link} to="/" onClick={this.toggleSideBar(false)}>
                      <ListItemText primary="Home" />
                    </ListItem>

                    <ListItem button onClick={this.toggleProductList}>
                      <ListItemText primary="Products" />
                    </ListItem>
                    <Collapse in={this.state.productsCollapseOpen} timeout="auto" unmountOnExit>
                      <Box pl={3}>
                        <List>
                        <ListItem button component={Link} to="/products" onClick={this.toggleSideBar(false)}>
                          <ListItemText primary="All Products" />
                        </ListItem>
                          { productListItems }
                        </List>
                      </Box>
                    </Collapse>

                    <ListItem button onClick={this.toggleCompanyList}>
                      <ListItemText primary="Company" />
                    </ListItem>
                    <Collapse in={this.state.companyCollapseOpen} timeout="auto" unmountOnExit>
                      <Box pl={3}>
                        <List>
                          { companyListItems }
                        </List>
                      </Box>
                    </Collapse>

                  </List>
                </SwipeableDrawer>
                <div className={classes.grow} />
                <Box>
                  <IconButton component={Link} to="/search" color="inherit">
                    <SearchIcon />
                  </IconButton>
                </Box>
                <Box>
                  <IconButton component={Link} to="/cart" color="inherit">
                    <ShoppingCart />
                  </IconButton>
                </Box>
              </Hidden>
            </Toolbar>
          </AppBar>

          <Container>
            <Box pt={4} pb={4}>
              <Route companyPages={this.state.companyPagesPath} />
            </Box>
          </Container>
        </div>
        </ThemeProvider>
      </Router>
    );
  }
}

export default withStyles(styles)(App)
