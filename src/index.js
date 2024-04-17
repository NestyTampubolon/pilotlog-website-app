import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import HomeLayout from 'layouts/home';
import RtlLayout from 'layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import PrivateRoute from 'components/PrivateRoute';

ReactDOM.render(
	<ChakraProvider theme={theme}>
		<React.StrictMode>
			<ThemeEditorProvider>
				<HashRouter>
					<Switch>
						<PrivateRoute path="/admin" component={AdminLayout} />
						<PrivateRoute path="/test" component={AdminLayout} />
						<PrivateRoute path="/rtl" component={RtlLayout} />
						<Route path="/auth" component={AuthLayout} />
						<Route path="/home" component={HomeLayout} />
						{/* <Redirect from="/" to="/auth/sign-in" /> */}
						<Redirect from="/" to="/home/" />
					</Switch>
				</HashRouter>
			</ThemeEditorProvider>
		</React.StrictMode>
	</ChakraProvider>,
	document.getElementById('root')
);
