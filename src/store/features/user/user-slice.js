import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
	email: '',
	token: '',
	username: '',
	bio: '',
	image: 'no image',

	usernameError: '',
	emailError: '',

	editedResult: null,
}
export const getUser = createAsyncThunk(
	'user/getUser',
	async (token, {  dispatch }) => {
		const res = await fetch(`https://blog.kata.academy/api/user`, {
			headers: { Authorization: `Token ${token}` },
		})
		const json = await res.json()
		dispatch(setUser(json))
	}
)

export const fetchUpdateProfile = createAsyncThunk(
	'user/fetchUpdateProfile',
	async (userData, {  dispatch, getState }) => {
		const currentUsername = getState().user.username
		const currentEmail = getState().user.email

		let entries = Object.entries(userData)
		const filtred = entries.filter(
			(el) => el[1] && el[1] !== currentUsername && el[1] !== currentEmail
		)
		const body = { user: { ...Object.fromEntries(filtred) } }

		const res = await fetch(`https://blog.kata.academy/api/user`, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Token ${getState().login.token}`,
			},
		})
		const json = await res.json()
		if (json.errors) {
			for (let i in json.errors) {
				switch (i) {
					case 'email':
						dispatch(setEditingEmailError(json.errors[i]))
						break
					case 'username':
						dispatch(setEditingUsernameError(json.errors[i]))
						break
				}
			}
		} else {
			dispatch(setUser(json))
			dispatch(setEditedResult(json))
		}
	}
)

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action) => {
			const user = action.payload.user
			state.username = user.username
			state.email = user.email
			state.token = user.token
			state.bio = user.bio
			
			if (user.image) {
				state.image = user.image
			}
		},

		setEditedResult: (state, action) => {
			state.editedResult = action.payload
		},

		setEditingUsernameError: (state, action) => {
			state.usernameError = action.payload
		},
		setEditingEmailError: (state, action) => {
			state.emailError = action.payload
		},
		deleteUserInfo: (state, action) => {
			state.email = ''
			state.token = ''
			state.username = ''
			state.bio = ''
			state.image = 'no image'
		},
	},
})
export const {
	setUser,
	deleteUserInfo,
	setEditingEmailError,
	setEditingUsernameError,
	setEditedResult,
} = userSlice.actions
export default userSlice
