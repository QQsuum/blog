import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
	setDeletedTag,
	setCreatedTag,
	setTagChange,
	fetchNewArticle,
	clearTagsList,
} from '../../store/features/articles/articles-slice'
import classes from './new-article.module.scss'

const NewArticle = () => {
	const articles = useSelector((store) => store.articles)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {
		formState: { errors, isValid },
		register,
		handleSubmit,
	} = useForm({ mode: 'onChange' })

	useEffect(() => {
		if (!localStorage.getItem('tags')) {
			const id = createId()
			const item = { id, content: '' }
			dispatch(setCreatedTag(item))

			localStorage.setItem('tags', JSON.stringify([item]))
		} else {
			const tags = JSON.parse(localStorage.getItem('tags'))
			for (let i of tags) {
				dispatch(setCreatedTag(i))
			}
		}
	}, [])

	const onSubmit = async (body) => {
		await dispatch(fetchNewArticle(body)).then(() => {
			if (!localStorage.getItem('tags')) {
				navigate('/articles')
				dispatch(clearTagsList())
			}
		})
	}
	
	const createId = () => {
		return Math.pow(Math.random(), Math.random()) * 100
	}

	const createTag = () => {
		const id = createId()
		const item = { id, content: '' }
		dispatch(setCreatedTag(item))

		const newData = JSON.stringify([...articles.tags, item])
		localStorage.setItem('tags', newData)
	}

	const deleteTag = (id) => {
		dispatch(setDeletedTag(id))

		const newData = JSON.stringify(
			[...articles.tags].filter((el) => el.id !== id)
		)
		localStorage.setItem('tags', newData)
	}

	const tags = articles.tags.map((el, i) => {
		return (
			<div className='tags' key={el.id}>
				<input
					className={classes['input-tag']}
					onChange={(e) =>
						dispatch(setTagChange({ id: el.id, content: e.target.value }))
					}
					placeholder='Tag'
				/>
				<button
					type='button'
					className={
						articles.tags.length === 1
							? `${classes['tag-button-delete']} ${classes['inactive']}`
							: classes['tag-button-delete']
					}
					onClick={(e) =>
						e.target.className == classes['tag-button-delete']
							? deleteTag(el.id)
							: null
					}
				>
					delete
				</button>
			</div>
		)
	})

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={classes['new-article']}>
			<h1 className={classes['title']}>Create new article</h1>
			<label className={classes['label']}>Title</label>
			<input
				className={
					!errors.title
						? classes['input']
						: `${classes['input']} ${classes['error']}`
				}
				{...register('title', {
					required: 'Enter article title',
				})}
				placeholder='Title'
			/>

			{errors.title && (
				<div className={classes['error-message']}>{errors.title.message}</div>
			)}

			<label className={classes['label']}>Short description</label>
			<input
				className={
					!errors.description
						? classes['input']
						: `${classes['input']} ${classes['error']}`
				}
				{...register('description', {
					required: 'Enter description',
				})}
				placeholder='Title'
			/>

			{errors.description && (
				<div className={classes['error-message']}>
					{errors.description.message}
				</div>
			)}

			<label className={classes['label']}>Text</label>

			<textarea
				className={
					!errors.text
						? classes['input']
						: `${classes['input']} ${classes['error']}`
				}
				rows={11}
				{...register('body', {
					required: 'Enter text',
				})}
				placeholder='Text'
			/>

			{errors.text && (
				<div className={classes['error-message']}>{errors.text.message}</div>
			)}
			<label className={classes['label']}>Tags</label>
			<div className={classes['tags-wrapper']}>
				{tags}
				<button
					type='button'
					className={classes['tag-button-add']}
					onClick={createTag}
				>
					Add tag
				</button>
			</div>

			<button
				className={
					isValid
						? classes['button']
						: `${classes['button']} ${classes['inactive']}`
				}
			>
				Send
			</button>
		</form>
	)
}
export default NewArticle
