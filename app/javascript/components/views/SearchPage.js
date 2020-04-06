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
  }

  componentDidMount() {
    this.fetchProducts("")
  }

  onCategoryChange = (event) => {
    this.setState({ categoryValue: event.target.value })
  }

  onSearchKeywordChange = (event) => {
    this.setState({ products: null })
    this.fetchProducts(event.target.value)
  }

  fetchProducts = (q) => {
    Axios({
      method: "get",
      url: "/api/search",
      params: {
        q: q
      }
    }).then(response => {
      this.setState({
        products: response.data.results,
        searchKeyword: q,
      })
    })
  }

  render () {
    let productsCards = (<Box><CircularProgress /></Box>)

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
                  <MenuItem value={1}>Ten</MenuItem>
                  <MenuItem value={2}>Twenty</MenuItem>
                  <MenuItem value={3}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={9}>
              <TextField fullWidth label="Search" onChange={this.onSearchKeywordChange} />
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
