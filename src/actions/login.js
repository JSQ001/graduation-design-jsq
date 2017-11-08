/**
 * Created by zaranengap on 2017/7/3.
 */
import {cac} from 'share/utils'

export const SET_USER = 'SET_USER'
export const SET_PROFILE = 'SET_PROFILE'
export const SET_COMPANY = 'SET_COMPANY'
export const SET_USER_ORGANIZATION = 'SET_USER_ORGANIZATION'
export const SET_COMPANY_CONFIGURATION = 'SET_COMPANY_CONFIGURATION'

export const setUser = cac(SET_USER, 'user')
export const setProfile = cac(SET_PROFILE, 'profile')
export const setCompany = cac(SET_COMPANY, 'company')
export const setUserOrganization = cac(SET_USER_ORGANIZATION, 'organization')
export const setCompanyConfiguration = cac(SET_COMPANY_CONFIGURATION, 'companyConfiguration')
