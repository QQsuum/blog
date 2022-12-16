import { Pagination } from 'antd'
import useSelection from 'antd/es/table/hooks/useSelection'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPage } from '../../store/features/articles/articles-slice'
import { getGlobalArticles } from '../../store/features/articles/articles-slice'
import classes from './with-pagination.module.scss'

const WithPagination = (props) => {
	const articles = useSelector((store) => store.articles)
	const dispatch = useDispatch()

	const page = articles.page / props.itemsOnPage + 1

	useEffect(() => {
		const page = localStorage.getItem('page') ? localStorage.getItem('page') : 0
		dispatch(setPage(page))
		dispatch(getGlobalArticles())
	}, [])

	const onPageChange = (page) => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		})
		page = page * props.itemsOnPage - props.itemsOnPage
		dispatch(setPage(page))
		dispatch(getGlobalArticles())
		localStorage.setItem('page', page)
	}

	return (
		<div className={classes['pagination']}>
			<Pagination
				current={page}
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
