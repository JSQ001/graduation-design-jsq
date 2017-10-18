/**
 * Created by 13576 on 2017/9/18.
 */
import React from 'React'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Table, Button, notification, Icon,Checkbox, Badge, Row, Col, Input, Switch, Dropdown, Alert, Modal, Upload,Select,DatePicker,message} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

import config from 'config'
import httpFetch from 'share/httpFetch'

import 'styles/budget-setting/budget-organization/budget-versions/budget-versions-detail.scss'
import ListSelector from 'components/list-selector'
import BasicInfo from 'components/basic-info'

class BudgetVersionsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateState: false,
      data: [],
      columns: [
        {title: '公司代码', dataIndex: 'companyCode', key: 'companyCode',},
        {title: '公司名称', dataIndex: 'companyName', key: 'companyName',},
        {title: '公司类型', dataIndex: 'companyTypeName', key: 'companyTypeName',},
        {title: '启用', key: 'isEnabled', render: (isEnabled, record) => <Checkbox onChange={(e) => this.onChangeEnabled(e, record)} checked={record.isEnabled}/>}
      ],
      infoDate:{},
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
      loading:false,
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
  onChangeEnabled = (e, record) => {
    console.log("111111111111111111")
    this.setState({loading: true});
    record.isDefault = e.target.checked;
    httpFetch.put(`${config.budgetUrl}/api/budget/version/assign/companies`, record).then(response => {
        this.setState({loading: false})
    })
  };




  componentWillMount(){
    console.log(this.props);
    /*httpFetch.get(`${config.budgetUrl}/api/budget/versions/${this.props.params.versionId}`, ).then((response)=>{
      response.data.organizationName = this.props.organization.organizationName;
      let date =response.data.versionDate;
      this.setState({ formData:response.data,infoDate: response.data});
    }).catch(e=>{});*/
    this.getDetail();
    this.getAssignCompanyList();
    console.log(this.state.infoDate)

  }


  AssignCompanyHandle=()=>{

  }



  //获得详情数据
  getDetail=()=>{
    console.log("123123123")
    console.log(this.props)
    let data ={}
    httpFetch.get(`${config.budgetUrl}/api/budget/versions/${this.props.params.versionId}`, ).then((response)=>{
      data = response.data;
      response.data.organizationName = this.props.organization.organizationName;
      this.setState({
        formData:data,
        infoDate:data
      })
    }).catch(e=>{
    });
  }


  //查询分配公司表
  getAssignCompanyList=()=>{
    this.setState({
      loading:true
    })
    console.log("fdvdfvdsFGGGGGGGGGGGGGGGGGGg")
    httpFetch.get(`${config.budgetUrl}/api/budget/version/assign/companies/query?versionId=${this.props.params.versionId}&page=${this.state.page}&size=${this.state.pageSize}`).then((res)=>{
      this.setState({loading: false ,data:res.data});
    }).catch((e)=>{
      this.setState({
        loading:false
      })
    })

  }






  handleEdit = () => {
    this.setState({edit: true})
  };

  showImport=(value)=>{
    this.setState({showImportFrame:value})
  }


  infoDateChangeHandle=()=>{
    console.log("versionAssignCompany")
    this.versionAssignCompany(this.state.newAssignCompanyDate);
  }

  //保存新建分配公司
  versionAssignCompany=(values)=>{
    console.log(values);
    httpFetch.post(`${config.budgetUrl}/api/budget/version/assign/companies/batch`, values).then((res)=>{
      message.success(this.props.intl.formatMessage({id:"common.operate.success"}));
      this.getAssignCompanyList;
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
   const data =value.result;
    console.log(data);
    const isEnabled = true;
    let dataValue=[];
    for(let a=0;a<data.length;a++){
      const newData ={
        "companyCode":data[a].companyCode,
        "companyName":data[a].name,
        "companyId": data[a].id,
        "versionId":this.props.params.id,
        "isEnabled":isEnabled,
        "companyTypeName":data[a].companyTypeName,
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
     let valueDate = value.versionDate?value.versionDate.format('YYYY-MM-DD'):'';
    const infoData={
      ...this.state.infoDate,
      'versionName':value.versionName,
      'versionDate':valueDate,
      'status':value.status,
      'description':value.description,
      'isEnabled':value.isEnabled
    }
    httpFetch.put(`${config.budgetUrl}/api/budget/versions`,infoData).then((response)=>{
     const data = response.data;
     console.log(response.data);
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
     this.getDetail();
    }).catch((e)=>{
      if(e.response){
        console.log(e.response.data);
        message.error(`${this.props.intl.formatMessage({id:"common.operate.error"})},${e.response.data.validationErrors[0].message}`);
      }
    });

  }

  render(){
    const {  edit, data, columns, pagination,formData,infoDate,infoList,updateState} = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <div className="budget-versions-detail">
          <div className="common-help">
            <Alert
              message={formatMessage({id: 'common.help'})}
              description={formatMessage({id:'budget.newVersion.info'})}
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
            <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>
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

          <ListSelector visible={this.state.showImportFrame}
                        onOk={this.submitHandle}
                        onCancel={this.CancelHandle}
                        type='company'
                    />

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
