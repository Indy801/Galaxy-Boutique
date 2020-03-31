import React from "react"
import PropTypes from "prop-types"

import { Card, CardContent, Typography, Box, Grid, CircularProgress } from "@material-ui/core"
import Axios from "axios"

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
            <Typography variant="h3">All Products in Galaxy Boutique</Typography>
          </Box>
          { productsCards }
        </div>
      );
    }
  }
}

export default Products
