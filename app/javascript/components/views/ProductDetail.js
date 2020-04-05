import React from "react"
import PropTypes from "prop-types"

import Axios from 'axios'
import { CircularProgress, Typography, Grid, Paper, Box, Divider } from '@material-ui/core'
import { Button } from '@material-ui/core'
import { ShoppingCartOutlined } from '@material-ui/icons'
import { green } from '@material-ui/core/colors'

class ProductDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      product: null,
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

  render () {
    if (this.state.product == null) {
      return (
        <div>
          <CircularProgress />
        </div>
      )
    }

    const product = this.state.product
    return (
      <div className="product-detail-page">
        <Box mb={5}>
          <Typography variant="h4">{ product.name }</Typography>
        </Box>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <img src={product.image} alt={product.name} />
          </Grid>
          <Grid item>
            <Paper className="price-action-tab">
              <Box p={4} className="price-action-box">
                <Grid container justify="space-between" direction="column" className="price-action-grid">
                  <Grid item>
                    <Box mb={2}>
                      <Typography variant="h4">${ product.price }</Typography>
                    </Box>
                    <Divider />
                    <Box mt={2}>
                      <Typography variant="body2" color="textSecondary">Listed on { product.created_at }</Typography>
                      <Typography variant="body2" color="textSecondary">Last Updated on { product.updated_at }</Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" style={{backgroundColor: green[500]}} startIcon={<ShoppingCartOutlined/>}>Add to Cart</Button>
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
