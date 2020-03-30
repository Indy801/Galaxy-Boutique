import React from "react"
import PropTypes from "prop-types"

import { Typography } from '@material-ui/core'
import { CheckBox } from '@material-ui/icons'
import { green } from '@material-ui/core/colors'

class Home extends React.Component {
  render () {
    return (
      <div>
        <Typography variant="h3">Welcome to Galaxy Boutique!</Typography>
        <Typography variant="body1">Brought to you by React-Rails and Material UI.</Typography>
        <Typography variant="body1"><CheckBox style={{ color: green[500] }} /> Material UI is working fast?!</Typography>
      </div>
    );
  }
}

export default Home
