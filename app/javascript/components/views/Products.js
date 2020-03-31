import React from "react"
import PropTypes from "prop-types"

import { Card, CardContent, Typography, Box } from "@material-ui/core"
import Axios from "axios"

class Products extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      products: [],
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
    const productsCards = this.state.products.map(product => {
      return (
        <Box item key={product.id} mt={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body1">${product.price}</Typography>
              <Typography variant="body2">{product.description}</Typography>
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

export default Products
