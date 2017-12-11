import React  from 'react'
import Importer from 'components/importer'
import SearchArea from 'components/search-area'
import { Button } from 'antd'
import config from 'config'

class MyAccount extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        searchForm: [
          {id: 'user', label: '人员', type: 'list', listType: 'user', labelKey: 'fullName', valueKey: 'userOID', event: 'USER_CHANGE'},
          {type: 'value_list', id:'flag', label: '金额 / 数量', isRequired: true, options: [], valueListCode: 2019, event: 'FLAG_CHANGE', entity: true},
          {type: 'select', id: 'setOfBooksId', label: '帐套', options: [], event: 'SET_OF_BOOKS_CHANGE', entity: true,
            getUrl: `${config.baseUrl}/api/setOfBooks/by/tenant`, method: 'get', labelKey: 'setOfBooksCode', valueKey: 'id', getParams: {roleType: 'TENANT'}},
          {
            type: 'combobox', id: 'combobox', label: '员工', placeholder: '请输入姓名／工号', options: [], searchUrl: `${config.baseUrl}/api/search/users`,
            method: 'get', searchKey: 'keyword', labelKey: 'fullName', valueKey: 'userOID', event: 'USER_COMBOBOX_CHANGE', entity: true
          },
          {
            type: 'multiple', id: 'legalEntity', label: '法人实体', options: [], getUrl: `${config.baseUrl}/api/v2/my/company/receipted/invoices?page=0&size=100`,
            method: 'get', labelKey: 'companyName', valueKey: 'companyReceiptedOID', event: 'ENTITY_CHANGE', entity: true
          }
        ]
      };
    }

    handleOk = (result) => {
      console.log(result)
    };

    eventHandle = (value, event) => {
      console.log(value, event)
    };

    ok = (e) => {
      console.log(e)
    };

    componentDidMount(){
      this.formRef._reactInternalInstance._renderedComponent._instance.setValues({
        setOfBooksId: {label: '测试', value: '123'}
      });
    }

    render(){
      const { searchForm } = this.state;
      return(
        <div>

          <SearchArea searchForm={searchForm}
                      eventHandle={this.eventHandle}
                      submitHandle={this.ok}
                      wrappedComponentRef={(inst) => this.formRef = inst}/>

          <Importer onOk={this.handleOk} title="导入数据"/>

        </div>
      )
    }
}

export default MyAccount;
