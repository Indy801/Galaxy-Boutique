import React from "react"
import PropTypes from "prop-types"

import { Box, Card, CardContent, Grid, Typography, Button, Chip, Snackbar } from '@material-ui/core'
import { green, blue, lightBlue, red, pink } from '@material-ui/core/colors'
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import { ShoppingCartOutlined, List as ListIcon } from '@material-ui/icons'
import { Alert } from "@material-ui/lab"
import { Link } from 'react-router-dom'

class ProductCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showAddItemAlert: false,
    }
  }

  addToCart = (id, name) => (event) => {
    let cart = localStorage.getItem('cart') == null ? [] : JSON.parse(localStorage.getItem('cart'))
    const item = cart.find(i => i.id == id)
    if (item == undefined) {
      cart.push({id: id, name: name, quantity: 1})
    } else {
      item.quantity += 1
    }
    console.log(JSON.stringify(cart))
    localStorage.setItem('cart', JSON.stringify(cart))
    this.setState({ showAddItemAlert: true })
  }

  onAddItemAlertClose = () => {
    this.setState({ showAddItemAlert: false })
  }

  render () {
    const product = this.props.product
    const salePrice = (product.price * (1 - product.discount_percent)).toFixed(2)

    const saleStyle = createMuiTheme({
      palette: {
        primary: {
          main: pink[500]
        }
      }
    })

    const priceText = (product.discount_percent <= 0) ? (<Typography variant="h5">${product.price}</Typography>) : (
      <ThemeProvider theme={saleStyle}>
        <Typography variant="h5" className="original-price-cross">${product.price}</Typography>
        <Typography variant="h4">${salePrice}</Typography>
        <Chip label={`${(product.discount_percent * 100).toFixed(0)}% off`} color="primary" />
      </ThemeProvider>
    )



    return (
      <Box mt={3}>
        <Card className="product-card-img">
          <CardContent>
            <Grid container spacing={2}>
              <Grid item md={3}>
                <img src={product.image} alt={product.name} />
              </Grid>
              <Grid item md={9}>
                <Grid container spacing={3} direction="column" justify="space-between" className="right-column">
                  <Grid item>
                    <Typography variant="h6">{product.name}</Typography>
                    { priceText }
                  </Grid>
                  <Grid item>
                    <Grid container spacing={2}>
                      <Grid item><Button component={Link} to={`/product/${product.id}`} variant="contained" style={{backgroundColor: lightBlue[300]}} startIcon={<ListIcon/>}>See Details</Button></Grid>
                      <Grid item><Button variant="contained" style={{backgroundColor: green[400]}} startIcon={<ShoppingCartOutlined/>} onClick={this.addToCart(product.id, product.name)}>Add to Cart</Button></Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Snackbar open={this.state.showAddItemAlert} autoHideDuration={7000} onClose={this.onAddItemAlertClose}>
          <Alert elevation={6} variant="filled" onClose={this.onAddItemAlertClose} severity="success">
            Added { product.name } to the cart.
          </Alert>
        </Snackbar>
      </Box>
    );
  }
}

export default ProductCard
