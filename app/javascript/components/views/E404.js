import React from "react"
import PropTypes from "prop-types"

import { Link as RouterLink } from "react-router-dom"
import { Box, Grid, Typography, Link } from "@material-ui/core"
import { blue } from "@material-ui/core/colors"
import { Error as ErrorIcon } from "@material-ui/icons"

class E404 extends React.Component {
  render () {
    return (
      <div>
        <Box style={{textAlign: "center"}}>
          <ErrorIcon style={{fontSize: 80}} />
          <Typography variant="h3">404</Typography>
          <Typography variant="h4">You are trying to travel to an unidentified coordinate.</Typography>
          <Typography variant="h6">Don't try traveling to unidentified coordinates, it could be a one-way trip!</Typography>
          <Typography variant="h6"><Link component={RouterLink} to="/" style={{color: blue[500]}}>Go back home</Link></Typography>
        </Box>
      </div>
    );
  }
}

export default E404
