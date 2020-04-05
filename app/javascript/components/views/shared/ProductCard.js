import React from "react"
import PropTypes from "prop-types"

import { Box, Card, CardContent, Grid, Typography, Button } from '@material-ui/core'
import { green, blue } from '@material-ui/core/colors'
import { ShoppingCartOutlined, List as ListIcon } from '@material-ui/icons'
import { Link } from 'react-router-dom'

class ProductCard extends React.Component {
  render () {
    const product = this.props.product

    return (
      <Box mt={3}>
        <Card className="product-card-img">
          <CardContent>
            <Grid container spacing={2}>
              <Grid item md={3}>
                <img src={product.image} alt={product.name} />
              </Grid>
              <Grid item md={9}>
                <Grid container direction="column" justify="space-between" className="right-column">
                  <Grid item>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body1">${product.price}</Typography>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={2}>
                      <Grid item><Button component={Link} to={`/product/${product.id}`} variant="contained" style={{backgroundColor: blue[500]}} startIcon={<ListIcon/>}>See Details</Button></Grid>
                      <Grid item><Button variant="contained" style={{backgroundColor: green[500]}} startIcon={<ShoppingCartOutlined/>}>Add to Cart</Button></Grid>
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
