import React from "react"
import PropTypes from "prop-types"

import Axios from 'axios'
import LoginToken from './shared/LoginToken'
import { Box, Typography, Stepper, Step, StepLabel, Grid, Hidden, FormControl, Select, Button, CircularProgress, CardContent } from "@material-ui/core";
import { Paper, Divider, createMuiTheme, ThemeProvider, TextField, InputLabel, MenuItem, Card } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import { Receipt, MonetizationOn, ArrowBack, CheckCircle, Payment, QueryBuilder } from "@material-ui/icons";
import AddressSection from "./shared/AddressSection";
import OrderDetail from './shared/OrderDetail'

import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, ElementsConsumer } from "@stripe/react-stripe-js"

const stepperTheme = createMuiTheme({
  palette: {
    primary: {
      main: green[500]
    },
  },
})

const backButtonTheme = createMuiTheme({
  palette: {
    primary: {
      main: red[500]
    },
  },
})

class Checkout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentAddress: {},
      cart: null,
      order: null,
      curStep: 0,
      placingOrder: false,
      stripePromise: loadStripe('pk_test_gxH1mVNQS3MsZy7ndigb9bbk00zOlXJaLU'),
      user: null,
      payButtonDisable: false,
      placeSuccess: false,
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

    if (this.props.match.params.id) {
      Axios({
        method: "get",
        url: `/api/checkout/show/${this.props.match.params.id}`,
        headers: LoginToken.getHeaderWithToken()
      }).then(res => {
        if (res.data.status.id == 1) {
          this.setState({ placingOrder: false, curStep: 1, order: res.data, currentAddress: res.data.address })
        } else {
          this.props.history.replace("/404")
        }
      }).catch(err => {
        this.setState({ placingOrder: false })
        if (err.response.status == 404) this.props.history.replace("/404")
      })
    } else {
      const cart = localStorage.getItem('cart') == null ? [] : JSON.parse(localStorage.getItem('cart'))
      this.setState({ cart: cart })
      this.getPreviewOrder(cart, null)
    }
  }

  getPreviewOrder = async (cart, address) => {
    return Axios({
      method: "post",
      url: "/api/checkout/preview",
      data: { cart: cart, address: (address ? address.id : null) },
      headers: LoginToken.getHeaderWithToken()
    }).then(res => {
      this.setState({ order: res.data })
    }).catch(err => {
      if (err.response.status == 401) {
        this.props.history.push("/login")
      }
    })
  }

  changeAddress = (add) => {
    this.setState({ currentAddress: add })
  }

  reviewOrderClick = (event) => {
    this.getPreviewOrder(this.state.cart, this.state.currentAddress).then(() => {
      this.setState({ curStep: 1 })
    })
  }

  backButtonClick = (event) => {
    this.getPreviewOrder(this.state.cart, null).then(() => {
      this.setState({ curStep: 0 })
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

  placeOrderClick = (event) => {
    if (!this.state.order.id) {
      this.setState({ placingOrder: true })
      Axios({
        method: "post",
        url: "/api/checkout/place",
        data: { cart: this.state.cart, address: this.state.currentAddress.id },
        headers: LoginToken.getHeaderWithToken()
      }).then(res => {
        localStorage.setItem('cart', JSON.stringify([]))
        this.setState({ placingOrder: false, curStep: 2, order: res.data, placeSuccess: true })
      }).catch(err => {
        this.setState({ placingOrder: false })
      })
    } else {
      this.setState({ placingOrder: false, curStep: 2})
    }
  }

  payLater = (event) => {
    this.props.history.replace("/")
  }

  payNow = async (event) => {
    if (this.stripeElement && this.stripeObj) {
      this.payToStripe()
    }
    // console.log(this.stripeElement)
    // console.log(this.stripeObj)
  }

  getPaymentIntent = async (order) => {
    this.setState({ payButtonDisable: true })
    const res = await Axios({
      method: "get",
      url: `/api/checkout/pay/${order.id}`,
      headers: LoginToken.getHeaderWithToken()
    })
    // }).then(res => {
    //   this.paymentIntent = res.data.client_secret
    //   this.setState({ payButtonDisable: false })
    // })
    this.paymentIntent = res.data.client_secret
    // this.setState({ payButtonDisable: false })
  }

  payToStripe = async () => {
    this.setState({ payButtonDisable: true })
    if (!this.paymentIntent) {
      await this.getPaymentIntent(this.state.order)
    }
    const cardElement = this.stripeElement.getElement(CardElement);
    const stripe = this.stripeObj
    const result = await stripe.confirmCardPayment(this.paymentIntent, {
      payment_method: {
        type: "card",
        card: cardElement,
        billing_details: {
          email: this.state.user.email,
        }
      }
    })

    if (result.error) {
      console.log(result.error.message)
      this.setState({ payButtonDisable: false })
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        console.log("Payment success")
        await Axios({
          method: "post",
          url: "/api/checkout/mark_paid",
          data: {order_id: this.state.order.id, stripe_id: result.paymentIntent.id},
          headers: LoginToken.getHeaderWithToken()
        })

        this.props.history.replace({
          pathname: "/cart/success",
          state: { status: "success" }
        })
      }
    }
  }

  render () {
    let nextButton;
    let stepSection;
    switch (this.state.curStep) {
      case 0:
        stepSection = <AddressSection addressChange={this.changeAddress} />
        nextButton = (<Button variant="contained" color="primary" disabled={!this.state.currentAddress.id}
          onClick={this.reviewOrderClick}
          startIcon={<Receipt />}
        >Review Your Order</Button>)
        break;
      case 1:
        stepSection = (
          <React.Fragment>
            <OrderDetail address={this.state.currentAddress} order={this.state.order.products} />
            <ThemeProvider theme={backButtonTheme}><Button variant="contained" color="primary" startIcon={<ArrowBack/>}
            onClick={this.backButtonClick} disabled={this.state.placingOrder || Boolean(this.state.order.id)}>Back</Button></ThemeProvider>
          </React.Fragment>
        )
        nextButton = <Button variant="contained" color="primary" startIcon={<MonetizationOn/>}
        disabled={this.state.placingOrder} onClick={this.placeOrderClick}>{this.state.order.id ? "Make a Payment" : "Place Order"}</Button>
        break;
      case 2:
        const CARD_ELEMENT_OPTIONS = {
          style: {
            base: {
              color: "#32325d",
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: "antialiased",
              fontSize: "24px",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#fa755a",
              iconColor: "#fa755a",
            },
          },
        };
        stepSection = (
            <React.Fragment>
              { this.state.placeSuccess ? (
              <Box my={2}>
                <Grid container alignContent="center">
                  <Grid item><CheckCircle style={{color: green[500]}} /></Grid>
                  <Grid item><Typography variant="h6">Order successfully placed!</Typography></Grid>
                </Grid>
              </Box>
              ) : null }
              <Box m={5}>
                <Typography variant="h6">Payment Information</Typography>
                <Box mt={1}>
                  <Elements stripe={this.state.stripePromise}>
                    <ElementsConsumer>
                      {({elements, stripe}) => {
                        this.stripeElement = elements
                        this.stripeObj = stripe
                        return (<CardElement options={CARD_ELEMENT_OPTIONS} />)
                      }}
                    </ElementsConsumer>
                  </Elements>
                </Box>
                <Typography variant="body2">Powered by Stripe</Typography>
              </Box>
              <Divider />
              <Box mt={2}>
                <Grid container justify="space-between">
                  <Grid item xs={5}></Grid>
                  <Grid item><Button variant="contained" color="primary" startIcon={<QueryBuilder />} onClick={this.payLater} disabled>Pay Later</Button></Grid>
                  <Grid item xs={5}></Grid>
                </Grid>
              </Box>
            </React.Fragment>
        )
        nextButton = <Button variant="contained" color="primary" startIcon={<Payment/>} onClick={this.payNow} disabled={this.state.payButtonDisable}>Pay Now</Button>
        break;
    }



    return (
      <div>
        <Box mb={4}>
          <Typography variant="h4">Checkout</Typography>
        </Box>
        <Box>
          <Grid container spacing={2}>
            <Grid item md={9} xs={12}>
              <ThemeProvider theme={stepperTheme}>
              <Stepper activeStep={this.state.curStep}>
                <Step key="address"><StepLabel>Address Information</StepLabel></Step>
                <Step key="order"><StepLabel>Review Your Order</StepLabel></Step>
                <Step key="payment"><StepLabel>Payment</StepLabel></Step>
              </Stepper>
              </ThemeProvider>
            </Grid>
          </Grid>
          <Grid container spacing={2} justify="space-between">
            <Grid item md={9} xs={12}>
              {stepSection}
            </Grid>
            <Grid item md={3} xs={12}>
              <Paper>
                <Box p={4}>
                {
                  this.state.order ? (
                    <div>
                      <Box mb={1}>
                        <Typography variant="h6">Items: {this.state.order.products.length}</Typography>
                        {this.displayAmount("Original Total:", this.state.order.original_total, "body1")}
                        {this.displayAmount("Discount:", this.state.order.discount_total, "body1", true)}
                      </Box>
                      <Divider />
                      <Box mt={1}>
                        {this.displayAmount("Subtotal:", this.state.order.subtotal, "h6")}
                      </Box>
                      { this.state.order.total ?
                        (
                          <React.Fragment>
                          <Box mt={1} mb={1}>
                            { this.state.order.gst != null ? this.displayAmount("GST:", this.state.order.gst, "body1") : null }
                            { this.state.order.pst != null ? this.displayAmount("PST:", this.state.order.pst, "body1") : null }
                            { this.state.order.hst != null ? this.displayAmount("HST:", this.state.order.hst, "body1") : null }
                          </Box>
                          <Divider />
                          <Box mt={1}>
                            {this.displayAmount("Total:", this.state.order.total, "h5")}
                          </Box>
                          </React.Fragment>
                        ) : null
                      }
                      <Box mt={3}>
                        {nextButton}
                      </Box>
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
