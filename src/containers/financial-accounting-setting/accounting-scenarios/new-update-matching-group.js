/**
 * created by jsq on 2018/01/02
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Badge, Form, Input, Switch, Icon, InputNumber} from 'antd'
import SlideFrame from 'components/slide-frame'
import NewUpdateScenariosSystem from 'containers/financial-accounting-setting/accounting-scenarios-system/new-update-scenarios-system'
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import 'styles/financial-accounting-setting/accounting-scenarios/new-update-matching-group.scss'
const FormItem = Form.Item;

class NewUpdateMatchingGroup extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      isEnabled: true,
      data: [{id: 1}],
      selectedRowKeys: [],
      pagination: {
        current: 1,
        page: 0,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      },
      columns: [
        {          /*核算要素*/
          title: formatMessage({id:"accounting.scenarios.elements"}), key: "scenariosCode", dataIndex: 'scenariosCode'
        },
        {          /*要素性质*/
          title: formatMessage({id:"accounting.matching.elements.nature"}), key: "scenariosName", dataIndex: 'scenariosName'
        },
        {           /*匹配字段*/
          title: formatMessage({id:"accounting.match.field"}), key: 'status', dataIndex: 'isEnabled',
        },
      ],
      selectedEntityOIDs: []    //已选择的列表项的OIDs
    };
  }

  handleLinkElement = (e, record,index)=>{
    this.context.router.push(menuRoute.getMenuItemByAttr('accounting-scenarios-system', 'key').children.accountingElements.url.replace(':id', record.id))
  };

  componentWillMount() {
    this.getList();
  }

  getList(){}

  handleSearch = (params)=>{
    console.log(params)
  };

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
    let temp = this.state.pagination;
    temp.page = pagination.current-1;
    temp.current = pagination.current;
    temp.pageSize = pagination.pageSize;
    this.setState({
      loading: true,
      pagination: temp
    }, ()=>{
      this.getList();
    })
  };

  handleSave = (e)=>{
    e.preventDefault();
    alert(1)
    this.props.close(true)
  };

  handleCancel = ()=>{
    this.props.close(false)
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  };


  //列表选择更改
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  //选择一行
  //选择逻辑：每一项设置selected属性，如果为true则为选中
  //同时维护selectedEntityOIDs列表，记录已选择的OID，并每次分页、选择的时候根据该列表来刷新选择项
  onSelectRow = (record, selected) => {
    let temp = this.state.selectedEntityOIDs;
    if(selected)
      temp.push(record.id);
    else
      temp.delete(record.id);
    this.setState({
      selectedEntityOIDs: temp,
    })
  };

  //全选
  onSelectAllRow = (selected) => {
    let temp = this.state.selectedEntityOIDs;
    if(selected){
      this.state.data.map(item => {
        temp.addIfNotExist(item.id)
      })
    } else {
      this.state.data.map(item => {
        temp.delete(item.id)
      })
    }
    this.setState({
      selectedEntityOIDs: temp,
    })
  };

  //换页后根据OIDs刷新选择框
  refreshRowSelection(){
    let selectedRowKeys = [];
    this.state.selectedEntityOIDs.map(selectedEntityOID => {
      this.state.data.map((item, index) => {
        if(item.id === selectedEntityOID)
          selectedRowKeys.push(index);
      })
    });
    this.setState({ selectedRowKeys });
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { formatMessage} = this.props.intl;
    const { loading, data, columns, searchForm, pagination, isEnabled, selectedRowKeys,selectedEntityOIDs } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 0 },
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelectRow,
      onSelectAll: this.onSelectAllRow
    };

    return(
      <div className="new-update-matching-group">
        <div className="matching-group-form">
          <div className="matching-group-circle">1</div>
          <span className="matching-group-form-tips">{formatMessage({id:"matching.group.basicInfo"})}</span>
          <Form>
            <FormItem {...formItemLayout} label={formatMessage({id:'matching.group.code'})  /*匹配组代码*/}>
              {getFieldDecorator('scenariosName', {
                rules: [{
                  required: true,
                  message: formatMessage({id: "common.please.enter"})
                }]
              })(
                <Input placeholder={formatMessage({id:"common.please.enter"})}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({id:'matching.group.name'})  /*匹配组名称*/}>
              {getFieldDecorator('scenariosName', {
                rules: [{
                  required: true,
                  message: formatMessage({id: "common.please.enter"})
                }]
              })(
                <Input placeholder={formatMessage({id:"common.please.enter"})}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({id:'accounting.elements.nature'})  /*优先级*/}>
              {getFieldDecorator('scenariosName', {
                rules: [{
                  required: true,
                  message: formatMessage({id: "common.please.enter"})
                }]
              })(
                <InputNumber placeholder={formatMessage({id:"common.please.enter"})}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout}
                      label={formatMessage({id:"common.column.status"})} colon={true}>
              {getFieldDecorator('isEnabled', {
                valuePropName:"checked",
                initialValue: isEnabled
              })(
                <div>
                  <Switch defaultChecked={isEnabled}  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                  <span className="enabled-type" style={{marginLeft:20,width:100}}>{ isEnabled ? formatMessage({id:"common.status.enable"}) : formatMessage({id:"common.disabled"}) }</span>
                </div>)}
            </FormItem>
          </Form>
          <div className="matching-group-circle">1</div>
          <span className="matching-group-form-tips">{formatMessage({id:"accounting.scenarios.elements"})}</span>
          <span className="matching-group-form-label">{formatMessage({id:"accounting.scenarios.elements.select"})}</span>
        </div>
        <div className="accounting-matching-table-head">
          <Icon type="info-circle" style={{color:'#1890ff'}} className="head-icon"/>
          {formatMessage({id:"accounting.total"},{total:pagination.total}) +formatMessage({id:"accounting.selected"},{count:selectedEntityOIDs.length})}
          <a className="info-clear" onClick={()=>{this.setState({selectedEntityOIDs: [],selectedRowKeys: []})}}>{formatMessage({id:"common.clear"})}</a>
        </div>

        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={pagination}
          rowSelection={rowSelection}
          onChange={this.onChangePager}
          bordered
          size="middle"/>

        <div className="slide-footer">
          <Button type="primary" onClick={this.handleSave}  loading={this.state.loading}>{formatMessage({id:"common.save"})}</Button>
          <Button onClick={this.handleCancel}>{formatMessage({id:"common.cancel"})}</Button>
        </div>
      </div>
    )
  }
}


NewUpdateMatchingGroup.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {}
}
const WrappedNewUpdateMatchingGroup = Form.create()(NewUpdateMatchingGroup);
export default connect(mapStateToProps)(injectIntl(WrappedNewUpdateMatchingGroup));
