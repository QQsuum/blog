import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'
import classes from './sign-in.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import {
	fetchSignInUser,
	setLoginError,
} from '../../store/features/login/login-slice'

const SignIn = () => {
	const state = useSelector((store) => store.login)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	let isLogged = useSelector((store) => store.login.token)

	useEffect(() => {
		if (isLogged) {
			navigate('/articles')
		}
	}, [isLogged])

	const {
		register,
		formState: { errors, isValid },
		handleSubmit,
	} = useForm({
		mode: 'onBlur',
	})

	const onSubmit = (data) => {
		dispatch(fetchSignInUser(data))
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={classes['sign-in']}>
			<h1 className={classes['title']}>Sign In</h1>

			<label className={classes['label']}>Email address</label>
			<input
				{...register('email', {
					required: 'Enter email adress',
					pattern: {
						value:
							/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
						message: 'Email is invalid',
					},
					onChange: () => dispatch(setLoginError('')),

					placeholder: 'Email address',
				})}
				className={classes['input']}
			/>
			{errors.email && (
				<div className={classes['error-message']}>{errors.email.message}</div>
			)}

			<label className={classes['label']}>Password</label>
			<input
				{...register('password', {
					type: 'password',
					required: 'Enter password',
					minLength: { value: 6, message: 'Password is invalid' },
					placeholder: 'Password',
					onChange: () => dispatch(setLoginError('')),
				})}
				className={classes['input']}
			/>

			{errors.password && (
				<div className={classes['error-message']}>
					{errors.password.message}
				</div>
			)}

			{state.loginError && (
				<div
					style={{ textAlign: 'center' }}
					className={classes['error-message']}
				>
					{state.loginError}
				</div>
			)}

			<button
				type='submit'
				disabled={!isValid}
				className={
					!isValid
						? `${classes['button']} ${classes['inactive']}`
						: classes['button']
				}
			>
				Login
			</button>

			<div className={classes['sign-up']}>
				Don’t have an account?{' '}
				<NavLink className={classes['sign-up-link']} to={'/sign-up'}>
					Sign Up.
				</NavLink>
			</div>
		</form>
	)
}
export default SignIn
