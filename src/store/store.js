import { composeWithDevTools } from '@redux-devtools/extension'
import { configureStore } from '@reduxjs/toolkit'
import { articlesSlice } from './features/articles/articles-slice'
import { loginSlice } from './features/login/login-slice'
import { userSlice } from './features/user/user-slice'

const store = configureStore(
	{
		reducer: {
			articles: articlesSlice.reducer,
			login: loginSlice.reducer,
			user: userSlice.reducer,
		},
	},
	composeWithDevTools()
)

export default store
