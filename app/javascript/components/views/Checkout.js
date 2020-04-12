import React from "react"
import PropTypes from "prop-types"

import { Box, Typography, Stepper, Step, StepLabel, Grid, Hidden, FormControl, Select, Button } from "@material-ui/core";
import { Paper, Divider, createMuiTheme, ThemeProvider, TextField, InputLabel, MenuItem } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";

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
              <Box p={2}>
                <Box mb={2}>
                  <Typography variant="h5">New Address</Typography>
                </Box>
                <Box mb={1}>
                  <TextField fullWidth label="Street" />
                </Box>
                <Box mb={1}>
                  <TextField fullWidth label="Apartment" />
                </Box>
                <Box mb={1}>
                  <Grid container spacing={2} >
                    <Grid item sm={4} xs={12}>
                      <TextField fullWidth label="City" />
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <FormControl fullWidth className="category-select">
                        <InputLabel>Province</InputLabel>
                        <Select>
                          <MenuItem value={1}>Manitoba</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <TextField fullWidth label="Postal Code" />
                    </Grid>
                  </Grid>
                </Box>
                <Box>
                  <ThemeProvider theme={addressButtonTheme}>
                  <Grid container spacing={4} justify="space-between">
                    <Grid item><Button variant="contained" color="secondary">Cancel</Button></Grid>
                    <Grid item><Button variant="contained" color="primary">Submit</Button></Grid>
                  </Grid>
                  </ThemeProvider>
                </Box>
              </Box>
            </Grid>
            <Grid item md={3} xs={12}>
              <Paper>
                <Box p={4}>
                  <Typography variant="h6">Items: 1</Typography>
                  <Typography variant="body1">Original Total: $10</Typography>
                  <Typography variant="body1">Discount: -$5</Typography>
                  <Divider />
                  <Typography variant="h5">Subtotal: $5</Typography>
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
