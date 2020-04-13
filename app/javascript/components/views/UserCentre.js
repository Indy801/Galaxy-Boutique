import React from "react"
import PropTypes from "prop-types"

import LoginToken from './shared/LoginToken'
import Axios from 'axios'
import { Container, Box, Typography, CircularProgress, Button } from "@material-ui/core";

class UserCentre extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
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
  }

  logout = (event) => {
    Axios({
      method: "delete",
      url: "/api/user/logout",
      headers: LoginToken.getHeaderWithToken()
    }).then(response => {
      LoginToken.saveToken(null)
      if (this.props.history.length > 1) {
        this.props.history.go(-1)
      } else {
        this.props.history.replace("/")
      }
    }).catch(error => {
      console.error("Logout error.")
    })
  }

  render () {
    let userInfo = <Box><CircularProgress /></Box>

    if (this.state.user != null) {
      userInfo = (
        <Box mb={4}><Typography variant="body1">Email: {this.state.user.email}</Typography></Box>
      )
    }

    return (
      <div>
        <Container>
          <Box mb={4}><Typography variant="h3">User Centre</Typography></Box>
          { userInfo }
          <Box><Button variant="contained" color="primary" onClick={this.logout}>Logout</Button></Box>
        </Container>
      </div>
    );
  }
}

export default UserCentre
