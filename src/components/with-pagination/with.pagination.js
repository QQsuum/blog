import { Pagination } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import { setPage } from '../../store/features/articles/articles-slice'
import { getGlobalArticles } from '../../store/features/articles/articles-slice'
import classes from './with-pagination.module.scss'

const WithPagination = (props) => {
	const dispatch = useDispatch()
	const onPageChange = (page) => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		})
		page = page * props.itemsOnPage - props.itemsOnPage
		dispatch(setPage(page))
		dispatch(getGlobalArticles())
	}
	
	return (
		<div className={classes['pagination']}>
			<Pagination
				hideOnSinglePage={true}
				pageSize={props.itemsOnPage}
				total={props.articlesCount}
				showSizeChanger={false}
				showQuickJumper={false}
				onChange={(page) => onPageChange(page)}
			/>
		</div>
	)
}
export default WithPagination
