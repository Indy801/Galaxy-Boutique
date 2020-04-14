import React from "react"
import PropTypes from "prop-types"

import LoginToken from './shared/LoginToken'
import Axios from 'axios'
import { Container, Box, Typography, CircularProgress, Button } from "@material-ui/core";
import AddressSection from './shared/AddressSection'

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
    let userInfo = <Box mb={4}><CircularProgress /></Box>

    if (this.state.user != null) {
      userInfo = (
        <Box mb={4}>
          <Typography variant="body1">Email: {this.state.user.email}</Typography>
          <Typography variant="body1">Alias: {this.state.user.alias}</Typography>
        </Box>
      )
    }

    return (
      <div>
        <Container>
          <Box mb={4}><Typography variant="h3">User Centre</Typography></Box>
          { userInfo }
          <Box mb={4}><Button variant="contained" color="primary" onClick={this.logout}>Logout</Button></Box>
          <Box mb={4}>
            <Typography variant="h4">Addresses</Typography>
            <AddressSection disableSelect />
          </Box>
        </Container>
      </div>
    );
  }
}

export default UserCentre
