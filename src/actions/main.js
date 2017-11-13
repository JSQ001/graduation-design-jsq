/**
 * Created by zaranengap on 2017/7/4.
 */
import {cac} from 'share/utils'

export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_TENANT_MODE = 'SET_TENANT_MODE';

export const setCurrentPage = cac(SET_CURRENT_PAGE, 'currentPage');
export const setLanguage = cac(SET_LANGUAGE, 'language');
export const setTenantMode = cac(SET_TENANT_MODE, 'tenantMode');

