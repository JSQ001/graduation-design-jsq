/**
 * Created by ZaraNengap on 2017/09/18
 */
import {cac} from 'share/utils'

export const SET_ORGANIZATION = 'SET_ORGANIZATION'
export const SET_ORGANIZATION_STRATEGY_ID = 'SET_ORGANIZATION_STRATEGY_ID'

export const setOrganization = cac(SET_ORGANIZATION, 'organization')
export const setOrganizationStrategyId = cac(SET_ORGANIZATION_STRATEGY_ID, 'strategyId')

