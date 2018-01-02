import ValueList from 'containers/setting/value-list/value-list'
import NewValueList from 'containers/setting/value-list/new-value-list'
import SecuritySetting from 'containers/setting/security-setting/security-setting'
import CallbackSetting from  'containers/setting/callback-setting/callback-setting'
import CodingRuleObject from 'containers/setting/coding-rule/coding-rule-object'
import CodingRule from 'containers/setting/coding-rule/coding-rule'
import NewCodingRuleObject from 'containers/setting/coding-rule/new-coding-rule-object'
import NewCodingRule from 'containers/setting/coding-rule/new-coding-rule'
import CodingRuleValue from 'containers/setting/coding-rule/coding-rule-value'
import CompanyMaintain from 'containers/setting/company-maintain/company-maintain'
import NewCompanyMaintain from 'containers/setting/company-maintain/new-company-maintain'
import CompanyMaintainDetail from 'containers/setting/company-maintain/company-maintain-detail'
import NewBankAccount from 'containers/setting/company-maintain/new-bank-account'
import BankAccountDetail from 'containers/setting/company-maintain/bank-account-detail'
import AddAuthorization from 'containers/setting/company-maintain/add-authorization'
import CompanyGroup from 'containers/setting/company-group/company-group'
import NewCompanyGroup from 'containers/setting/company-group/new-company-group'
import CompanyGroupDetail from 'containers/setting/company-group/company-group-detail'
import DepartmentGroup from 'containers/setting/department-group/department-group'
import DepartmentGroupDetail from 'containers/setting/department-group/department-group-detail'
import NewDepartmentGroup from 'containers/setting/department-group/new-department-group'
import SubjectSheet from 'containers/setting/subject-sheet/subject-sheet'
import NewSubjectSheet from 'containers/setting/subject-sheet/new-subject-sheet'
import SupplierType from 'containers/setting/supplier-type/supplier-type'
import AnnouncementInformation from 'containers/setting/announcement-information/announcement-information'
import AnnouncementInformationDetail from 'containers/setting/announcement-information/announcement-information-detail'
import SubjectSheetDetail from 'containers/setting/subject-sheet/subject-sheet-detail'

//设置
const setting = {
  key:'setting',
  icon: 'setting',
  admin: true,
  subMenu: [
    //值列表
    {
      key:'value-list',
      url:'/main/setting/value-list',
      components: ValueList,
      parent: 'setting',
      children: {
        //新建值列表
        newValueList: {
          key:'new-value-list',
          url:'/main/setting/value-list/new-value-list',
          components: NewValueList,
          parent: 'value-list'
        }
      }
    },
    //安全配置
    {
      key:'security-setting',
      url:'/main/setting/security-setting',
      components: SecuritySetting,
      parent: 'setting',
      children:{}
    },
    //回调设置
    {
      key:'callback-setting',
      url:'/main/setting/callback-setting',
      components:CallbackSetting,
      parent: 'setting',
      children:{}
    },
    //编码规则定义
    {
      key:'coding-rule-object',
      url:'/main/setting/coding-rule-object',
      components:CodingRuleObject,
      parent: 'setting',
      children:{
        //新建编码规则对象
        newCodingRuleObject: {
          key:'new-coding-rule-object',
          url:'/main/setting/coding-rule-object/new-coding-rule-object',
          components: NewCodingRuleObject,
          parent: 'coding-rule-object'
        },
        //编码规则
        codingRule: {
          key:'coding-rule',
          url:'/main/setting/coding-rule-object/coding-rule/:id',
          components: CodingRule,
          parent: 'coding-rule-object'
        },
        //编码规则明细
        codingRuleValue: {
          key:'coding-rule-value',
          url:'/main/setting/coding-rule-object/coding-rule/:id/coding-rule-value/:ruleId',
          components: CodingRuleValue,
          parent: 'coding-rule'
        },
        //新建编码规则
        newCodingRule: {
          key:'new-coding-rule',
          url:'/main/setting/coding-rule-object/coding-rule/:id/new-coding-rule',
          components: NewCodingRule,
          parent: 'coding-rule'
        }
      }
    },
    //公司维护
    {
      key:'company-maintain',
      url:'/main/setting/company-maintain',
      components:CompanyMaintain,
      parent: 'setting',
      children:{
        //新建公司
        newCompanyMaintain: {
          key:'new-company-maintain',
          url:'/main/setting/company-maintain/new-company-maintain',
          components:NewCompanyMaintain,
          parent:'company-maintain'
        },
        //公司维护详情
        companyMaintainDetail: {
          key:'company-maintain-detail',
          url:'/main/setting/company-maintain/company-maintain-detail/:companyOId/:companyId',
          components:CompanyMaintainDetail,
          parent: 'company-maintain'
        },
        //新建银行账户
        newBankAccount: {
          key:'new-bank-account',
          url:'/main/setting/company-maintain/new-bank-account/:companyId',
          components:NewBankAccount,
          parent: 'company-maintain'
        },
        //银行账户详情
        bankAccountDetail: {
          key:'bank-account-detail',
          url:'/main/setting/company-maintain/bank-account-detail/:companyBankId',
          components:BankAccountDetail,
          parent: 'company-maintain'
        },
        //添加授权
        addAuthorization: {
          key:'add-authorization',
          url:'/main/setting/company-maintain/add-authorization',
          components:AddAuthorization,
          parent: 'company-maintain'
        }
      }
    },
    //公司组
    {
      key: 'company-group',
      url: '/main/setting/company-group',
      components: CompanyGroup,
      parent: 'setting',
      children: {
        //新建公司组
        newCompanyGroup: {
          key: 'new-company-group',
          url: '/main/setting/company-group/new-company-group',
          components: NewCompanyGroup,
          parent: 'company-group',
        },
        //公司组详情
        companyGroupDetail: {
          key: 'company-group-detail',
          url: '/main/setting/company-group/company-group-detail/:id',
          components: CompanyGroupDetail,
          parent: 'company-group',
        }
      }
    },
    //部门组
    {
      key: 'department-group',
      url: '/main/setting/department-group',
      components: DepartmentGroup,
      parent: 'setting',
      children: {
        //新建部门组
        newDepartmentGroup: {
          key: 'new-department-group',
          url: '/main/setting/department-group/new-department-group',
          components: NewDepartmentGroup,
          parent: "department-group"
        },
        //部门组详情
        departmentGroupDetail: {
          key: 'department-group-detail',
          url: '/main/setting/department-group/department-group-detail/:id',
          components: DepartmentGroupDetail,
          parent: 'department-group'
        }
      }
    },
    //科目表定义
    {
      key: 'subject-sheet',
      url: '/main/setting/subject-sheet',
      components: SubjectSheet,
      parent: 'setting',
      children: {
        //科目表详情
          subjectSheetDetail: {
          key:'subject-sheet-detail',
          url:'/main/setting/subject-sheet/subject-sheet-detail/:accountSetId',
          components:SubjectSheetDetail,
          parent: 'subject-sheet'
        }
      }
    },
    //公告信息
    {
      key: 'announcement-information',
      url: '/main/setting/announcement-information',
      components: AnnouncementInformation,
      parent: 'setting',
      children:{
        //公告信息详情
        announcementInformationDetail: {
          key: 'announcement-information-detail',
          url: '/main/setting/announcement-information/announcement-information-detail/:id',
          components: AnnouncementInformationDetail,
          parent: 'setting'
        }
      }
    },
    //供应商类型定义
    {
      key: 'supplier-type',
      url: '/main/setting/supplier-type',
      components: SupplierType
    }
  ]
};

export default setting
