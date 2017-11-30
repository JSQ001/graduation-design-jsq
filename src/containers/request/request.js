import React  from 'react'
import httpFetch from 'share/httpFetch'
import config from 'config'
import SearchArea from 'components/search-area'

class MyAccount extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      checkboxListForm: [{
        id: 'status',
        single: true,
        items: [{label: '状态', key: 'statusWithReject', options: [
          {label: '编辑中', value: '10001001'},
          {label: '审批中', value: '10001002'},
          {label: '已驳回', value: '10021001'},
          {label: '已通过', value: '10001003'},
          {label: '已撤回', value: '10011001'},
          {label: '审核通过', value: '1004'},
          {label: '已驳回', value: '10031001'},
          {label: '已付款', value: '1005'},
          {label: '还款中', value: '1006'},
          {label: '已还款', value: '1007'},
          {label: '付款中', value: '1008'},
          {label: '已驳回', value: '1009'}
        ]}]
      }],
      searchForm: [
        {type: 'input', label: '申请人', id: 'keyword'}
      ]
    }
  }

  componentWillMount(){
    this.getForms();
  }

  getForms = () => {
    const { checkboxListForm } = this.state;
    httpFetch.get(`${config.baseUrl}/api/custom/forms/company/my/available/all/?formType=101`).then(res => {
      let formCheckBoxItem = {};
      let options = [];
      res.data.map(item => {
        options.push({label: item.formName, value: item.formOID})
      });
      formCheckBoxItem.id = 'formOID';
      formCheckBoxItem.items = [{label: '表单类型', key: 'formOID', options, checked: [], checkAllOption: true}];
      checkboxListForm.push(formCheckBoxItem);
      this.setState({ checkboxListForm })
    });
  };

  search = (e) => {
    console.log(e)
  };

  render(){
    const { checkboxListForm, searchForm } = this.state;
    return(
      <div>
        <h3 className="header-title">申请单</h3>
        <SearchArea searchForm={searchForm}
                    submitHandle={this.search}
                    checkboxListForm={checkboxListForm}/>
      </div>
    )
  }
}

export default MyAccount;
