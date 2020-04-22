import React from "react"
import PropTypes from "prop-types"

import Axios from 'axios'
import { Box, Typography, CircularProgress, Card, CardContent, Grid, TextField, Divider } from "@material-ui/core";
import { IconButton, Snackbar, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Delete as DeleteIcon, Payment as PaymentIcon } from "@material-ui/icons";
import { Link } from 'react-router-dom'
import accounting from 'accounting'

class ShoppingCart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cart: null,
      products: null,
      deleteItemAlert: false,
      deletedItemName: "",
      undoCartList: null,
    }
  }

  componentDidMount() {
    const cart = localStorage.getItem('cart') == null ? [] : JSON.parse(localStorage.getItem('cart'))
    this.fetchProducts(cart)
  }

  onItemDeleteClick = (item) => (event) => {
    const ix = this.state.cart.indexOf(item)
    const orgCart = this.state.cart.slice()
    console.log(ix)
    this.state.cart.splice(ix, 1)
    this.saveItemsToStorage(this.state.cart)
    this.fetchProducts(this.state.cart)
    this.setState({ deleteItemAlert: true, deletedItemName: item.name, undoCartList: orgCart })
  }

  onCartDeleteAlertClose = (event, reason) => {
    if (reason == "timeout") {
      this.setState({ deleteItemAlert: false })
    }
  }

  saveItemsToStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }

  undoDelete = (event) => {
    const orgCart = this.state.undoCartList
    this.saveItemsToStorage(orgCart)
    this.fetchProducts(orgCart)
    this.setState({ undoCartList: null, deleteItemAlert: false })
  }

  onQuantityChange = (item) => (event) => {
    if (event.target.value !== "") {
      item.quantity = parseInt(event.target.value)
      this.setState({ cart: this.state.cart })
      this.saveItemsToStorage(this.state.cart)
    }
  }

  fetchProducts = (cart) => {
    if (cart.length > 0) {
      Axios({
        method: "get",
        url: "/api/shopping_cart",
        params: {
          id: cart.map(item => item.id)
        }
      }).then(response => {
        this.setState({ products: response.data.products })
        this.setState({ cart: cart })
      })
    } else {
      this.setState({ products: [], cart: cart })
    }
  }

  render () {
    let subtotal = 0;
    let shoppingCart = <CircularProgress />
    const noCheckout = this.state.cart == null || this.state.cart.length < 1

    if (this.state.cart != null && this.state.products != null && this.state.cart.length < 1) {
      shoppingCart = <Typography variant="h5">There are no items in your shopping cart.</Typography>
    } else if (this.state.cart != null && this.state.products != null && this.state.cart.length > 0) {
      shoppingCart = this.state.cart.map((item, index) => {
        const product = this.state.products[index]
        const salesPrice = product.discount_price || product.price
        const onSale = product.discount_price != null
        const totalPrice = (salesPrice * item.quantity).toFixed(2)
        subtotal += parseFloat(totalPrice)
        return (
        <Box mt={3} key={item.id}>
          <Card className="shopping-cart-card">
            <CardContent>
              <Grid container spacing={2}>
                <Grid item sm={2}>
                  <img src={product.image} alt={product.name} />
                </Grid>
                <Grid item sm={10}>
                  <Typography variant="h5">{ product.name }</Typography>
                  {( onSale ? (
                    <Grid container spacing={1}>
                      <Grid item>
                        <Typography variant="body1" className="original-price-cross">{ accounting.formatMoney(product.price) }</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6">{ accounting.formatMoney(salesPrice) }</Typography>
                      </Grid>
                    </Grid>
                    )
                  : <Typography variant="h6">{ accounting.formatMoney(salesPrice) }</Typography>)}
                  <Box mt={2}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <TextField label="Quantity" type="number" variant="outlined" size="small" style={{width: "70px"}}
                                  value={item.quantity} onChange={this.onQuantityChange(item)}
                                  inputProps={{ min: "1", step: "1" }}
                                  />
                      </Grid>
                      <Grid item>
                        <IconButton onClick={this.onItemDeleteClick(item)}><DeleteIcon /></IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box>
                    <Typography variant="body1">{ accounting.formatMoney(totalPrice) }</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )})
    }


    return (
      <div>
        <Box mb={4}>
          <Typography variant="h4">Your Shopping Cart</Typography>
        </Box>
        <Box mb={5}>
          {shoppingCart}
        </Box>
        <Divider />
        <Box mt={5}>
          <Grid container spacing={2} justify="space-between">
            <Grid item>
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item><Typography variant="h5">Subtotal: </Typography></Grid>
                <Grid item><Typography variant="h4">{ accounting.formatMoney(subtotal) }</Typography></Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Button color="primary" size="large" variant="contained" disabled={noCheckout}
              component={Link}
              to="/cart/checkout"
              startIcon={<PaymentIcon />}>Checkout</Button>
            </Grid>
          </Grid>
        </Box>
        <Snackbar open={this.state.deleteItemAlert} autoHideDuration={10000} onClose={this.onCartDeleteAlertClose}>
          <Alert elevation={6} variant="filled" severity="error" action={<Button color="primary" size="small" onClick={this.undoDelete}>Undo</Button>}>
            Deleted { this.state.deletedItemName } from cart.
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

export default ShoppingCart
