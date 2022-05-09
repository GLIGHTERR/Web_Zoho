import React from "react";
import axios from "axios";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    access_token: "",
    redirect: null,
  };

  handleLogin = (e) => {
    e.preventDefault();

    if (this.state.email !== "" && this.state.password !== "") {
      const dataArray = new FormData();
      dataArray.append("email", this.state.email);
      dataArray.append("password", this.state.password);

      axios
        .post("http://omuse.local/api/zoho/auth/login", dataArray, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (
            response &&
            response.data &&
            response.data.response &&
            response.data.response.access_token
          ) {
            this.setState({
              access_token: response.data.response.access_token,
            });

            alert("Login success!");
          } else {
            this.setState({
              access_token: "",
            });
            throw new Error(response.data.response.error);
          }
        })
        .catch((err) => {
          alert("Login failed: " + err.message);
          console.error(err);
        });
    }
  };

  handleChangeEmail = (emailInput) => {
    this.setState({
      email: emailInput,
    });
  };

  handleChangePassword = (passwordInput) => {
    this.setState({
      password: passwordInput,
    });
  };

  render() {
    return (
      <>
        <h1>Login</h1>
        <br />
        <hr />
        <form onSubmit={this.handleLogin}>
          <input
            type="text"
            value={this.state.email}
            onChange={(e) => this.handleChangeEmail(e.target.value ?? null)}
            placeholder="Email"
          />
          <input
            type="text"
            value={this.state.password}
            onChange={(e) => this.handleChangePassword(e.target.value ?? null)}
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
      </>
    );
  }
}

export default Login;
