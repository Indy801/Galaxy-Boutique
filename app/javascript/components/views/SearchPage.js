import React from "react"
import PropTypes from "prop-types"

import { Box, TextField, FormControl, MenuItem, Select, InputLabel, Grid, CircularProgress, Typography } from "@material-ui/core"
import { Pagination } from "@material-ui/lab";
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
      page: 1,
      total_pages: 1,
    }
    this.searchBar = React.createRef()
    this.searchTimeOut = 0
    this.onSearchKeywordChange = this.onSearchKeywordChange.bind(this)
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(this.props.location.search)
    const urlQ = urlParams.get("q") || ""
    const urlC = urlParams.get("c") || 0
    const urlP = urlParams.get("page") || 1
    this.searchBar.focus()

    Axios({
      url: "/api/categories",
      method: "get"
    }).then(response => {
      this.setState({categories: response.data})
      this.fetchProducts(urlQ, urlC, urlP)
    })
  }

  // componentDidUpdate(prevProps) {
  //   const urlParamsP = new URLSearchParams(prevProps.location.search)
  //   const urlParamsN = new URLSearchParams(this.props.location.search)
  //   if (urlParamsP.get("q") != urlParamsN.get("q")) {
  //     this.setState({ total_pages: 0, products: null })
  //     this.fetchProducts(urlParamsN.get("q"), this.state.categoryValue, 1)
  //   }
  // }

  onCategoryChange = (event) => {
    // this.setState({ categoryValue: event.target.value })
    this.setState({ total_pages: 0, products: null })
    this.fetchProducts(this.state.searchKeyword, event.target.value, 1)
    // this.changeUrl(this.state.searchKeyword, event.target.value, 1)
  }

  onSearchKeywordChange = (event) => {
    const searchText = event.target.value
    this.setState({ products: null, searchKeyword: searchText, total_pages: 0 })

    if (this.searchTimeOut) clearTimeout(this.searchTimeOut)
    this.searchTimeOut = setTimeout(() => {
      this.fetchProducts(searchText, this.state.categoryValue, 1)
      // this.changeUrl(searchText, this.state.categoryValue, 1)
    }, 500)
  }

  pageChanged = (event, page) => {
    this.fetchProducts(this.state.searchKeyword, this.state.categoryValue, page)
    // this.changeUrl(this.state.searchKeyword, this.state.categoryValue, page)
    window.scrollTo(0, 0)
  }

  changeUrl = (q, c, page) => {
    const urlParams = new URLSearchParams()
    urlParams.append("q", q)
    urlParams.append("c", c)
    urlParams.append("page", page)
    console.log(urlParams.toString())
    this.props.history.replace({
      pathname: "/search",
      search: urlParams.toString()
    })
  }

  fetchProducts = (q, cat, page) => {
    this.setState({
      searchKeyword: q,
      categoryValue: cat,
    })
    this.changeUrl(q, cat, page)

    Axios({
      method: "get",
      url: "/api/search",
      params: {
        q: q,
        c: cat,
        page: page,
      }
    }).then(response => {
      this.setState({
        products: response.data.results,
        page: response.data.page,
        total_pages: response.data.total_pages
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
              <TextField fullWidth label="Search" inputRef={input => this.searchBar = input} value={this.state.searchKeyword} onChange={this.onSearchKeywordChange} />
            </Grid>
          </Grid>
        </Box>
        <Box>
          { productsCards }
        </Box>
        <Box mt={4}>
          <Pagination count={this.state.total_pages} color="primary" page={this.state.page} onChange={this.pageChanged} />
        </Box>
      </div>
    );
  }
}

export default SearchPage
