import React from "react"
import PropTypes from "prop-types"

import { Box, Grid, TextField, Typography, Button } from "@material-ui/core";
import Axios from "axios";
import LoginToken from './shared/LoginToken'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      loginError: false,
      loggedIn: null,
    }
  }

  emailChanged = (event) => {
    this.setState({ email: event.target.value })
  }

  passwordChanged = (event) => {
    this.setState({ password: event.target.value })
  }

  confirmLogin = (event) => {
    // console.log("login")
    this.setState({ loginError: false })
    Axios({
      method: "post",
      url: "/api/user/login",
      data: {user: { email: this.state.email, password: this.state.password }},
      headers: LoginToken.getHeaderWithToken()
    }).then(response => {
      const token = LoginToken.extractToken(response)
      LoginToken.saveToken(token)
      this.setState({ loggedIn: response.data.email })
    }).catch(error => {
      this.setState({ loginError: true })
    })
  }

  logout = (event) => {
    Axios({
      method: "delete",
      url: "/api/user/logout",
      headers: LoginToken.getHeaderWithToken()
    }).then(response => {
      LoginToken.saveToken(null)
      this.setState({ loggedIn: null })
    }).catch(error => {
      this.setState({ loginError: true })
    })
  }

  grab = (event) => {
    Axios({
      method: "get",
      url: "/api/user/info",
      headers: LoginToken.getHeaderWithToken()
    }).then(response => {
      this.setState({ loggedIn: response.data.email })
    }).catch(error => {

    })
  }

  render () {
    return (
      <div>
        <Box ml={50} mr={50}>
          <Box mb={4}><Typography variant="h5">Login</Typography></Box>
          <Box mb={2}>
            <TextField fullWidth label="Email" value={this.state.email} onChange={this.emailChanged} error={this.state.loginError} />
          </Box>
          <Box mb={4}>
            <TextField fullWidth label="Password" value={this.state.password} onChange={this.passwordChanged} type="password" error={this.state.loginError} />
          </Box>
          <Box>
            <Button variant="contained" color="primary" onClick={this.confirmLogin}>Login</Button>
            <Button variant="contained" color="primary" onClick={this.logout}>Logout</Button>
            <Button variant="contained" color="primary" onClick={this.grab}>Grab</Button>
          </Box>
          <Box>
            <Typography variant="body1">Loggin: {this.state.loggedIn}</Typography>
          </Box>
        </Box>
      </div>
    );
  }
}

export default Login
