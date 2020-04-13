class LoginToken {
  constructor() {

  }

  static extractToken(res) {
    return res.headers.authorization.split(' ')[1]
  }

  static saveToken(token) {
    if (token == null) {
      localStorage.removeItem("userToken")
    } else {
      localStorage.setItem("userToken", token)
    }
  }

  static getToken() {
    return localStorage.getItem("userToken")
  }

  static getHeaderWithToken() {
    if (this.getToken() == null) {
      return {}
    }

    return {
      Authorization: 'Bearer ' + this.getToken()
    }
  }
}

export default LoginToken