import React from "react"
import PropTypes from "prop-types"
import { Route as ReactRoute, Switch } from 'react-router-dom'

import Home from './views/Home'
import Products from './views/Products'
import Category from './views/Category'
import CompanyPages from './views/CompanyPages'
import ProductDetail from './views/ProductDetail'
import SearchPage from "./views/SearchPage"
import ShoppingCart from "./views/ShoppingCart";
import E404 from './views/E404'
import Checkout from './views/Checkout'
import Login from './views/Login'
import UserCentre from './views/UserCentre'
import Register from './views/Register'

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
        <ReactRoute exact path="/search" component={SearchPage} />
        <ReactRoute exact path="/cart" component={ShoppingCart} />
        <ReactRoute exact path="/cart/checkout" component={Checkout} />
        <ReactRoute exact path="/cart/checkout/:id" component={Checkout} />
        <ReactRoute exact path="/login" component={Login} />
        <ReactRoute exact path="/user" component={UserCentre} />
        <ReactRoute exact path="/register" component={Register} />
        { companyPagesRoute }
        <ReactRoute component={E404} />
      </Switch>
    );
  }
}

export default Route
