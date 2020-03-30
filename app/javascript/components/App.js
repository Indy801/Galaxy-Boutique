import React from "react"
import PropTypes from "prop-types"
import { BrowserRouter as Router } from 'react-router-dom'
import Route from './Route'

import { Container } from '@material-ui/core'
import 'typeface-roboto'

class App extends React.Component {
  render () {
    return (
      <Router>
        <Container>
          <Route />
        </Container>
      </Router>
    );
  }
}

export default App
