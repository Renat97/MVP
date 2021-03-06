import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {increment, decrement, signIn} from '../actions';
import Button from '@material-ui/core/Button';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom"
import HomePage from '../pages';
import fetch from 'node-fetch';
import Registration from '../pages/Registration.jsx';
import VolunteerLogin from '../pages/VolunteerLogin.jsx';
import VolunteerForm from './VolunteerForm.jsx';
import VolunteerHours from '../pages/VolunteerHours.jsx';
import StaffPage from '../pages/StaffPage.jsx';
import MasterStaffPage from '../pages/MasterStaffPage.jsx';
import ErrorPage from '../pages/404.jsx';
import {authenticate} from '../actions';
import FamilyCheckInPage from '../pages/FamilyCheckInPage.jsx';
import MasterStaffNewPage from '../pages/MasterStaffNewPage.jsx';
import {ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from} from "@apollo/client";
import {onError} from '@apollo/client/link/error';

const errorLink = onError(({ graphqlErrors, networkError}) => {
  if(graphqlErrors) {
    graphqlErrors.map(({message, location, path}) => {
      alert(`Graphql error ${message}`);
    });
  }
  if(networkError) {
    alert(`Network error ${networkError}`)
  }
});

const link = from([
  errorLink,
  new HttpLink({uri: "http://localhost:3000/graphql", fetch})
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link
})

// Work on the authentication/authorization side as well as master staff page

function Authentication(props) {
  const position = props.position;
  if (position==="volunteer") {
    return (
    <VolunteerLogin/>
    )
  } else if(position==="staff") {
    return (
    <StaffPage/>
    )
  } else if(position==="masterStaff") {
    return (
    <MasterStaffNewPage/>
    )
  } else {
    return (
    <ErrorPage/>
    )
  }
}

var App = (props) => {
  const [role,setRole] = useState('');
  const store = props.store;
  store.subscribe(() => {
    var newStore = store.getState();
    console.log('auth',newStore.authenticate);
    setRole(newStore.authenticate);
  })
  console.log('ROLE',role);
  //HomePage
  return (
    <ApolloProvider client={client}>
    <Router>
      <Switch>
     <Route exact path="/" component= {HomePage} />
     <Route exact path="/registration" component = {Registration}/>
     <Route exact path="/login" render={(props) => (
    <Authentication position={role} />
      )}/>
     <Route exact path="/volunteerLogin" component = {VolunteerHours}/>
     <Route exact path="/staffLogin" component = {StaffPage}/>
     <Route exact path="/masterStaffLogin" component = {StaffPage}/>
     <Route exact path="/familyCheckIn" component={FamilyCheckInPage}/>
     </Switch>
    </Router>
    </ApolloProvider>
  );
}

export default App;
