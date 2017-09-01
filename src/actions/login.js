/**
 * Created by zaranengap on 2017/7/3.
 */
import {cac} from 'share/utils'

export const SET_USER = 'SET_USER'
export const SET_PROFILE = 'SET_PROFILE'
export const SET_COMPANY = 'SET_COMPANY'

export const setUser = cac(SET_USER, 'user')
export const setProfile = cac(SET_PROFILE, 'profile')
export const setCompany = cac(SET_COMPANY, 'company')
