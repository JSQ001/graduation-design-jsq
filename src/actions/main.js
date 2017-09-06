/**
 * Created by zaranengap on 2017/7/4.
 */
import {cac} from 'share/utils'

export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_LANGUAGE = 'SET_LANGUAGE';

export const setCurrentPage = cac(SET_CURRENT_PAGE, 'currentPage');
export const setLanguage = cac(SET_LANGUAGE, 'language');

