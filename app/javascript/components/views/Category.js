import React from "react"
import PropTypes from "prop-types"

import Axios from "axios"
import { Box, Typography, Card, Grid, CardContent, CircularProgress } from "@material-ui/core"

class Category extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      category: null,
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
      url: `/api/categories/${params.id}`
    }).then(response => {
      this.setState({ category: response.data })
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
    } else {

      // Not loading
      const productCards = this.state.category.products.map(product => {
        return (
          <Box key={product.id} mt={3}>
            <Card className="product-card-img">
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item md={3}>
                    <img src={product.image} alt={product.name} />
                  </Grid>
                  <Grid item md={9}>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body1">${product.price}</Typography>
                    <Typography variant="body2">{product.description}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
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
        </div>
      );
    }
  }
}

export default Category
