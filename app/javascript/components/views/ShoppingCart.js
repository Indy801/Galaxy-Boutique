import React from "react"
import PropTypes from "prop-types"

import Axios from 'axios'
import { Box, Typography, CircularProgress, Card } from "@material-ui/core";

class ShoppingCart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cart: null,
    }
  }

  componentDidMount() {
    const cart = localStorage.getItem('cart') == null ? [] : JSON.parse(localStorage.getItem('cart'))
    this.setState({ cart: cart })

    Axios({
      method: "get",
      url: "/api/shopping_cart",
      params: {
        id: cart.map(item => item.id)
      }
    })
  }

  render () {
    let shoppingCart = <CircularProgress />

    if (this.state.cart != null && this.state.cart.length < 1) {
      shoppingCart = <Typography variant="h5">There are no items in your shopping cart.</Typography>
    } else if (this.state.cart != null && this.state.cart.length > 0) {
      shoppingCart = this.state.cart.map(item => (
        <Box mt={3} key={item.id}>
          <Card>
            <Typography variant="h5">{item.name}</Typography>
            <Typography variant="h5">quantity: {item.quantity}</Typography>
          </Card>
        </Box>
      ))
    }


    return (
      <div>
        <Box mb={4}>
          <Typography variant="h4">Your Shopping Cart</Typography>
        </Box>
        <Box>
          {shoppingCart}
        </Box>
      </div>
    );
  }
}

export default ShoppingCart
