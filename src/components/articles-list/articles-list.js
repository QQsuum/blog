import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Article from '../article/article'
import { useDispatch } from 'react-redux'
import { getGlobalArticles } from '../../store/features/articles/articles-slice'
import classes from './articles-list.module.scss'
import WithPagination from '../with-pagination/with.pagination'
import { setToken } from '../../store/features/login/login-slice'

const ArticlesList = () => {
	const isLogged = useSelector((store) => store.login.token)
	const articlesData = useSelector((store) => store.articles.articlesData)
	const articlesCount = useSelector((store) => store.articles.articlesCount)
	const itemsOnPage = 20

	const dispatch = useDispatch()
	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			dispatch(setToken(token))
		}
		dispatch(getGlobalArticles())
	}, [isLogged])

	const articles = articlesData.map((article) => {
		return (
			<li key={article.slug} className={classes['article-item']}>
				<Article article={article} />
			</li>
		)
	})

	const pagination =
		articles || articles.length > 0 ? (
			<WithPagination articlesCount={articlesCount} itemsOnPage={itemsOnPage} />
		) : null

	return (
		<>
			<ul className={classes['articles-list']}>{articles}</ul>
			{pagination}
		</>
	)
}

export default ArticlesList
