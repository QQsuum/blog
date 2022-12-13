import React, { useEffect, useState } from 'react'
import classes from './single-article.module.scss'
import { format } from 'date-fns'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
	fetchDeleteArticle,
	getEditedArticle,
	getSingleArticle,
	resetSingleArticle,
	setFavorited,
} from '../../store/features/articles/articles-slice'
import ReactMarkdown from 'react-markdown'
import Heart from 'react-heart'
import { setToken } from '../../store/features/login/login-slice'
import ModalDelete from '../modal/modal'

const SingleArticle = () => {
	const [modalActive, setModalActive] = useState(false)
	const { slug } = useParams()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const article = useSelector((store) => store.articles.singleArticle)
	const isLogged = useSelector((store) => store.login.token)

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			dispatch(setToken(token))
		}
		dispatch(getSingleArticle(slug))

		return () => {
			dispatch(resetSingleArticle())
		}
	}, [slug, isLogged])

	const onClickHandle = (e) => {
		if (!article.favorited) {
			dispatch(setFavorited([slug, 'POST']))
		} else {
			dispatch(setFavorited([slug, 'DELETE']))
		}
	}

	const user = useSelector((store) => store.user)

	const deleteArticleButton =
		article?.author.username === user.username ? (
			<>
				<button
					type='button'
					className={classes['button-delete']}
					onClick={() =>
						!modalActive ? setModalActive(true) : setModalActive(false)
					}
				>
					Delete
				</button>

				<ModalDelete
					active={modalActive}
					slug={slug}
					setModalActive={setModalActive}
				/>
			</>
		) : null

	const editArticleButton =
		article?.author.username === user.username ? (
			<>
				<button
					type='button'
					className={classes['button-edit']}
					onClick={() => {
						dispatch(getEditedArticle())
						navigate(`/articles/${slug}/edit`)
					}}
				>
					Edit
				</button>
			</>
		) : null

	const tags =
		!article || article.tagList.length === 0
			? null
			: article.tagList.map((el, i) => {
					return el ? (
						<div key={i} className={classes['tag']}>
							{el}
						</div>
					) : null
			  })

	const createdTime = !article
		? null
		: format(new Date(article.createdAt), "LLLL d',' uuuu ")

	return !article ? null : (
		<div className={classes['article']}>
			<div className={classes['top-wrapper']}>
				<div className={classes['left-wrapper']}>
					<div className={classes['title-and-favorited']}>
						<div className={classes['title']}>{article.title}</div>
						<div className={classes['favoritesCount']}>
							<Heart
								style={{
									marginRight: '5px',
									width: '15px',
								}}
								isActive={article.favorited}
								onClick={onClickHandle}
							/>

							{article.favoritesCount}
						</div>
					</div>

					<div className={classes['tags']}>{tags}</div>
				</div>
				<div className={classes['right-wrapper']}>
					<div className={classes['author']}>
						<div className={classes['author-info']}>
							<div className={classes['name']}>{article.author.username}</div>
							<div className={classes['date']}>{createdTime} </div>
						</div>
						<img
							className={classes['avatar']}
							src={article.author.image}
							alt='avatar'
						/>
					</div>
					<div className={classes['buttons-wrapper']}>
						{deleteArticleButton}
						{editArticleButton}
					</div>
				</div>
			</div>
			<div className={classes['description']}>{article.description}</div>
			<div className={classes['content']}>
				<ReactMarkdown
					className={classes['reactMarkDown']}
					children={article.body}
				/>
			</div>
		</div>
	)
}

export default SingleArticle
