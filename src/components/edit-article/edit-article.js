import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {  useNavigate, useParams } from 'react-router-dom'
import {
	setDeletedTag,
	setCreatedTag,
	setTagChange,
	fetchEditArticle,
	clearTagsList,
	getEditedArticle,
	getSingleArticle,
} from '../../store/features/articles/articles-slice'
import classes from './edit-article.module.scss'

const NewArticle = () => {
	const { slug } = useParams()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const articles = useSelector((store) => store.articles)

	const {
		formState: { errors, isValid },
		register,
		handleSubmit,
	} = useForm({ mode: 'onTouched' })

	useEffect(() => {
		dispatch(getSingleArticle(slug)).then(() => dispatch(getEditedArticle()))
	}, [])

	useEffect(() => {
		if (articles.editedArticle?.tagList) {
			const tags = []
			articles.editedArticle?.tagList.forEach((el, i) => {
				tags.push({ id: createId(), content: el })
			})

			for (let i of tags) {
				dispatch(setCreatedTag(i))
			}
			return () => dispatch(clearTagsList())
		}
	}, [articles.editedArticle])

	const onSubmit = async (body) => {
		await dispatch(fetchEditArticle([body, slug])).then(() => {
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
					defaultValue={articles.tags[i].content}
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
			<h1 className={classes['title']}>Edit article</h1>
			<label className={classes['label']}>Title</label>
			<input
				className={
					!errors.title
						? classes['input']
						: `${classes['input']} ${classes['error']}`
				}
				{...register('title', {
					defaultValue: articles.editedArticle?.title,
					required: 'Enter article title',
					message: 'noooooo',
				})}
				defaultValue={articles.editedArticle?.title}
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
					defaultValue: articles.editedArticle?.description,

					required: 'Enter description',
					validate: (v) => v.length > 0,
				})}
				placeholder='Title'
				defaultValue={articles.editedArticle?.description}
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
					defaultValue: articles.editedArticle?.body,
					required: 'Enter text',
					validate: (v) => v.length > 0,
				})}
				placeholder='Text'
				defaultValue={articles.editedArticle?.body}
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
