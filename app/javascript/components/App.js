import React from "react"
import PropTypes from "prop-types"
import { BrowserRouter as Router, Redirect, Link } from 'react-router-dom'
import Route from './Route'
import axios from 'axios'

import { Container, AppBar, Typography, Toolbar, createMuiTheme, ThemeProvider, Box } from '@material-ui/core'
import { Button, Menu, MenuItem, Divider } from '@material-ui/core'
import 'typeface-roboto'
import { grey, indigo } from "@material-ui/core/colors"
import { ExpandMore } from "@material-ui/icons"

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
    };
  }

  componentDidMount() {
    axios({
      url: "/api/categories",
      method: "get"
    }).then(response => {
      this.setState({categories: response.data})
    })
  }

  onProductNavButtonClick = (event) => {
    this.setState({ productMenuAncher: event.currentTarget })
  }
  onProductMenuClose = () => {
    this.setState({ productMenuAncher: null })
  }

  render () {
    const productMenuItems = this.state.categories.map((item) => {
      return (<MenuItem key={item.id} component={Link} to={`/category/${item.id}`} onClick={this.onProductMenuClose}>{ item.name }</MenuItem>)
    })


    return (
      <Router>
        <ThemeProvider theme={theme}>
        <div>
          <AppBar position="static">
            <Toolbar>
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
            </Toolbar>
          </AppBar>

          <Container>
            <Box pt={4} pb={4}>
              <Route />
            </Box>
          </Container>
        </div>
        </ThemeProvider>
      </Router>
    );
  }
}

export default App
