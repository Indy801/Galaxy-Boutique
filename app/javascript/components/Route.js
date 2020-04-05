import React from "react"
import PropTypes from "prop-types"
import { Route as ReactRoute, Switch } from 'react-router-dom'

import Home from './views/Home'
import Products from './views/Products'
import Category from './views/Category'
import CompanyPages from './views/CompanyPages'
import ProductDetail from './views/ProductDetail'

class Route extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    const companyPagesRoute = this.props.companyPages.map(item => {
      return <ReactRoute key={item.id} exact path={`/${item.url}`} component={CompanyPages} />
    })

    return (
      <Switch>
        <ReactRoute exact path="/" component={Home} />
        <ReactRoute exact path="/products" component={Products} />
        <ReactRoute exact path="/category/:id" component={Category} />
        <ReactRoute exact path="/product/:id" component={ProductDetail} />
        { companyPagesRoute }
      </Switch>
    );
  }
}

export default Route
