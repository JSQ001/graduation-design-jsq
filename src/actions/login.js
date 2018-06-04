import {cac} from 'share/utils'

export const SET_USER = 'SET_USER';
export const SET_ROLE = 'SET_ROLE';

export const setUser = cac(SET_USER, 'user');
export const setRole = cac(SET_ROLE, 'role');
