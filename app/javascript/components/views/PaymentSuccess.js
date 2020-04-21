import React from "react"
import PropTypes from "prop-types"

import { Link as RouterLink } from "react-router-dom"
import { Box, Grid, Typography, Link } from "@material-ui/core"
import { blue, green } from "@material-ui/core/colors"
import { CheckCircle } from "@material-ui/icons"

class PaymentSuccess extends React.Component {
  componentDidMount() {
    if (!(this.props.location.state && this.props.location.state.status == "success")) {
      this.props.history.replace("/404")
    }
  }

  render () {
    return (
      <div>
        <Box style={{textAlign: "center"}}>
          <CheckCircle style={{fontSize: 80, color: green[500]}} />
          <Typography variant="h4">Payment Received!</Typography>
          <Typography variant="h6"><Link component={RouterLink} to="/" style={{color: blue[500]}}>Go back home</Link></Typography>
        </Box>
      </div>
    );
  }
}

export default PaymentSuccess
