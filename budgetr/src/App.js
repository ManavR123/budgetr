import React, { useState, useEffect } from "react";
import Main from "./Main.js";

import Amplify, { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
Amplify.configure(awsconfig);
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

const styles = {
  app: {
    textAlign: "center",
  },
  signOut: {
    position: "fixed",
    right: "10px",
    top: "5px",
  },
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Auth.currentUserInfo().then((user) => setUser(user));
  }, []);

  return (
    <div style={styles.app}>
      <h1>Budgetr</h1>
      <div style={styles.signOut}>
        <AmplifySignOut />
      </div>
      {user ? <Main /> : null}
    </div>
  );
}

export default withAuthenticator(App);
