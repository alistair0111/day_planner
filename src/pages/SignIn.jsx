import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import useStyles from '../config/theme.sign-in';

import { withFirebase } from '../components/Firebase';
import { Link, withRouter } from 'react-router-dom';

function SignIn(props) {
	const classes = useStyles();

	const initialUser = {
		id: null,
		email: '',
		password: '',
		error: null,
		auth: null,
	};

	const [user, setUser] = useState(initialUser);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};

	const handleSubmit = (e) => {
		props.firebase
			.doSignInWithEmailAndPassword(user.email, user.password)
			.then((authUser) => {
				// Create a user in the Firebase realtime database
				// return props.firebase.user(authUser.user.uid).set({
				// 	username: user.name,
				// 	email: user.email,
				// 	activities: 'not set',
				// });
			})
			.then((authUser) => {
				setUser(initialUser);
				props.history.push('/dashboard');
			})
			.catch((error) => {
				setUser({ ...user, error: error.message });
			});
	};

	const isValid = user.email === '' || user.password === '';

	return (
		<Grid container component='main' className={classes.root}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} className={classes.image} />
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>
						Sign in
					</Typography>
					<form
						className={classes.form}
						noValidate
						onSubmit={(e) => e.preventDefault()}
					>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							id='email'
							label='Email Address'
							name='email'
							autoComplete='email'
							autoFocus
							onChange={handleChange}
						/>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							name='password'
							label='Password'
							type='password'
							id='password'
							autoComplete='current-password'
							onChange={handleChange}
						/>
						<Typography className={classes.error}>
							{user.error ? user.error : ''}
						</Typography>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							color='primary'
							className={classes.submit}
							onClick={handleSubmit}
							disabled={isValid}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href='#' variant='body2'>
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link to='/sign-up'>{"Don't have an account? Sign Up"}</Link>
							</Grid>
						</Grid>
						{/* <Box mt={5}>
							<Copyright />
						</Box> */}
					</form>
				</div>
			</Grid>
		</Grid>
	);
}

export default withRouter(withFirebase(SignIn));