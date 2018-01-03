/**
 * created by jsq on 2017/12/27
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Input, Switch, Select, Form, Table,Spin, notification } from 'antd'
import httpFetch from 'share/httpFetch';
import config from 'config'
import 'styles/financial-accounting-setting/section-structure/section-mapping-set.scss'
import Chooser from 'components/chooser.js'

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

class DataStructure extends React.Component{
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      data:[{id:1,sectionValueCode:12}],
      isSelected: false,
      paramsKey: 0,
      selectedRowKeys: [],
      pagination: {
        current: 1,
        page: 0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      columns:[
        {          /*数据结构代码*/
          title: formatMessage({id:"data.structure.code"}), key: "sectionValueCode", dataIndex: 'sectionValueCode',
          render: (text, record, index) => this.renderColumns(text, record,index)
        },
        {          /*数据结构名称*/
          title: formatMessage({id:"data.structure.name"}), key: "sectionValueCode1", dataIndex: 'sectionValueCode1',
          render: (text, record, index) => this.renderColumns(text, record,index)
        },
        {          /*操作*/
          title: formatMessage({id:"common.operation"}), key: "operate", dataIndex: 'operate',
          render:(text, record, index) => (
            <span>
              <a href="#" onClick={(e) => this.handleUpdate(e, record,index)}>{formatMessage({id: "common.delete"})}</a>
            </span>)
        },
      ],
      selectedEntityOIDs: []    //已选择的列表项的OIDs
    };
  }

  renderColumns = (decode, record,index, dataIndex) => {
    const { paramValueMap,sourceType } = this.state;
    if( record.edit) {
      return (
        <Input placeholder={this.props.intl.formatMessage({id: 'common.please.enter'})}/>
      );
    }
  };

  componentWillMount(){
    this.getList();
  }

  getList(){}

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
      batchCompany: temp.length>0 ? false : true
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
      batchCompany: temp.length>0 ? false : true
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

  //清空选择框
  clearRowSelection(){
    this.setState({selectedEntityOIDs: [],selectedRowKeys: []});
  }

  handleAdd = ()=>{
    let { data, paramsKey } = this.state;
    if( data[0].sectionValueCode !== ""){
      let newParams = {sectionValueCode: '', sectionValueCode1:'', key: paramsKey++, edit: true};
      let array=[];
      array.push(newParams);
      let newArray =  array.concat(data);
      this.setState({ data: newArray,paramsKey});
    }else {
      notification.warning({
        message: `${this.props.intl.formatMessage({id: "section.notification.mapping"})}`,
        duration: 3,
      })
    }

  };

  onCancel = ()=>{
    this.props.close(false)
  };

  render(){
    const { formatMessage } = this.props.intl;
    const {loading, data, columns, pagination, isSelected, selectedRowKeys} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelectRow,
      onSelectAll: this.onSelectAllRow
    };
    return(
      <div className="section-mapping-set">
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})+" / "+formatMessage({id:"section.selected"},{selected:selectedRowKeys.length})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleAdd}>{formatMessage({id: 'common.add'})}</Button>  {/*添加*/}
            <Button disabled={!isSelected} onClick={this.handleDelete}>{formatMessage({id: 'common.delete'})}</Button>           {/*删除*/}
            <Search className="table-header-search"
                    placeholder={formatMessage({id:"accounting.source.data.placeholder"})}
                    onChange={e=>this.handleSearch(e)}
                    style={{ width: 320 ,marginLeft: 164}}/>
          </div>
        </div>
        <Table
          loading={loading}
          dataSource={data}
          rowSelection={rowSelection}
          columns={columns}
          pagination={pagination}
          onChange={this.onChangePager}
          bordered
          size="middle"/>
        <div className="slide-footer">
          <Button type="primary" htmlType="submit"  loading={this.state.loading}>{formatMessage({id:"common.save"})}</Button>
          <Button onClick={this.onCancel}>{formatMessage({id:"common.cancel"})}</Button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    company: state.login.company,
  }
}

const WrappedDataStructure = Form.create()(DataStructure);
export default connect(mapStateToProps)(injectIntl(WrappedDataStructure));
