import React from "react"
import PropTypes from "prop-types"

import Axios from "axios"
import { Box, Typography, Card, Grid, CardContent, CircularProgress, Chip } from "@material-ui/core"
import { Pagination } from "@material-ui/lab"
import { Check as CheckIcon, AddCircleOutline } from "@material-ui/icons";
import { green } from "@material-ui/core/colors";
import ProductCard from './shared/ProductCard'

class Category extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      category: null,
      page: 1,
      total_pages: 1,
      filters: {
        "new": false,
        "ru": false,
        "os": false,
      },
    }
  }

  componentDidMount() {
    const { match: { params } } = this.props
    const urlParams = new URLSearchParams(this.props.location.search)
    const page = urlParams.get("page") || 1
    Object.keys(this.state.filters).map((name) => {
      this.state.filters[name] = urlParams.has(name)
    })
    this.fetchCategory(params.id, page)
  }
  componentDidUpdate(prevProps) {
    let oldId = prevProps.match.params.id
    let newId = this.props.match.params.id
    if (newId !== oldId)
      this.fetchCategory(this.props.match.params.id, 1)
  }

  fetchCategory = (id, page) => {
    const filterUrl = []
    Object.keys(this.state.filters).map((name, index) => {
       if (this.state.filters[name]) filterUrl.push(name)
    })
    Axios({
      method: "get",
      url: `/api/categories/${id}?page=${page}&${filterUrl.join("&")}`
    }).then(response => {
      this.setState({
        category: response.data,
        page: response.data.product_page,
        total_pages: response.data.total_product_page
      })
    })
  }

  fetchProducts = (page) => {
    const filterUrl = []
    Object.keys(this.state.filters).map((name, index) => {
       if (this.state.filters[name]) filterUrl.push(name)
    })
    Axios({
      method: "get",
      url: `/api/categories/${this.state.category.id}?page=${page}&${filterUrl.join("&")}`
    }).then(response => {
      this.setState({
        category: response.data,
        page: response.data.product_page,
        total_pages: response.data.total_product_page
      })
    })
  }

  changeUrl = (page, filters) => {
    const urlParams = new URLSearchParams()
    urlParams.append("page", page)
    Object.keys(filters).map(name => {
      if (filters[name]) urlParams.append(name, 1)
    })
    console.log(urlParams.toString())
    this.props.history.replace({
      pathname: this.props.location.pathname,
      search: urlParams.toString()
    })
  }

  pageChanged = (event, page) => {
    const currentCat = this.state.category
    currentCat.products = null
    this.setState({ category: currentCat })
    this.fetchProducts(page)
    this.changeUrl(page, this.state.filters)
  }

  filterChanged = (filterName) => (event) => {
    const currentCat = this.state.category
    currentCat.products = null
    const filters = this.state.filters
    filters[filterName] = !filters[filterName]
    this.setState({ filters: filters, page: 1, category: currentCat })
    this.fetchProducts(1)
    this.changeUrl(this.state.page, filters)
  }

  render () {
    if (this.state.category == null) {
      return (
        <div>
          <CircularProgress />
        </div>
      )
    } else {
      let productsCards = <Box ml={2}><CircularProgress /></Box>
      if (this.state.category.products != null) {
        productsCards = this.state.category.products.map(product => {
          return (
            <ProductCard key={product.id} product={product} />
          )
        })
      }

      if (this.state.total_pages == 0) {
        productsCards = <Box ml={2}><Typography variant="h6">No products match the filter</Typography></Box>
      }

      const newFilterCheck = this.state.filters["new"] ? <CheckIcon /> : <AddCircleOutline />
      const newFilterStyle = {backgroundColor: (this.state.filters["new"] ? green[500] : null)}

      const ruFilterCheck = this.state.filters["ru"] ? <CheckIcon /> : <AddCircleOutline />
      const ruFilterStyle = {backgroundColor: (this.state.filters["ru"] ? green[500] : null)}

      const osFilterCheck = this.state.filters["os"] ? <CheckIcon /> : <AddCircleOutline />
      const osFilterStyle = {backgroundColor: (this.state.filters["os"] ? green[500] : null)}

      return (
        <div>
          <Box>
            <Typography variant="h3">{ this.state.category.name }</Typography>
            <Typography variant="body1">{ this.state.category.description }</Typography>
          </Box>
          <Box mt={2} className="product-filter-buttons">
            <Chip label="New" color="primary" clickable onClick={this.filterChanged("new")} icon={newFilterCheck} style={newFilterStyle} />
            <Chip label="Recently Updated" color="primary" clickable onClick={this.filterChanged("ru")} icon={ruFilterCheck} style={ruFilterStyle} />
            <Chip label="On Sale" color="primary" clickable onClick={this.filterChanged("os")} icon={osFilterCheck} style={osFilterStyle} />
          </Box>
          <Box mt={3}>
            { productsCards }
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
