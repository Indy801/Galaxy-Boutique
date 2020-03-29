import React from "react"
import PropTypes from "prop-types"
import { BrowserRouter as Router } from 'react-router-dom'
import Route from './Route'

class App extends React.Component {
  render () {
    return (
      <Router>
        <div>
          <Route />
        </div>
      </Router>
    );
  }
}

export default App
