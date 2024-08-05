import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

ReactDOM.render(
  <GoogleOAuthProvider clientId="786023973144-89olsd0qirmt89jqja0nn07pcg2nvv39.apps.googleusercontent.com">
    <App/>
  </GoogleOAuthProvider>,
  document.getElementById('root')
);
