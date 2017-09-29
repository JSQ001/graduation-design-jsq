/**
 * Created by 13576 on 2017/9/18.
 */
import React from 'React'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Table, Button, notification, Icon,Checkbox, Badge, Row, Col, Input, Switch, Dropdown, Alert, Modal, Upload,Select,DatePicker,message} from 'antd';
const Option = Select.Option;
const FormItem =Form.Item;
import moment from 'moment'

import config from 'config'
import httpFetch from 'share/httpFetch'
import CompanySelect from 'components/selector/company-selector'
import ListSelector from 'components/list-selector'
import BasicInfo from 'components/basic-info'

import 'styles/budget/budget-versions/budget-versions-detail.scss'


class BudgetVersionsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateState: false,
      data: [],
      columns: [{
        title: '公司代码', dataIndex: 'companyCode', key: 'companyCode',},
        {title: '公司名称', dataIndex: 'companyName', key: 'companyName',},
        {title: '公司类型', dataIndex: 'companyType', key: 'companyType',},
        {title: '启用', dataIndex: 'isEnabled', key: 'isEnabled',
          render:(text,recode)=>{return <Checkbox defaultChecked={recode?true:false} onChange={this.isEnabledEditHandle(text,recode)}  />}

        }],
      infoDate:[],
      infoList: [
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.versionCode"}), id: 'organizationName', message: this.props.intl.formatMessage({id:"common.please.enter"}), disabled: true},
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.versionCode"}), id: 'versionCode', message:this.props.intl.formatMessage({id:"common.please.enter"}), disabled: true},
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.versionName"}), id: 'versionName', message:this.props.intl.formatMessage({id:"common.please.enter"})},
        {type:'select',label: this.props.intl.formatMessage({id:"budget.status"}) ,id:'status',
          options:
            [
              {value:'NEW',label:this.props.intl.formatMessage({id:"budget.new"})},
              {value:'CURRENT',label:this.props.intl.formatMessage({id:"budget.current"})},
              {value:'HISTORY',label:this.props.intl.formatMessage({id:"budget.history"})}

            ]

        },
        {type:'date',label:this.props.intl.formatMessage({id:"budget.versionDate"}),id:'versionDate'},
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.description"}), id: 'description', message:this.props.intl.formatMessage({id:"common.please.enter"})},
        {type: 'switch', label:this.props.intl.formatMessage({id:"budget.isEnabled"}), id: 'isEnabled'}
      ],
      pagination: {
        total: 0
      },
      showImportFrame: false,
      optionData:[{value:"NEW",label:this.props.intl.formatMessage({id:"budget.new"})},{value:"CURRENT",label:this.props.intl.formatMessage({id:"budget.current"})},{value:"HISTORY",label:this.props.intl.formatMessage({id:"budget.history"})}],
      edit: false,
      formData:{},
      loading:true,
      newAssignCompanyDate:[],
      putAssignCompanyDate:[],
      page:0,
      pageSize:10

    }

  }

//编辑启用
  isEnabledEditHandle(text,recode){

  }


  componentWillMount(){
    console.log(this.props)

    httpFetch.get(`${config.budgetUrl}/api/budget/versions/${this.props.params.versionId}`, ).then((response)=>{
      response.data.organizationName = this.props.organization.organizationName;
      let date =response.data.versionDate;
      this.setState({ formData:response.data,infoDate: response.data});
    }).catch(e=>{});
    this.getAssignCompanyList();
    console.log(this.state.infoDate)
  }


  AssignCompanyHandle=()=>{

  }

  //获得详情数据
  getDetail(){
    console.log(this.props)
    let data ={}
    httpFetch.get(`${config.budgetUrl}/api/budget/versions/${this.props.params.versionId}`, ).then((response)=>{
      data = response.data;
      const dataValue={
        ...data,
        'organizationName':this.prototype.organization.organizationName,
        'versionDate':data.versionDate?data.versionDate.format('YYYY-MM-DD'):''
      }

      this.setState({
        formData:response.data,
        infoDate:dataValue
      })
    }).catch(e=>{
    });
  }


  //查询分配公司表
  getAssignCompanyList=()=>{
    console.log(this.props);
    httpFetch.get(`${config.budgetUrl}/api/budget/version/assign/companies/query?versionId=${this.props.params.versionId}&page=${this.state.page}&size=${this.state.pageSize}`).then((res)=>{
      this.setState({loading: false ,data:res.data});
    }).catch((e)=>{
    })

  }






  handleEdit = () => {
    this.setState({edit: true})
  };

  showImport=(value)=>{
    this.setState({showImportFrame:value})
  }


  infoDateChangeHandle=()=>{
    this.versionAssignCompany(this.state.newAssignCompanyDate);
  }

  //保存新建分配公司
  versionAssignCompany=(values)=>{
    httpFetch.post(`${config.budgetUrl}/api/budget/version/assign/companies/batch`, values).then((res)=>{
      message.success(this.props.intl.formatMessage({id:"common.operate.success"}));
    }).catch((e)=>{
      if(e.response){
        message.error(`${this.props.intl.formatMessage({id:"common.operate.error"})},${e.response.data.validationErrors[0].message}`);
      } else {
        console.log(e)
      }
    })
  }


//分配公司确定
  submitHandle=(value)=>{
    const isEnabled = true;
    let dataValue=[];
    for(let a=0;a<value.length;a++){
      const newData ={
        "companyCode":value[a].companyCode,
        "companyName":value[a].companyName,
        "companyId": value[a].companyId,
        "versionId":this.props.params.id,
        "isEnabled":isEnabled
      }
      dataValue.push(newData)
      this.state.data.push(newData)
    }

    console.log(dataValue)

    this.setState({

      newAssignCompanyDate:dataValue

    })

    this.showImport(false)
  }

  CancelHandle=()=>{
    this.showImport(false)
  }

  //修改预算版本
  updateHandleInfo=(value)=>{
    console.log(value);
     let valueDate = value.versionDate?value.versionDate.format('YYYY-MM-DD'):'';
    const infoData={
      ...this.state.infoDate,
      'versionDate':valueDate,
      'status':value.status,
      'description':value.description,
      'isEnabled':value.isEnabled
    }
    httpFetch.put(`${config.budgetUrl}/api/budget/versions`,infoData).then((response)=>{
     const data = response.data;
     const valueData={
       ...data,
       'organizationName':this.props.organization.organizationName
     }
     console.log(valueData)
      this.setState({
        infoDate:valueData,
        updateState: true,
      })
      message.success(this.props.intl.formatMessage({id:"common.operate.success"}));
    }).catch((e)=>{
      if(e.response){
        console.log(e.response.data);
        message.error(`${this.props.intl.formatMessage({id:"common.operate.error"})},${e.response.data.validationErrors[0].message}`);
      }
    });

  }

  render(){
    const {  edit, data, columns, pagination,formData,infoDate,infoList,updateState} = this.state;
    return (
      <div>
        <div className="budget-versions-detail">
          <div className="common-help">
            <Alert
              message="帮助提示"
              description="一个预算组织下的版本代码不可重复，一个预算组织下只能有一个当前版本，一个预算组织下允许多个预算版本同时生效。"
              type=""
              showIcon
            />
          </div>

          {console.log(infoDate)}
          <BasicInfo infoList={infoList}
                     infoData={infoDate}
                     updateHandle={this.updateHandleInfo}
                     updateState={updateState}/>

          <div className="table-header">
            <div className="table-header-title">{this.props.intl.formatMessage({id:"common.total"}).replace('{total}',this.state.pagination.total)}</div>
            <div className="table-header-buttons">
              <Button type="primary" onClick={() => this.showImport(true)}>分配公司</Button>
              <Button onClick={this.infoDateChangeHandle}>{this.props.intl.formatMessage({id:"common.save"})}</Button>
            </div>
          </div>
          <Table columns={columns}
                 dataSource={data}
                 pagination={pagination}
                 bordered
                 size="middle"
          />

          <CompanySelect  visible={this.state.showImportFrame} submitHandle={this.submitHandle} onCancel={this.CancelHandle}/>

        </div>
      </div>
    )
  }

}



function mapStateToProps(state) {
  return {
    organization:state.budget.organization
  }
}
export default connect(mapStateToProps)(injectIntl(BudgetVersionsDetail));
