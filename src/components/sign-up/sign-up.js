import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import {
	fetchSignUpUser,
	setEmailError,
	setUsernameError,
} from '../../store/features/login/login-slice'
import classes from './sign-up.module.scss'

const SignUp = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const state = useSelector((store) => store.login)
	let isLogged = useSelector((store) => store.login.token)
	const {
		formState: { errors, isValid },
		register,
		getValues,
		handleSubmit,
	} = useForm({ mode: 'onChange' })

	useEffect(() => {
		if (isLogged) {
			navigate('/articles')
		}
	}, [isLogged])

	const onSubmit = (body) => {
		dispatch(fetchSignUpUser(body))
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={classes['sign-up']}>
			<h1 className={classes['title']}>Create new account</h1>
			<label className={classes['label']}>Username</label>
			<input
				{...register('username', {
					minLength: {
						value: 3,
						message: 'Your username needs to be at least 3 characters.',
					},
					onChange: () => dispatch(setUsernameError('')),
					placeholder: 'Username',
				})}
				className={
					!errors.username
						? classes['input']
						: `${classes['input']} ${classes['error']}`
				}
			/>

			{errors.username && (
				<div className={classes['error-message']}>
					{errors.username.message}
				</div>
			)}
			{state.usernameError && (
				<div className={classes['error-message']}>{state.usernameError}</div>
			)}

			<label className={classes['label']}>Email address</label>
			<input
				{...register('email', {
					required: 'Enter email adress',
					pattern: {
						value:
							/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
						message: 'Email is invalid',
					},
					placeholder: 'Email address',
					onChange: () => dispatch(setEmailError('')),
				})}
				className={
					!errors.email
						? classes['input']
						: `${classes['input']} ${classes['error']}`
				}
			/>

			{errors.email && (
				<div className={classes['error-message']}>{errors.email.message}</div>
			)}
			{state.emailError && (
				<div className={classes['error-message']}>{state.emailError}</div>
			)}

			<label className={classes['label']}>Password</label>
			<input
				{...register('password', {
					type: 'password',
					required: 'Enter password',
					minLength: {
						value: 6,
						message: 'Your password needs to be at least 6 characters.',
					},
					placeholder: 'Password',
				})}
				className={
					!errors.password
						? classes['input']
						: `${classes['input']} ${classes['error']}`
				}
			/>

			{errors.password && (
				<div className={classes['error-message']}>
					{errors.password.message}
				</div>
			)}
			{state.passwordError && (
				<div className={classes['error-message']}>{state.passwordError}</div>
			)}

			<label className={classes['label']}>Repeat Password</label>
			<input
				{...register('passwordRepeat', {
					type: 'password',
					required: 'Repeat password',
					validate: (v) => v === getValues('password'),
					message: '',

					placeholder: 'Repeat Password',
				})}
				className={
					!errors.passwordRepeat
						? classes['input']
						: `${classes['input']} ${classes['error']}`
				}
			/>

			{errors.passwordRepeat && (
				<div className={classes['error-message']}>Passwords must match</div>
			)}

			<label htmlFor='checkbox' className={classes['checkbox']}>
				<input
					className={classes['check']}
					type='checkbox'
					{...register('checkbox', {
						required: true,
					})}
					id='checkbox'
				/>
				<span className={classes['checkbox-text']}>
					I agree to the processing of my personal information
				</span>
			</label>

			<button
				type='submit'
				disabled={!isValid}
				className={
					!isValid
						? `${classes['button']} ${classes['inactive']}`
						: classes['button']
				}
			>
				Create
			</button>

			<div className={classes['sign-in']}>
				Already have an account?{' '}
				<NavLink className={classes['sign-in-link']} to={'/sign-in'}>
					Sign In.
				</NavLink>
			</div>
		</form>
	)
}
export default SignUp
