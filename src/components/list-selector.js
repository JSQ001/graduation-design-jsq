/**
 * Created By ZaraNengap on 2017/09/21
 */
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Modal, Table, Button } from 'antd'

import httpFetch from 'share/httpFetch'
import SearchArea from 'components/search-area'

/**
 * 联动static/selectorData.js文件
 * 该文件内存储各选择的页面渲染选项
 * 包括title、url、searchForm、columns、key
 * @params title  显示在页面上方的标题
 * @params url  获得数据的接口
 * @params searchForm  联动searchForm组件的参数，配置顶部搜索区域搜索项
 * @params columns  表格列配置
 * @params key  数据主键
 */
import selectorData from 'share/selectorData'

/**
 * 通用表格选择器组件
 * @params visible  是否可见，同Modal
 * @params onOk  点击OK后的方法，同Modal
 * @params onCancel  点击取消后的方法，同Modal
 * @params afterClose  关闭窗口后的方法，同Modal
 * @params type  选择器类型，配置在selectorData内
 * @params selectedData  默认选择的值，如果一个页面由多个ListSelector配置，则不同的选择项应该在后续多次选择时传入对应的选择项
 * @params extraParams  搜索时额外需要的参数,如果对象内含有组件内存在的变量将替换组件内部的数值
 * @params selectorItem  组件查询的对象，如果存在普通配置没法实现的可单独传入，例如参数在url中间动态变换时，表单项需要参数搜索时
 * @params single 是否单选,默认为false
 *
 * type与selectorItem不可共存，如果两者都有，selectorItem起作用
 *
 * 现在支持的选择方法：
 * user:  人员选择
 * budget_structure:  预算表
 */
class ListSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      page: 0,
      pageSize: 10,
      pagination: {
        total: 0
      },
      selectedData: [],  //已经选择的数据项
      selectorItem: {},  //当前的选择器类型数据项, 包含url、searchForm、columns
      searchParams: {},  //搜索需要的参数
      rowSelection: {
        type: this.props.single ? 'radio' : 'checkbox',
        selectedRowKeys: [],
        onChange: this.onSelectChange,
        onSelect: this.onSelectItem,
        onSelectAll: this.onSelectAll
      }
    };
  }

  search = (params) => {
    this.setState({
      page: 0,
      searchParams: params,
      loading: true
    }, () => {
      this.getList();
    })
  };

  clear = () => {
    let searchParams = {};
    this.state.selectorItem.searchForm.map(form => {
      searchParams[form.id] = form.defaultValue ? form.defaultValue : undefined;
    });
    this.setState({
      page: 0,
      searchParams: searchParams
    }, () => {
      this.getList();
    })
  };

  //得到数据
  getList(){
    let selectorItem = this.state.selectorItem;
    let searchParams = Object.assign(this.state.searchParams,this.props.extraParams);
    let url = `${selectorItem.url}?&page=${this.state.page}&size=${this.state.pageSize}`;
    for(let paramsName in searchParams){
      url += searchParams[paramsName] ? `&${paramsName}=${searchParams[paramsName]}` : '';  //遍历searchParams，如果该处有值，则填入url
    }
    return httpFetch.get(url).then((response)=>{
      response.data.map((item)=>{
        item.key = item[selectorItem.key];
      });
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager,
          current: this.state.page + 1
        }
      }, () => {
        this.refreshSelected();  //刷新当页选择器
      })
    });
  }

  onChangePager = (page) => {
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getList();
      })
  };

  /**
   * 判断this.props.type是否有变化，如果有变化则重新渲染页面
   * @param type
   */
  checkType(type){
    let selectorItem = selectorData[type];
    if(selectorItem){
      this.checkSelectorItem(selectorItem)
    }
  };

  checkSelectorItem(selectorItem){
    let searchParams = {};
    selectorItem.searchForm.map(form => {
      searchParams[form.id] = form.defaultValue ? form.defaultValue : undefined;  //遍历searchForm，取id组装成searhParams
    });
    this.setState({ selectorItem, searchParams }, () => {
      this.getList();
    })
  }

  /**
   * 每次父元素进行setState时调用的操作，判断nextProps内是否有type的变化
   * 如果selectedData有值则代表有默认值传入需要替换本地已选择数组，
   * 如果没有值则需要把本地已选择数组置空
   * @param nextProps 下一阶段的props
   */
  componentWillReceiveProps = (nextProps) => {
    if(nextProps.selectedData && nextProps.selectedData.length > 0)
      this.setState({ selectedData : nextProps.selectedData });
    else
      this.setState({ selectedData : [] });
    if(nextProps.type !== this.state.type && !nextProps.selectorItem)
      this.checkType(nextProps.type);
    else if(nextProps.selectorItem)
      this.checkSelectorItem(nextProps.selectorItem)
  };

  handleOk = () => {
    this.props.onOk({
      result: this.state.selectedData,
      type: this.props.type
    })
  };

  /**
   * 根据selectedData刷新当页selection
   */
  refreshSelected(){
    let { selectorItem, selectedData, data, rowSelection } = this.state;
    let nowSelectedRowKeys = [];
    selectedData.map(selected => {
      data.map(item => {
        if(item[selectorItem.key] === selected[selectorItem.key])
          nowSelectedRowKeys.push(item[selectorItem.key])
      })
    });
    rowSelection.selectedRowKeys = nowSelectedRowKeys;
    this.setState({ rowSelection });
  };

  //选项改变时的回调，重置selection
  onSelectChange = (selectedRowKeys, selectedRows) => {
    let { rowSelection } = this.state;
    rowSelection.selectedRowKeys = selectedRowKeys;
    this.setState({ rowSelection });
  };

  /**
   * 选择单个时的方法，遍历selectedData，根据是否选中进行插入或删除操作
   * @param record 被改变的项
   * @param selected 是否选中
   */
  onSelectItem = (record, selected) => {
    let { selectedData, selectorItem } = this.state;
    if(this.props.single){
      selectedData = [record];
    } else {
      if(!selected){
        selectedData.map((selected, index) => {
          if(selected[selectorItem.key] === record[selectorItem.key]){
            selectedData.splice(index, 1);
          }
        })
      } else {
        selectedData.push(record);
      }
    }
    this.setState({ selectedData });
  };

  //选择当页全部时的判断
  onSelectAll = (selected, selectedRows, changeRows) => {
    changeRows.map(changeRow => this.onSelectItem(changeRow, selected));
  };

  render() {
    const { visible, onCancel, afterClose } = this.props;
    const { data, pagination, loading, selectorItem, selectedData, rowSelection } = this.state;
    const { searchForm, columns, title } = selectorItem;
    return (
      <Modal title={title} visible={visible} onCancel={onCancel} afterClose={afterClose} width={800} onOk={this.handleOk} className="list-selector">
        <SearchArea searchForm={searchForm}
                    submitHandle={this.search}
                    clearHandle={this.clear}/>
        <div className="table-header">
          <div className="table-header-title">
            {this.props.intl.formatMessage({id: "common.total"}, {total: pagination.total})}{/* 共 total 条数据 */}
            &nbsp;<span>/</span>&nbsp;
            {this.props.intl.formatMessage({id: "common.total.selected"}, {total: selectedData.length === 0 ? '0' : selectedData.length})}{/* 已选 total 条 */}
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               bordered
               size="middle"
               rowSelection={rowSelection}/>
      </Modal>
    );
  }
}

ListSelector.propTypes = {
  visible: React.PropTypes.bool,  //对话框是否可见
  onOk: React.PropTypes.func,  //点击OK后的回调，当有选择的值时会返回一个数组
  onCancel: React.PropTypes.func,  //点击取消后的回调
  afterClose: React.PropTypes.func,  //关闭后的回调
  type: React.PropTypes.string,  //选择类型
  selectedData: React.PropTypes.array,  //默认选择的值id数组
  extraParams: React.PropTypes.object,  //搜索时额外需要的参数,如果对象内含有组件内存在的变量将替换组件内部的数值
  selectorItem: React.PropTypes.object,  //组件查询的对象，如果存在普通配置没法实现的可单独传入，例如参数在url中间动态变换时，表单项需要参数搜索时
  single: React.PropTypes.bool  //是否单选
};

ListSelector.defaultProps = {
  afterClose: () => {},
  extraParams: {},
  single: false
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(ListSelector));

