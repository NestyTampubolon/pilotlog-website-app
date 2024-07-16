import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import HomeLayout from 'layouts/home';
import RtlLayout from 'layouts/rtl';
import SuperadminLayout from 'layouts/superadmin';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import PrivateRoute from 'components/PrivateRoute';

ReactDOM.render(
	<ChakraProvider theme={theme}>
		<React.StrictMode>
			<ThemeEditorProvider>
				<Router>
					<Switch>
						<PrivateRoute path="/admin" component={AdminLayout} />
						<PrivateRoute path="/test" component={AdminLayout} />
						<PrivateRoute path="/rtl" component={RtlLayout} />
						<PrivateRoute path="/superadmin" component={SuperadminLayout} />
						<Route path="/auth" component={AuthLayout} />
						<Route path="/home" component={HomeLayout} />
						<Redirect from="/" to="/home/" />
					</Switch>
				</Router>
			</ThemeEditorProvider>
		</React.StrictMode>
	</ChakraProvider>,
	document.getElementById('root')
);
