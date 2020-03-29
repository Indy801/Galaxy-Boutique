import React from "react"
import PropTypes from "prop-types"
import { Route as ReactRoute, Switch } from 'react-router-dom'

import Home from './views/Home'

class Route extends React.Component {
  render () {
    return (
      <Switch>
        <ReactRoute exact path="/" component={Home} />
      </Switch>
    );
  }
}

export default Route
