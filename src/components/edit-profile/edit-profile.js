import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classes from './edit-profile.module.scss'
import { FaRegCheckCircle } from 'react-icons/fa'

import {
	fetchUpdateProfile,
	setEditedResult,
	setEditingEmailError,
	setEditingUsernameError,
} from '../../store/features/user/user-slice'
import { useForm } from 'react-hook-form'

const EditProfile = () => {
	const dispatch = useDispatch()
	const user = useSelector((store) => store.user)
	const {
		formState: { errors, isValid },
		register,
		getValues,
		handleSubmit,
	} = useForm({ mode: 'onChange' })

	const onSubmit = (body) => {
		dispatch(fetchUpdateProfile(body))
	}
	
	return (
		<form onSubmit={handleSubmit(onSubmit)} className={classes['sign-up']}>
			<h1 className={classes['title']}>Edit Profile</h1>
			<label className={classes['label']}>Username</label>
			<input
				{...register('username', {
					defaultValue: user.username,
					validate: (v) =>
						v !== user.username || getValues('email') !== user.email,
					minLength: {
						value: 3,
						message: 'Your username needs to be at least 3 characters.',
					},
					onChange: () => {
						dispatch(setEditingUsernameError(''))
						dispatch(setEditedResult(''))
					},
				})}
				defaultValue={user.username}
				className={
					!errors.username?.message && !user.usernameError
						? classes['input']
						: `${classes['input']} ${classes['error']}`
				}
			/>
			{errors.username?.message && (
				<div className={classes['error-message']}>
					{errors.username.message}
				</div>
			)}
			{user.usernameError && (
				<div className={classes['error-message']}>{user.usernameError}</div>
			)}

			<label className={classes['label']}>Email address</label>
			<input
				{...register('email', {
					defaultValue: user.email,
					validate: (v) =>
						v !== user.email || getValues('username') !== user.username,
					pattern: {
						value:
							/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
						message: 'Email is invalid',
					},
					onChange: () => {
						dispatch(setEditingEmailError(''))
						dispatch(setEditedResult(''))
					},
				})}
				defaultValue={user.email}
				className={
					!user.emailError?.message && !user.emailError
						? classes['input']
						: `${classes['input']} ${classes['error']}`
				}
			/>
			{errors.email?.message && (
				<div className={classes['error-message']}>{errors.email.message}</div>
			)}
			{user.emailError && (
				<div className={classes['error-message']}>{user.emailError}</div>
			)}

			<label className={classes['label']}>New Password</label>
			<input
				{...register('password', {
					type: 'password',

					minLength: {
						value: 6,
						message: 'Your password needs to be at least 6 characters.',
					},
				})}
				placeholder='New Password'
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

			<label className={classes['label']}>Avatar image (url)</label>
			<input
				{...register('image', {
					required: false,
					pattern: {
						value:
							/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
						message: 'Image must be a link ',
					},
				})}
				placeholder='Avatar image'
				className={
					!errors.image
						? classes['input']
						: `${classes['input']} ${classes['error']}`
				}
			/>
			{errors.image && (
				<div className={classes['error-message']}>{errors.image.message}</div>
			)}

			{isValid && !user.emailError && !user.usernameError && user.editedResult && (
				<>
					<FaRegCheckCircle
						size={60}
						color={'#52c41a'}
						style={{ margin: '5px auto 10px' }}
					/>
					<div className={classes['success-message']}>Successfully saved!</div>
				</>
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
				Save
			</button>
		</form>
	)
}

export default EditProfile
