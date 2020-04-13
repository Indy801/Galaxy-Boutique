import React from "react"
import PropTypes from "prop-types"

import { Box, Grid, TextField, Typography, Button, Container } from "@material-ui/core";
import Axios from "axios";
import LoginToken from './shared/LoginToken'

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      alias: "",
      password: "",
      confirmPassword: "",
      confirmPasswordError: false,
      emailErrorText: "",
      passwordError: false,
    }
  }

  emailChanged = (event) => {
    this.setState({ email: event.target.value, emailErrorText: "" })
  }
  aliasChanged = (event) => {
    this.setState({ alias: event.target.value })
  }
  passwordChanged = (event) => {
    this.setState({
      password: event.target.value,
      confirmPassword: "",
      confirmPasswordError: false,
      passwordError: false,
    })
  }
  confirmPasswordChanged = (event) => {
    this.setState({ confirmPassword: event.target.value, confirmPasswordError: false })
  }

  inputKeyDown = (event) => {
    if (event.keyCode == 13) {
      this.confirmRegister(event)
    }
  }

  confirmRegister = (event) => {
    if (!this.checkRequiredField()) {
      return
    }

    Axios({
      method: "post",
      url: "/api/user/signup",
      data: {user: { email: this.state.email, password: this.state.password }},
    }).then(response => {
      this.checkRegisterResult(response)
    }).catch(error => {
      console.error("registration throws exception.")
    })
  }

  checkRequiredField = () => {
    let result = true
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
      result = false
      this.setState({ emailErrorText: "Please enter a valid email address." })
    }
    if (this.state.password.length < 6) {
      result = false
      this.setState({ passwordError: true })
    } else if (this.state.password !== this.state.confirmPassword) {
      result = false
      this.setState({ confirmPasswordError: true })
    }

    return result
  }

  checkRegisterResult = (response) => {
    if (response.data.id == null) {
      this.setState({ emailErrorText: "Email already taken." })
    } else {
      const token = LoginToken.extractToken(response)
      LoginToken.saveToken(token)
      this.props.history.replace("/user")
    }
  }

  render () {
    return (
      <div>
        <Container maxWidth="sm">
          <Box mb={4}><Typography variant="h4">Register</Typography></Box>
          <Box mb={2}>
            <TextField fullWidth label="Email" value={this.state.email} onChange={this.emailChanged}
              error={Boolean(this.state.emailErrorText)}
              helperText={this.state.emailErrorText}
              onKeyDown={this.inputKeyDown}
            />
          </Box>
          <Box mb={2}>
            <TextField fullWidth label="Alias" value={this.state.alias} onChange={this.aliasChanged}
              helperText="*Optional"
              onKeyDown={this.inputKeyDown}
            />
          </Box>
          <Box mb={2}>
            <TextField fullWidth label="Password" value={this.state.password} onChange={this.passwordChanged} type="password"
              error={this.state.passwordError}
              helperText={this.state.passwordError ? "Password must be at least 6 characters long." : null}
              onKeyDown={this.inputKeyDown}
            />
          </Box>
          <Box mb={4}>
            <TextField fullWidth label="Confirm Password" value={this.state.confirmPassword} onChange={this.confirmPasswordChanged} type="password"
              error={this.state.confirmPasswordError}
              helperText={this.state.confirmPasswordError ? "Confirm Password is incorrect." : null}
              onKeyDown={this.inputKeyDown}
            />
          </Box>
          <Box>
            <Button variant="contained" color="primary" onClick={this.confirmRegister}>Register</Button>
          </Box>
        </Container>
      </div>
    );
  }
}

export default Register
