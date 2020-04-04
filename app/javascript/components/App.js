import React from "react"
import PropTypes from "prop-types"
import { BrowserRouter as Router, Redirect, Link } from 'react-router-dom'
import Route from './Route'
import axios from 'axios'

import { Container, AppBar, Typography, Toolbar, createMuiTheme, ThemeProvider, Box } from '@material-ui/core'
import { Button, Menu, MenuItem, Divider, Hidden, IconButton, SwipeableDrawer } from '@material-ui/core'
import { List, ListItem, ListItemText, Collapse } from '@material-ui/core'
import 'typeface-roboto'
import { grey, indigo } from "@material-ui/core/colors"
import { ExpandMore, Menu as MenuIcon } from "@material-ui/icons"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[800]
    },
    secondary: indigo
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

    return (
      <Router>
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

export default App
