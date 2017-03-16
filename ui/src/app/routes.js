import React from "react";

import Route from "react-router/lib/Route";
import IndexRedirect from "react-router/lib/IndexRedirect";

import axiosConfig from "./config/axios";
import authRequired from "./auth-required";

import * as homeActions from "./actions/home";

import App from "./app";
import NotFound from "./containers/404";
import LogIn from "./containers/auth/log-in";
import Home from "./containers/home";
import Messages from "./containers/messages";

const createRoutes = store => {
	const dispatch = store.dispatch;
	axiosConfig(dispatch);

	return (
		<Route path="/" component={App}>
			<IndexRedirect to="home"/>
			<Route path="log-in" component={LogIn}/>
			<Route path="home"
				   component={Home}
				   onEnter={authRequired(store, () => dispatch(homeActions.getGreetingMessage()))}/>
			<Route path="messages"
				   component={Messages}
				   onEnter={authRequired(store, () => {})}/>
			<Route path="*" component={NotFound}/>
		</Route>
	);
};

export default createRoutes;
