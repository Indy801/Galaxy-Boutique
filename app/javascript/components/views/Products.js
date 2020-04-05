import React from "react"
import PropTypes from "prop-types"

import { Card, CardContent, Typography, Box, Grid, CircularProgress } from "@material-ui/core"
import Axios from "axios"
import ProductCard from './shared/ProductCard'

class Products extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      products: null,
    }
  }

  componentDidMount() {
    Axios({
      method: "get",
      url: "/api/products"
    }).then(response => {
      this.setState({ products: response.data })
    })
  }

  render () {
    if (this.state.products == null) {
      return (
        <div>
          <CircularProgress />
        </div>
      )
    } else {
      const productsCards = this.state.products.map(product => {
        return (
          <ProductCard key={product.id} product={product} />
        )
      })

      return (
        <div>
          <Box>
            <Typography variant="h3">All Products in Galaxy Boutique</Typography>
          </Box>
          { productsCards }
        </div>
      );
    }
  }
}

export default Products
