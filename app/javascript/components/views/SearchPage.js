import React from "react"
import PropTypes from "prop-types"

import { Box, TextField, FormControl, MenuItem, Select, InputLabel, Grid, CircularProgress, Typography } from "@material-ui/core"
import Axios from 'axios'
import ProductCard from './shared/ProductCard'

class SearchPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      categories: null,
      products: null,
      categoryValue: 0,
      searchKeyword: "",
    }
    this.searchBar = React.createRef()
    this.searchTimeOut = 0
    this.onSearchKeywordChange = this.onSearchKeywordChange.bind(this)
  }

  componentDidMount() {
    this.fetchProducts("", 0)

    Axios({
      url: "/api/categories",
      method: "get"
    }).then(response => {
      this.setState({categories: response.data})
    })
  }

  onCategoryChange = (event) => {
    // this.setState({ categoryValue: event.target.value })
    this.fetchProducts(this.state.searchKeyword, event.target.value)
  }

  onSearchKeywordChange = (event) => {
    const searchText = event.target.value
    this.setState({ products: null, searchKeyword: searchText })
    if (this.searchTimeOut) clearTimeout(this.searchTimeOut)
    this.searchTimeOut = setTimeout(() => {
      this.fetchProducts(searchText, this.state.categoryValue)
    }, 500)
  }

  fetchProducts = (q, cat) => {
    this.setState({
      searchKeyword: q,
      categoryValue: cat,
    })

    Axios({
      method: "get",
      url: "/api/search",
      params: {
        q: q,
        c: cat,
      }
    }).then(response => {
      this.setState({
        products: response.data.results,
      })
    })
  }

  render () {
    let productsCards = (<Box><CircularProgress /></Box>)
    let categoryItems = null

    if (this.state.categories != null) {
      categoryItems = this.state.categories.map(item =>
        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
      )
    }

    if (this.state.products != null) {
      productsCards = this.state.products.map(item =>
        <ProductCard key={item.id} product={item} />
      )
    }

    if (this.state.products != null && this.state.products.length == 0) {
      productsCards = <Box><Typography variant="h5">No result matches "{this.state.searchKeyword}"</Typography></Box>
    }

    return (
      <div className="search-page">
        <Box mb={4}>
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <FormControl className="category-select">
                <InputLabel>Category</InputLabel>
                <Select
                  value={this.state.categoryValue}
                  onChange={this.onCategoryChange}
                >
                  <MenuItem value={0}>
                    All
                  </MenuItem>
                  { categoryItems }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={9}>
              <TextField fullWidth label="Search" ref={this.searchBar} value={this.state.searchKeyword} onChange={this.onSearchKeywordChange} />
            </Grid>
          </Grid>
        </Box>
        <Box>
          { productsCards }
        </Box>
      </div>
    );
  }
}

export default SearchPage
