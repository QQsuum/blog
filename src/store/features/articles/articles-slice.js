import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'

const initialState = {
	articlesData: [],
	singleArticle: null,
	editedArticle: null,
	articleCurrentInfo: null,
	articlesCount: 0,
	page: '00',
	tags: [],
}

const createAutorizationHeader = (getState) => {
	return getState().login.token
		? {
				headers: {
					Authorization: `Token ${getState().login.token}`,
				},
		  }
		: null
}

export const fetchDeleteArticle = createAsyncThunk(
	'articles/fetchDeleteArticle',
	async (slug, { dispatch, getState }) => {
		const res = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
			headers: {
				Authorization: `Token ${getState().login.token}`,
			},
			method: 'DELETE',
		})
	}
)

export const setFavorited = createAsyncThunk(
	'articles/setFavorited',
	async ([slug, method], { dispatch, getState }) => {
		const res = await fetch(
			`https://blog.kata.academy/api/articles/${slug}/favorite`,
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Token ${getState().login.token}`,
				},
				method: method,
			}
		)
		const json = await res.json()
		console.log(json)
		dispatch(setUpdateArticle({ slug, json }))
		dispatch(setSingleArticle(json))
	}
)

export const getGlobalArticles = createAsyncThunk(
	'articles/getGlobalArticles',
	async (_, { dispatch, getState }) => {
		const token = createAutorizationHeader(getState)

		const res = await fetch(
			`https://blog.kata.academy/api/articles?offset=${
				getState().articles.page
			}`,
			token
		)
		const json = await res.json()
		dispatch(setGlobalArticles(json))
	}
)

export const getSingleArticle = createAsyncThunk(
	'articles/getSingleArticle',
	async (slug, { getState, dispatch }) => {
		const res = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
			headers: { Authorization: `Token ${getState().login.token}` },
		})
		const json = await res.json()
		dispatch(setSingleArticle(json))
	}
)

export const fetchNewArticle = createAsyncThunk(
	'article/fetchNewArticle',
	async (articleInfo, { getState }) => {
		const tagList = []
		getState().articles.tags.forEach((el) =>
			el.content ? tagList.push(el.content) : null
		)
		const body = { article: { ...articleInfo, tagList } }

		const res = await fetch('https://blog.kata.academy/api/articles', {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Token ${getState().login.token}`,
			},
			method: 'POST',
			body: JSON.stringify(body),
		})

		const json = await res.json()
		console.log(json)

		localStorage.removeItem('tags')
	}
)
export const fetchEditArticle = createAsyncThunk(
	'article/fetchEditArticle',
	async ([articleInfo, slug], { getState }) => {
		const tagList = []
		getState().articles.tags.forEach((el) =>
			el.content ? tagList.push(el.content) : null
		)
		const body = { article: { ...articleInfo, tagList } }

		const res = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Token ${getState().login.token}`,
			},
			method: 'PUT',
			body: JSON.stringify(body),
		})

		const json = await res.json()

		localStorage.removeItem('tags')
	}
)

export const articlesSlice = createSlice({
	name: 'articles',
	initialState,
	reducers: {
		setChangesEditedArticle: (state, action) => {
			console.log(action.payload)
			switch (action.payload.name) {
				case 'title':
					state.singleArticle.title = action.payload.content
					break
				case 'body':
					state.singleArticle.body = action.payload.content
					break
				case 'description':
					state.singleArticle.description = action.payload.content
					break
				case 'tagList':
					const ind = action.payload.ind
					state.editedArticle.tagList[ind] = action.payload.content
					break
			}
		},
		getEditedArticle: (state) => {
			state.editedArticle = state.singleArticle
		},
		clearTagsList: (state) => {
			state.tags = []
		},
		setTagChange: (state, action) => {
			const ind = state.tags.findIndex((el) => el.id == action.payload.id)
			state.tags.splice(ind, 1, action.payload)
		},
		setCreatedTag: (state, action) => {
			state.tags.push(action.payload)
		},
		setDeletedTag: (state, action) => {
			state.tags = state.tags.filter((el) => el.id !== action.payload)
		},

		setGlobalArticles: (state, action) => {
			state.articlesData = action.payload.articles
			state.articlesCount = action.payload.articlesCount
		},
		setSingleArticle: (state, action) => {
			state.singleArticle = action.payload.article
		},
		setPage: (state, action) => {
			state.page = action.payload
		},
		resetSingleArticle: (state) => {
			state.singleArticle = null
		},
		setUpdateArticle: (state, action) => {
			const ind = current(state.articlesData).findIndex(
				(el) => el.slug === action.payload.slug
			)
			state.articlesData[ind] = action.payload.json.article
		},
	},
})
export const {
	getEditedArticle,
	setChangesEditedArticle,
	setCreatedTag,
	setTagChange,
	setDeletedTag,
	setGlobalArticles,
	setSingleArticle,
	setPage,
	resetSingleArticle,
	clearTagsList,
	setUpdateArticle,
} = articlesSlice.actions
export default articlesSlice
