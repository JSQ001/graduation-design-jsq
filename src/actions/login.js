/**
 * Created by zaranengap on 2017/7/3.
 */
import {cac} from 'share/utils'

export const INPUT_USERNAME = 'INPUT_USERNAME'
export const INPUT_PASSWORD = 'INPUT_PASSWORD'

export const SET_USER = 'SET_USER'

export const inputUsername = cac(INPUT_USERNAME, 'value')
export const inputPassword = cac(INPUT_PASSWORD, 'value')
export const setUser = cac(SET_USER, 'user')
