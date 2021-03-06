import React from "react"
import PropTypes from "prop-types"

import { Card, CardContent, Typography, Box, Grid, CircularProgress, Chip, Zoom } from "@material-ui/core"
import { Pagination, ToggleButton } from '@material-ui/lab'
import { Check as CheckIcon, AddCircleOutline } from '@material-ui/icons';
import { green } from "@material-ui/core/colors";
import Axios from "axios"
import ProductCard from './shared/ProductCard'

class Products extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      products: null,
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
    const queryString = this.props.location.search
    const urlParams = new URLSearchParams(queryString);
    let page = urlParams.get("page")
    page = page || 1
    Object.keys(this.state.filters).map((name) => {
      this.state.filters[name] = urlParams.has(name)
    })
    this.fetchProductData(page)
  }

  fetchProductData = (page) => {
    const filterUrl = []
    Object.keys(this.state.filters).map((name, index) => {
       if (this.state.filters[name]) filterUrl.push(name)
    })

    Axios({
      method: "get",
      url: `/api/products?page=${page}&${filterUrl.join("&")}`
    }).then(response => {
      this.setState({
        products: response.data.products,
        page: response.data.page,
        total_pages: response.data.total_pages,
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
      pathname: "/products",
      search: urlParams.toString()
    })
  }

  pageChanged = (event, page) => {
    this.setState({ page: page, products: null })
    this.fetchProductData(page)
    window.scrollTo(0, 0)
    this.changeUrl(page, this.state.filters)
  }

  filterChanged = (filterName) => (event) => {
    const filters = this.state.filters
    filters[filterName] = !filters[filterName]
    this.setState({ filters: filters, page: 1, products: null })
    this.fetchProductData(1)
    this.changeUrl(1, filters)
  }

  render () {
    let productsCards = <Box mt={2} ml={2}><CircularProgress /></Box>
    if (this.state.products != null) {
      productsCards = this.state.products.map(product => {
        return (
          <ProductCard key={product.id} product={product} />
        )
      })
    }

    if (this.state.total_pages == 0) {
      productsCards = <Box mt={2} ml={2}><Typography variant="h6">No products match the filter</Typography></Box>
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
          <Typography variant="h3">All Products in Galaxy Boutique</Typography>
        </Box>
        <Box mt={2} className="product-filter-buttons">
          <Chip label="New" color="primary" clickable onClick={this.filterChanged("new")} icon={newFilterCheck} style={newFilterStyle} />
          <Chip label="Recently Updated" color="primary" clickable onClick={this.filterChanged("ru")} icon={ruFilterCheck} style={ruFilterStyle} />
          <Chip label="On Sale" color="primary" clickable onClick={this.filterChanged("os")} icon={osFilterCheck} style={osFilterStyle} />
        </Box>
        { productsCards }
        <Box mt={4}>
          <Pagination count={this.state.total_pages} color="primary" page={this.state.page} onChange={this.pageChanged} />
        </Box>
      </div>
    );
  }
}

export default Products
