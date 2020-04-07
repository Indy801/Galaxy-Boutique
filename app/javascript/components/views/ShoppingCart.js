import React from "react"
import PropTypes from "prop-types"

import Axios from 'axios'
import { Box, Typography, CircularProgress, Card, CardContent, Grid } from "@material-ui/core";

class ShoppingCart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cart: null,
      products: null,
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
    }).then(response => {
      this.setState({ products: response.data.products })
    })
  }

  render () {
    let shoppingCart = <CircularProgress />

    if (this.state.cart != null && this.state.products != null && this.state.cart.length < 1) {
      shoppingCart = <Typography variant="h5">There are no items in your shopping cart.</Typography>
    } else if (this.state.cart != null && this.state.products != null && this.state.cart.length > 0) {
      shoppingCart = this.state.cart.map((item, index) => {
        const product = this.state.products[index]
        const salesPrice = (product.price * (1 - product.discount_percent)).toFixed(2)
        const onSale = product.discount_percent > 0
        const totalPrice = (salesPrice * item.quantity).toFixed(2)
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
                        <Typography variant="body1" className="original-price-cross">${ product.price }</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6">${ salesPrice }</Typography>
                      </Grid>
                    </Grid>
                    )
                  : <Typography variant="h6">${ salesPrice }</Typography>)}
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
        <Box>
          {shoppingCart}
        </Box>
      </div>
    );
  }
}

export default ShoppingCart
