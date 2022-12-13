import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
	fetchResult: null,
	token: null,
	usernameError: '',
	emailError: '',
	passwordError: '',
	loginError: '',
}

export const fetchSignUpUser = createAsyncThunk(
	'login/fetchSignUpUser',
	async (userData, {  dispatch }) => {
		const filtred = Object.entries(userData).filter(
			(el, i) =>
				el[0] === 'username' || el[0] === 'password' || el[0] === 'email'
		)
		const body = {
			user: Object.fromEntries(filtred),
		}

		const res = await fetch('https://blog.kata.academy/api/users', {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(body),
		})
		const json = await res.json()
		if (json.errors) {
			for (let i in json.errors) {
				switch (i) {
					case 'email':
						dispatch(setEmailError(json.errors[i]))
						break
					case 'username':
						dispatch(setUsernameError(json.errors[i]))
						break
				}
			}
		} else if (json.user.token) {
			dispatch(setFetchResult(json))
			localStorage.setItem('token', json.user.token)
		}
	}
)

export const fetchSignInUser = createAsyncThunk(
	'login/fetchSignInUser',
	async (userData, {  dispatch }) => {
		const body = {
			user: userData,
		}

		const res = await fetch('https://blog.kata.academy/api/users/login', {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(body),
		})
		const json = await res.json()

		if (json.errors) {
			dispatch(
				setLoginError(`Email or password ${json.errors['email or password']}`)
			)
		} else if (json.user.token) {
			dispatch(setFetchResult(json))
			localStorage.setItem('token', json.user.token)
		}
	}
)

export const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		setUsernameError: (state, action) => {
			state.usernameError = action.payload
		},
		setEmailError: (state, action) => {
			state.emailError = action.payload
		},
		setPasswordError: (state, action) => {
			state.passwordError = action.payload
		},
		setPasswordRepeatError: (state, action) => {
			state.passwordRepeatError = action.payload
		},

		setLoginError: (state, action) => {
			state.loginError = action.payload
		},

		setFetchResult: (state, action) => {
			state.fetchResult = action.payload
			state.token = action.payload.user.token
		},
		setToken: (state, action) => {
			state.token = action.payload
		},

		setLogout: (state) => {
			state.token = ''
		},
	},
})
export const {
	setEmailError,
	setPasswordError,
	setUsernameError,
	setFetchResult,
	setToken,
	setLogout,
	setLoginError,
} = loginSlice.actions
export default loginSlice
