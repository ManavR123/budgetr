import React, { useState } from "react";
import Main from "./Main.js";

import Amplify, { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
Amplify.configure(awsconfig);
import { AmplifySignOut, AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { onAuthUIStateChange } from "@aws-amplify/ui-components";

const styles = {
  app: {
    textAlign: "center",
  },
  auth: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "500px",
  },
  signOut: {
    position: "fixed",
    right: "10px",
    top: "5px",
  },
};

function App() {
  const [user, setUser] = useState(null);

  onAuthUIStateChange(() => {
    Auth.currentUserInfo().then((user) => setUser(user));
  }, []);

  return (
    <div style={styles.app}>
      <h1>Budgetr</h1>
      <div style={styles.signOut}>
        <AmplifySignOut />
      </div>
      {user == null ? (
        <div style={styles.auth}>
          <AmplifyAuthenticator />
        </div>
      ) : (
        <Main user={user} />
      )}
    </div>
  );
}

export default App;
