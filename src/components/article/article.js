import React from 'react'
import classes from './article.module.scss'
import Heart from 'react-heart'
import { format } from 'date-fns'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setFavorited } from '../../store/features/articles/articles-slice'

const Article = ({ article }) => {
	const dispatch = useDispatch()
	const isLogged = useSelector((store) => store.login.token)

	const favoritesCount = article.favoritesCount
	const active = article.favorited
	const { slug } = article

	const onClickHandle = () => {
		if (!active) {
			dispatch(setFavorited([slug, 'POST']))
		} else {
			dispatch(setFavorited([slug, 'DELETE']))
		}
	}

	const imageHandle = (e) => {
		e.target.src =
			'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png'
	}

	const tags =
		article.tagList.length === 0
			? null
			: article.tagList.map((el, i) => {
					return el ? (
						<div key={i} className={classes['tag']}>
							{el}
						</div>
					) : null
			  })

	const createdTime = format(new Date(article.createdAt), "LLLL d',' uuuu ")
	return (
		<div className={classes['article']}>
			<div className={classes['top-wrapper']}>
				<div className={classes['left-wrapper']}>
					<div className={classes['title-and-favorited']}>
						<NavLink
							key={slug}
							to={`${slug}`}
							className={({ isActive }) =>
								isActive ? classes['active'] : classes['title']
							}
						>
							<div>{article.title}</div>
						</NavLink>

						{isLogged ? (
							<div className={classes['favoritesCount']}>
								<Heart
									style={{
										marginRight: '5px',
										width: '15px',
									}}
									isActive={article.favorited}
									onClick={(e) => onClickHandle(e)}
								/>

								{favoritesCount}
							</div>
						) : null}
					</div>

					<div className={classes['tags']}>{tags}</div>
				</div>
				<div className={classes['author']}>
					<div className={classes['author-info']}>
						<div className={classes['name']}>{article.author.username}</div>
						<div className={classes['date']}>{createdTime} </div>
					</div>
					<img
						className={classes['avatar']}
						src={article.author.image}
						alt='avatar'
						onError={(e) => imageHandle(e)}
					/>
				</div>
			</div>

			<div className={classes['content']}>{article.body}</div>
		</div>
	)
}
export default Article
