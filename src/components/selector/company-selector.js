/**
 * Created by 13576 on 2017/9/20.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Modal,Form } from 'antd'
import httpFetch from 'share/httpFetch'
import SearchArea from 'components/search-area'
import 'styles/components/selector/company-selector.scss'

class CompanySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns :[
        {title: '公司代码', dataIndex: 'companyCode', key: 'companyCode',},
        {title: '公司名称', dataIndex: 'companyName', key: 'companyName',},
        {title: '公司类型', dataIndex: 'companyType', key: 'companyType',}
        ],
      data:[
        {companyId:123,companyCode:'code1',companyName:'companyName1',companyType:'type1',isEnabled:'true' },
        {companyId:124,companyCode:'code2',companyName:'companyName2',companyType:'type2',isEnabled:'true' },
        {companyId:125,companyCode:'code3',companyName:'companyName3',companyType:'type3',isEnabled:'true' },
        {companyId:126,companyCode:'code4',companyName:'companyName4',companyType:'type4',isEnabled:'true' },
      ],
      searchForm:[
        {type: 'input', id: 'companyCode', label: '公司代码'},
        {type: 'input', id: 'companyName', label: '公司名称'},
        {
          type: 'multiple',
          id: 'companyCodeForm',
          label: '公司代码从',
          options: [],
          event: 'COMPANY_CODE_FORM',
          needSearch: false
        },
        {
          type: 'multiple',
          id: 'companyCodeTo',
          label: '公司代码到',
          options: [],
          event: 'COMPANY_CODE',
          needSearch: false
        },
      ],
      searchParams: {
        companyCode: "",
        companyName: "",
        companyCodeForm:'',
        companyCodeTo:'',

      },
      pagination: {
        total: 0
      },
      page:0,
      pageSize:10,
      selectedRowKeys: [],
      selectedRows:[],
      loading: false,
      visible:this.props.visible
    };


  }

//搜索
  search(){

  }

  //清空搜索
  clear = () => {
    this.setState({searchParams: {
      companyCode: "",
      companyName: "",
      companyCodeForm:'',
      companyCodeTo:'',
    }})
  };

  //选择公司
  ChangeSumHandle=(selectedRowKeys,selectedRows)=>{
    this.setState({
      selectedRows:selectedRows
    });
  }

  //保存
  saveSelect=()=>{
    this.setState({
      selectedRowKeys: [],
    });
    this.props.submitHandle(this.state.selectedRows);

  }

//取消
  cancelHandle=()=>{
    this.props.onCancel();
  }



  render(){
    const {searchForm,columns,data,pagination,visible}=this.state
    const rowSelection={
      onChange:this.ChangeSumHandle
    }
    return (
      <Modal
        visible={this.props.visible}
        title="分配公司"
        onCancel={this.cancelHandle}
      >
      <div className="company-select">
        <div className="search-from">
          <SearchArea
            searchForm={searchForm}
            submitHandle={this.search}
            clearHandle={this.clear}
            eventHandle={this.searchEventHandle}/>
        </div>
        <div className="table">
          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            rowSelection={rowSelection}
            bordered
          size="middle"
          />
        </div>
        <div className="slide-footer">
          <Button type="primary"   onClick={this.saveSelect}>确 定</Button>
          <Button onClick={this.cancelHandle}>取 消</Button>
        </div>


      </div>
      </Modal>
    )
  }

}

CompanySelect.propTypes = {
  visible:React.PropTypes.bool,
  submitHandle:React.PropTypes.func.isRequired,
  onCancel:React.PropTypes.func.isRequired,

};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(CompanySelect));
