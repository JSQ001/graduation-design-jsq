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
        {type:'select',label: this.props.intl.formatMessage({id:"budget.versionStatus"}) ,id:'status',
          options:
            [
              {value:'NEW',label:this.props.intl.formatMessage({id:"budget.new"})},
              {value:'CURRENT',label:this.props.intl.formatMessage({id:"budget.current"})},
              {value:'HISTORY',label:this.props.intl.formatMessage({id:"budget.history"})}

            ]

        },
        {type:'date',label:this.props.intl.formatMessage({id:"budget.versionDate"}),id:'versionDate'},
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.versionDescription"}), id: 'description', message:this.props.intl.formatMessage({id:"common.please.enter"})},
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
      page:0,
      pageSize:10

    }

  }

  //编辑启用
  onChangeEnabled = (e, record) => {
    console.log(e);
    console.log(record);
    let data = record;
    data.isDefined = e.target.checked;
    httpFetch.put(`${config.budgetUrl}/api/budget/version/assign/companies`, data).then(response => {
     this.getAssignCompanyList();
    }).catch(

    )
  };




  componentWillMount(){
    console.log(this.props);
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
      console.log(response.data);
      data = response.data;
      let statusData = response.data.status;
      response.data.organizationName = this.props.organization.organizationName;
      let info={
        ...response.data,
        status:{
          key:statusData,
          label:statusData=="NEW"?this.props.intl.formatMessage({id:"budget.new"}):(statusData=="CURRENT"?this.props.intl.formatMessage({id:"budget.current"}):this.props.intl.formatMessage({id:"budget.history"}))
        }
      }
      this.setState({
        formData:data,
        infoDate:info
      })
    }).catch(e=>{
    });
  }


  //查询分配公司表
  getAssignCompanyList=()=>{
    this.setState({
      loading:true
    })
    httpFetch.get(`${config.budgetUrl}/api/budget/version/assign/companies/query/${this.props.params.versionId}`).then((response)=>{
      this.setState({
        data:response.data,
        loading:false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager,
          pageSize: this.state.pageSize,
          current: this.state.page + 1
        }
      })
    }).catch((e)=>{
      this.setState({
        loading:false,

      })
    })

  }

  //分页点击
  onChangePager = (page) => {
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getAssignCompanyList();
      })
  };



  handleEdit = () => {
    this.setState({edit: true})
  };

  showImport=(value)=>{
    this.setState({showImportFrame:value})
  }

  //弹窗中，按确定，立即保存公司
  saveCompany=(values)=>{
    console.log(values);
    httpFetch.post(`${config.budgetUrl}/api/budget/version/assign/companies/batch`, values).then((res)=>{
      console.log(res.data);
      message.success("成功");
      this.setState({

      })
      this.getAssignCompanyList();
    }).catch((e)=>{
      if(e.response){
        message.error(`${e.response.data.validationErrors[0].message}`);
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
      let newData ={
        "companyCode":data[a].code,
        "companyName":data[a].name,
        "companyId": data[a].id,
        "versionId":this.props.params.id,
        "isEnabled":isEnabled,
        "companyTypeName":data[a].companyTypeName,
      }
      //保存
     dataValue.push(newData)
    //  this.state.data.push(newData)
    }

      this.saveCompany(dataValue);

    console.log(dataValue)

    this.setState({

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
        message.error(`${e.response.data.message}`);
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
                        type='version_company'
                        extraParams={{"versionId":this.props.params.versionId}}
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
