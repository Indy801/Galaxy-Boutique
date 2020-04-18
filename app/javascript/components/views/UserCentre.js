import React from "react"
import PropTypes from "prop-types"

import LoginToken from './shared/LoginToken'
import Axios from 'axios'
import { Container, Box, Typography, CircularProgress, Button, Card, CardContent, Divider, Grid, Collapse, CardActionArea } from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import AddressSection from './shared/AddressSection'
import OrderDetail from './shared/OrderDetail'
import moment from 'moment'

const style = theme => ({
  arrowStyle: {
    position: "absolute",
    right: theme.spacing(2),
    top: "40%",
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  arrowUp: {
    transform: "rotate(180deg)",
  }
})

class UserCentre extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      orders: null,
      orderExpanded: 0,
    }
  }

  componentDidMount() {
    Axios({
      method: "get",
      url: "/api/user/info",
      headers: LoginToken.getHeaderWithToken()
    }).then(response => {
      this.setState({ user: response.data })
    }).catch(error => {
      this.props.history.push("/login")
    })
    Axios({
      method: "get",
      url: "/api/user/orders",
      headers: LoginToken.getHeaderWithToken()
    }).then(response => {
      this.setState({ orders: response.data.orders })
    })
  }

  logout = (event) => {
    Axios({
      method: "delete",
      url: "/api/user/logout",
      headers: LoginToken.getHeaderWithToken()
    }).then(response => {
      LoginToken.saveToken(null)
      if (this.props.history.length > 1) {
        this.props.history.go(-1)
      } else {
        this.props.history.replace("/")
      }
    }).catch(error => {
      console.error("Logout error.")
    })
  }

  displayAmount = (label, amount, variant, negative = false) => {
    return (
      <Grid container justify="space-between">
        <Grid item>
          <Typography variant={variant}>{label}</Typography>
        </Grid>
        <Grid item>
          <Typography variant={variant}>{negative ? "-" : null}${amount.toFixed(2)}</Typography>
        </Grid>
      </Grid>
    )
  }

  expandOrder = (order_num) => (event) => {
    if (this.state.orderExpanded != order_num) {
      this.setState({ orderExpanded: order_num })
    } else {
      this.setState({ orderExpanded: 0 })
    }
  }

  render () {
    const classes = this.props.classes
    let userInfo = <Box mb={4}><CircularProgress /></Box>
    let ordersInfo = <Box><CircularProgress /></Box>

    if (this.state.user != null) {
      userInfo = (
        <Box mb={4}>
          <Typography variant="body1">Email: {this.state.user.email}</Typography>
          <Typography variant="body1">Alias: {this.state.user.alias}</Typography>
        </Box>
      )
    }

    if (this.state.orders != null) {
      ordersInfo = this.state.orders.map(order => {
        return (
          <Box mt={2} key={order.id}>
            <Card>
            <CardActionArea onClick={this.expandOrder(order.id)}>
              <CardContent>
                <Typography variant="h6">{order.order_number}</Typography>
                <Typography variant="body1">Placed on: {moment(order.created_at).format("MMMM D, YYYY [at] h:mm a")}</Typography>
                <Typography variant="body1">Status: {order.status.name}</Typography>
                <Typography variant="body1">Total: ${(order.subtotal + order.gst + order.pst + order.hst).toFixed(2)}</Typography>
                <ExpandMore className={this.state.orderExpanded == order.id ? [classes.arrowStyle, classes.arrowUp].join(" ") : classes.arrowStyle} />
              </CardContent>
              </CardActionArea>
              <Collapse in={this.state.orderExpanded == order.id}>
                <CardContent>
                  <OrderDetail address={order.address} order={order.products} />
                  <Divider />
                  <Box mt={2}>
                    <Grid container>
                      <Grid item sm={5} xs={12}>
                        { this.displayAmount("Subtotal:", order.subtotal, "body1") }
                        { order.gst != null ? this.displayAmount("GST:", order.gst, "body1") : null }
                        { order.pst != null ? this.displayAmount("PST:", order.pst, "body1") : null }
                        { order.hst != null ? this.displayAmount("HST:", order.hst, "body1") : null }
                        { this.displayAmount("Total:", order.total, "h6") }
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Collapse>
            </Card>
          </Box>
        )
      })
    }

    return (
      <div>
        <Container>
          <Box mb={4}><Typography variant="h3">User Centre</Typography></Box>
          { userInfo }
          <Box mb={4}><Button variant="contained" color="primary" onClick={this.logout}>Logout</Button></Box>
          <Box mb={4}>
            <Typography variant="h4">Addresses</Typography>
            <AddressSection disableSelect />
          </Box>
          <Box mb={4}>
            <Typography variant="h4">Orders History</Typography>
            {ordersInfo}
          </Box>
        </Container>
      </div>
    );
  }
}

export default withStyles(style)(UserCentre)
