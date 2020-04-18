import React from "react"
import PropTypes from "prop-types"

import { Card, CardContent, Grid, Box, Divider, Typography, CircularProgress } from '@material-ui/core'

class OrderDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address: null,
      order: null,
    }
  }

  componentDidMount() {
    this.setState({
      address: this.props.address,
      order: this.props.order
    })
  }

  render () {
    const ad = this.state.address
    const order = this.state.order

    let itemCards = <CircularProgress />

    if (order) {
      itemCards = order.map(item => {
        return (
          <Box mt={3} key={item.detail.id}>
          <Card className="order-detail-card">
            <CardContent>
              <Grid container spacing={2}>
                <Grid item md={1} sm={2}>
                  <img src={item.detail.image} alt={item.detail.name} />
                </Grid>
                <Grid item md={11} sm={10}>
                  <Typography variant="h5">{ item.detail.name }</Typography>
                  <Typography variant="body1">Quantity: { item.quantity }</Typography>
                  <Typography variant="body1">${ item.sale_price.toFixed(2) }</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
        )
      })
    }

    return (
      <div>
        <Box mb={2}>
          <Typography variant="h6">Shipping Address</Typography>
          { this.state.address ?
          (<Typography variant="body1">
            {ad.street_no}{ad.apt_no ? " " + ad.apt_no : ""}, {ad.city}, {ad.province.abbr} {ad.postal_code}
          </Typography>) : <CircularProgress />
          }
        </Box>
        <Divider />
        <Box mt={2}>
          <Box mb={2}>
            { itemCards }
          </Box>
        </Box>
      </div>
    );
  }
}

export default OrderDetail
