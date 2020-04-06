import React from "react"
import PropTypes from "prop-types"

import Axios from 'axios'
import { CircularProgress, Typography, Grid, Paper, Box, Divider, Chip } from '@material-ui/core'
import { Button, Link, TextField } from '@material-ui/core'
import { ShoppingCartOutlined } from '@material-ui/icons'
import { green, blue, pink } from '@material-ui/core/colors'
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Link as RouterLink } from 'react-router-dom'
import moment from 'moment'

class ProductDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      product: null,
      quantity: 1,
    }
  }

  componentDidMount() {
    const { match: { params } } = this.props

    Axios({
      method: "get",
      url: `/api/products/${params.id}`
    }).then(response => {
      this.setState({ product: response.data })
    })
  }

  quantityChanged = (event) => {
    if (event.target.value !== "") {
      this.setState({ quantity: event.target.value })
    }
  }

  render () {
    if (this.state.product == null) {
      return (
        <div>
          <CircularProgress />
        </div>
      )
    }

    const product = this.state.product
    const saleStyle = createMuiTheme({
      palette: {
        primary: {
          main: pink[500]
        }
      }
    })

    const salePrice = (product.price * (1 - product.discount_percent)).toFixed(2)
    const priceText = (product.discount_percent <= 0) ? (<Typography variant="h4">${product.price}</Typography>) : (
      <ThemeProvider theme={saleStyle}>
        <Typography variant="h5" className="original-price-cross">${product.price}</Typography>
        <Typography variant="h4">${salePrice}</Typography>
        <Chip label={`${(product.discount_percent * 100).toFixed(0)}% off`} color="primary" />
      </ThemeProvider>
    )

    return (
      <div className="product-detail-page">
        <Box mb={5}>
          <Typography variant="h4">{ product.name }</Typography>
          <Typography variant="body1">Category: <Link component={RouterLink} to={`/category/${product.category.id}`} style={{color: blue[500]}}>{ product.category.name }</Link></Typography>
        </Box>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <img src={product.image} alt={product.name} />
          </Grid>
          <Grid item>
            <Paper className="price-action-tab">
              <Box p={4} className="price-action-box">

                <Grid container spacing={4} justify="space-between" direction="column" className="price-action-grid">
                  <Grid item>
                    <Box mb={2}>
                      <Typography variant="h6">Price:</Typography>
                      { priceText }
                    </Box>
                    <Divider />
                    <Box mt={2}>
                      <Typography variant="body2" color="textSecondary">Listed { moment(product.created_at).fromNow() }</Typography>
                      <Typography variant="body2" color="textSecondary">Last updated { moment(product.updated_at).fromNow() }</Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={1} direction="column">
                      <Grid item><TextField label="Quantity" type="number" variant="outlined" style={{width: "100px"}}
                                  value={this.state.quantity} onChange={this.quantityChanged}
                                  inputProps={{ min: "1", step: "1" }}
                                  /></Grid>
                      <Grid item><Button variant="contained" style={{backgroundColor: green[500]}} startIcon={<ShoppingCartOutlined/>}>Add to Cart</Button></Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="h5">Description</Typography>
          <Typography variant="body1">{product.description}</Typography>
        </Box>
      </div>
    )
  }
}

export default ProductDetail
