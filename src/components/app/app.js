import React, { useEffect } from 'react'
import './app.css'
import ArticlesList from '../articles-list/articles-list'
import { Route, Routes } from 'react-router-dom'
import SingleArticle from '../single-article/single-article'
import SignUp from '../sign-up/sign-up'
import SignIn from '../sign-in/sign-in'
import Layout from '../layout/layout'
import { useDispatch, useSelector } from 'react-redux'
import { setToken } from '../../store/features/login/login-slice'
import { getUser } from '../../store/features/user/user-slice'
import EditProfile from '../edit-profile/edit-profile'
import NewArticle from '../new-article/new-article'
import EditArticle from '../edit-article/edit-article'

const App = () => {
	const dispatch = useDispatch()
	let isLogged = useSelector((store) => store.login.token)
	
	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			dispatch(setToken(token))
			dispatch(getUser(token))
		}
	}, [isLogged])
	
	useEffect(() => navigate('/articles'))
	
	return (
		<div className='blog-app'>
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route path='articles/' element={<ArticlesList />} />
					<Route path='articles/:slug' element={<SingleArticle />} />
					<Route path='/sign-up' element={<SignUp />} />
					<Route path='/sign-in' element={<SignIn />} />
					<Route path='/profile' element={<EditProfile />} />
					<Route path='/new-article' element={<NewArticle />} />
					<Route path='/articles/:slug/edit' element={<EditArticle />} />
				</Route>
			</Routes>
		</div>
	)
}
export default App
