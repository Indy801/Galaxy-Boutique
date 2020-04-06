import React from "react"
import PropTypes from "prop-types"

import { Box, Card, CardContent, Grid, Typography, Button, Chip } from '@material-ui/core'
import { green, blue, lightBlue, red, pink } from '@material-ui/core/colors'
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { ShoppingCartOutlined, List as ListIcon } from '@material-ui/icons'
import { Link } from 'react-router-dom'

class ProductCard extends React.Component {
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
                      <Grid item><Button variant="contained" style={{backgroundColor: green[400]}} startIcon={<ShoppingCartOutlined/>}>Add to Cart</Button></Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  }
}

export default ProductCard
