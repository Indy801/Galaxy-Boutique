import React from "react"
import PropTypes from "prop-types"

import { Card, CardContent, Typography, Box, Grid, CircularProgress } from "@material-ui/core"
import { Pagination } from '@material-ui/lab'
import Axios from "axios"
import ProductCard from './shared/ProductCard'

class Products extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      products: null,
      page: 1,
      total_pages: 1,
    }
  }

  componentDidMount() {
    this.fetchProductData(1)
  }

  fetchProductData = (page) => {
    Axios({
      method: "get",
      url: `/api/products?page=${page}`
    }).then(response => {
      this.setState({
        products: response.data.products,
        page: response.data.page,
        total_pages: response.data.total_pages,
      })
    })
  }

  pageChanged = (event, page) => {
    this.setState({ page: page, products: null })
    this.fetchProductData(page)
    window.scrollTo(0, 0)
  }

  render () {
    if (this.state.products == null) {
      return (
        <div>
          <Box>
            <Typography variant="h3">All Products in Galaxy Boutique</Typography>
          </Box>
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
          <Box mt={4}>
            <Pagination count={this.state.total_pages} color="primary" page={this.state.page} onChange={this.pageChanged} />
          </Box>
        </div>
      );
    }
  }
}

export default Products
