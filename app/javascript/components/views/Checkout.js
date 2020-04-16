import React from "react"
import PropTypes from "prop-types"

import { Box, Typography, Stepper, Step, StepLabel, Grid, Hidden, FormControl, Select, Button, CircularProgress } from "@material-ui/core";
import { Paper, Divider, createMuiTheme, ThemeProvider, TextField, InputLabel, MenuItem } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import AddressSection from "./shared/AddressSection";

const stepperTheme = createMuiTheme({
  palette: {
    primary: {
      main: green[500]
    },
  },
})

const addressButtonTheme = createMuiTheme({
  palette: {
    primary: {
      main: green[500]
    },
    secondary: {
      main: red[500]
    },
  },
})

class Checkout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentAddress: null,
      cart: null,
    }
  }

  changeAddress = (add) => {
    this.setState({ currentAddress: add })
  }

  componentDidMount() {
    const cart = localStorage.getItem('cart') == null ? [] : JSON.parse(localStorage.getItem('cart'))
    this.setState({ cart: cart })
  }

  render () {
    return (
      <div>
        <Box mb={4}>
          <Typography variant="h4">Checkout</Typography>
        </Box>
        <Box>
          <Grid container spacing={2}>
            <Grid item md={9} xs={12}>
              <ThemeProvider theme={stepperTheme}>
              <Stepper activeStep={0}>
                <Step key="address"><StepLabel>Address Information</StepLabel></Step>
                <Step key="order"><StepLabel>Review Your Order</StepLabel></Step>
                <Step key="payment"><StepLabel>Payment</StepLabel></Step>
              </Stepper>
              </ThemeProvider>
            </Grid>
          </Grid>
          <Grid container spacing={2} justify="space-between">
            <Grid item md={9} xs={12}>
              <AddressSection addressChange={this.changeAddress} />
            </Grid>
            <Grid item md={3} xs={12}>
              <Paper>
                <Box p={4}>
                {
                  this.state.cart ? (
                    <div>
                      <Typography variant="h6">Items: {this.state.cart.length}</Typography>
                      <Typography variant="body1">Original Total: $10</Typography>
                      <Typography variant="body1">Discount: -$5</Typography>
                      <Divider />
                      <Typography variant="h5">Subtotal: $5</Typography>
                    </div>
                  ) : (
                    <CircularProgress />
                  )
                }
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </div>
    );
  }
}

export default Checkout
