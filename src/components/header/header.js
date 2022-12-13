import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { setLogout } from '../../store/features/login/login-slice'
import { deleteUserInfo, getUser } from '../../store/features/user/user-slice'
import classes from './header.module.scss'

const Header = () => {
	const dispatch = useDispatch()
	const user = useSelector((store) => store.user)
	let isLogged = useSelector((store) => store.login.token)

	useEffect(() => {
		dispatch(getUser(isLogged))
	}, [isLogged])

	const logoutHandle = () => {
		localStorage.removeItem('token')
		dispatch(setLogout())
		dispatch(deleteUserInfo())
	}

	const imageHandle = (e) => {
		e.target.src =
			'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png'
	}

	const guestContent = (
		<>
			<NavLink to={'sign-in'}>
				<button className={classes['sign-in']}>Sign In</button>
			</NavLink>
			<NavLink to={'sign-up'}>
				<button className={classes['sign-up']}>Sign Up</button>
			</NavLink>
		</>
	)

	const userContent = (
		<>
			<NavLink to={'new-article'}>
				<button className={classes['new-article']}>Create article</button>
			</NavLink>
			<NavLink to={'profile'} className={classes['profile']}>
				<div className={classes['username']}>{user.username}</div>
				<img
					className={classes['avatar']}
					src={user.image}
					onError={(e) => imageHandle(e)}
				/>
			</NavLink>
			<NavLink to={'sign-in'} onClick={logoutHandle}>
				<button className={classes['log-out']}>Log Out</button>
			</NavLink>
		</>
	)

	return (
		<header className={classes['header']}>
			<NavLink to={'articles/'}>
				<div className={classes['blog-name']}>Realworld Blog</div>
			</NavLink>

			<div className={classes['right-wrapper']}>
				{isLogged ? userContent : guestContent}
			</div>
		</header>
	)
}
export default Header
