import React from 'react';

// Redux
import { connect } from 'react-redux';

// Router
import { Route, Redirect } from 'react-router-dom';

function PrivateRoute(props) {
	if (props.auth) {
		return <Route exact component={props.component} path={props.path} />;
	} else {
		return <Redirect to={props.redirect} />;
	}
}

const mapState = (state) => {
	return {
		auth: state.auth
	};
};

const mapDis = (dispatch) => {
	return {};
};

export default connect(mapState, mapDis)(PrivateRoute);
