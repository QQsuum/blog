import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchDeleteArticle } from '../../store/features/articles/articles-slice'
import info from './info.png'
import classes from './modal.module.scss'

const ModalDelete = (props) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const deleteArticle = async (slug) => {
		await dispatch(fetchDeleteArticle(props.slug)).then(() => {
			navigate('/articles')
		})
	}
	
	return (
		<div
			className={
				props.active
					? classes['wrapper']
					: `${classes['wrapper']} ${classes['inactive']}`
			}
		>
			<div className={classes['modal']}>
				<div className={classes['top']}>
					<img src={info} className={classes['image']} />
					<div className={classes['text']}>
						Are you sure to delete this article?
					</div>
				</div>
				<div className={classes['bottom']}>
					<button
						className={classes['btn-no']}
						type='button'
						onClick={() => props.setModalActive(false)}
					>
						No
					</button>
					<button
						className={classes['btn-yes']}
						type='button'
						onClick={() => deleteArticle()}
					>
						Yes
					</button>
				</div>
			</div>
		</div>
	)
}
export default ModalDelete
