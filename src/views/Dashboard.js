// import React, { useContext, createContext, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link,
//   Navigate,
//   useNavigate,
//   useLocation,
// } from "react-router-dom";

// class Dashboard extends React.Component {
//   fakeAuth = {
//     isAuthenticated: false,
//     signin(cb) {
//       fakeAuth.isAuthenticated = true;
//       setTimeout(cb, 100); // fake async
//     },
//     signout(cb) {
//       fakeAuth.isAuthenticated = false;
//       setTimeout(cb, 100);
//     },
//   };

//   authContext = createContext();

//   ProvideAuth({ children }) {
//     const auth = useProvideAuth();
//     return <authContext.Provider value={auth}>{children}</authContext.Provider>;
//   }

//   useAuth() {
//     return useContext(authContext);
//   }

//   useProvideAuth() {
//     const [user, setUser] = useState(null);

//     const signin = (cb) => {
//       return fakeAuth.signin(() => {
//         setUser("user");
//         cb();
//       });
//     };

//     const signout = (cb) => {
//       return fakeAuth.signout(() => {
//         setUser(null);
//         cb();
//       });
//     };

//     return {
//       user,
//       signin,
//       signout,
//     };
//   }

//   AuthButton() {
//     let history = useNavigate();
//     let auth = useAuth();

//     return auth.user ? (
//       <p>
//         Welcome!{" "}
//         <button
//           onClick={() => {
//             auth.signout(() => history.push("/"));
//           }}
//         >
//           Sign out
//         </button>
//       </p>
//     ) : (
//       <p>You are not logged in.</p>
//     );
//   }

//   PrivateRoute({ children, ...rest }) {
//     let auth = useAuth();
//     return (
//       <Route
//         {...rest}
//         render={({ location }) =>
//           auth.user ? (
//             children
//           ) : (
//             <Navigate
//               to={{
//                 pathname: "/login",
//                 state: { from: location },
//               }}
//             />
//           )
//         }
//       />
//     );
//   }

//   PublicPage() {
//     return <h3>Public</h3>;
//   }

//   ProtectedPage() {
//     return <h3>Protected</h3>;
//   }

//   LoginPage() {
//     let history = useNavigate();
//     let location = useLocation();
//     let auth = useAuth();

//     let { from } = location.state || { from: { pathname: "/" } };
//     let login = () => {
//       auth.signin(() => {
//         history.replace(from);
//       });
//     };

//     return (
//       <div>
//         <p>You must log in to view the page at {from.pathname}</p>
//         <button onClick={login}>Log in</button>
//       </div>
//     );
//   }

//   render() {
//     return (
//       <>
//         <ProvideAuth>
//           <Router>
//             <div>
//               <AuthButton />

//               <ul>
//                 <li>
//                   <Link to="/public">Public Page</Link>
//                 </li>
//                 <li>
//                   <Link to="/protected">Protected Page</Link>
//                 </li>
//               </ul>

//               <Routes>
//                 <Route path="/public">
//                   <PublicPage />
//                 </Route>
//                 <Route path="/login">
//                   <LoginPage />
//                 </Route>
//                 <PrivateRoute path="/protected">
//                   <ProtectedPage />
//                 </PrivateRoute>
//               </Routes>
//             </div>
//           </Router>
//         </ProvideAuth>
//       </>
//     );
//   }
// }

// export default Dashboard;

import React, { useContext, createContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

// This example has 3 pages: a public page, a protected
// page, and a login screen. In order to see the protected
// page, you must first login. Pretty standard stuff.
//
// First, visit the public page. Then, visit the protected
// page. You're not yet logged in, so you are redirected
// to the login page. After you login, you are redirected
// back to the protected page.
//
// Notice the URL change each time. If you click the back
// button at this point, would you expect to go back to the
// login page? No! You're already logged in. Try it out,
// and you'll see you go back to the page you visited
// just *before* logging in, the public page.

const Dashboard = () => {
  return (
    <ProvideAuth>
      <Router>
        <div>
          <AuthButton />

          <ul>
            <li>
              <Link to="/public">Public Page</Link>
            </li>
            <li>
              <Link to="/protected">Protected Page</Link>
            </li>
          </ul>

          <Routes>
            <Route path="/public" element={<PublicPage />} />
            <Route path="/login" element={<LoginPage />} />
            <PrivateRoute path="/protected" element={<ProtectedPage />} />
          </Routes>
        </div>
      </Router>
    </ProvideAuth>
  );
};

const fakeAuth = {
  isAuthenticated: false,
  signin(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  },
};

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
const authContext = createContext();

const ProvideAuth = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = (cb) => {
    return fakeAuth.signin(() => {
      setUser("user");
      cb();
    });
  };

  const signout = (cb) => {
    return fakeAuth.signout(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    signout,
  };
}

function AuthButton() {
  let history = useNavigate();
  let auth = useAuth();

  return auth.user ? (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          auth.signout(() => history.push("/"));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  );
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({ children, ...rest }) => {
  const checkAuth = null;
  let auth = useAuth();
  return checkAuth ? (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Navigate
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  ) : (
    <Navigate to="/login" />
  );
};

const PublicPage = () => {
  const auth = null;

  return auth ? <h3>Public</h3> : <Navigate to="/login" />;
};

const ProtectedPage = () => {
  return <h3>Protected</h3> ?? <Navigate to="/login" />;
};

function LoginPage() {
  let history = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: { pathname: "/" } };
  let login = () => {
    auth.signin(() => {
      history.replace(from);
    });
  };

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>Log in</button>
    </div>
  );
}

export default Dashboard;
