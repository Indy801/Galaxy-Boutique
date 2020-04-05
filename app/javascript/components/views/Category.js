import React from "react"
import PropTypes from "prop-types"

import Axios from "axios"
import { Box, Typography, Card, Grid, CardContent, CircularProgress } from "@material-ui/core"
import { Pagination } from "@material-ui/lab"
import ProductCard from './shared/ProductCard'

class Category extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      category: null,
      page: 1,
      total_pages: 1,
    }
  }

  componentDidMount() {
    const { match: { params } } = this.props
    this.fetchCategory(params)
  }
  componentDidUpdate(prevProps) {
    let oldId = prevProps.match.params.id
    let newId = this.props.match.params.id
    if (newId !== oldId)
      this.fetchCategory(this.props.match.params)
  }

  fetchCategory = (params) => {
    Axios({
      method: "get",
      url: `/api/categories/${params.id}?page=1`
    }).then(response => {
      this.setState({
        category: response.data,
        page: response.data.product_page,
        total_pages: response.data.total_product_page
      })
    })
  }

  pageChanged = (event, page) => {
    const currentCat = this.state.category
    currentCat.products = null
    this.setState({ category: currentCat })

    Axios({
      method: "get",
      url: `/api/categories/${currentCat.id}?page=${page}`
    }).then(response => {
      this.setState({
        category: response.data,
        page: response.data.product_page,
        total_pages: response.data.total_product_page
      })
    })
  }

  render () {
    if (this.state.category == null) {
      // Loading
      return (
        <div>
          <CircularProgress />
        </div>
      )
    } else if (this.state.category.products == null) {
      return (
        <div>
          <Box mb={3}>
            <Typography variant="h3">{ this.state.category.name }</Typography>
            <Typography variant="body1">{ this.state.category.description }</Typography>
          </Box>
          <CircularProgress />
        </div>
      )
    } else {

      // Not loading
      const productCards = this.state.category.products.map(product => {
        return (
          <ProductCard key={product.id} product={product} />
        )
      })

      return (
        <div>
          <Box>
            <Typography variant="h3">{ this.state.category.name }</Typography>
            <Typography variant="body1">{ this.state.category.description }</Typography>
          </Box>
          <Box mt={3}>
            { productCards }
          </Box>
          <Box mt={4}>
            <Pagination count={this.state.total_pages} color="primary" page={this.state.page} onChange={this.pageChanged} />
          </Box>
        </div>
      );
    }
  }
}

export default Category
