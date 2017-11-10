import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import { Table, Button, Badge } from 'antd';
import httpFetch from 'share/httpFetch'

import SearchArea from 'components/search-area'
import SlideFrame from 'components/slide-frame'
import NewSetOfBooks from 'containers/finance-setting/set-of-books/new-set-of-books'

class SetOfBooks extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      page: 0,
      pageSize: 10,
      columns: [
        {title: "帐套代码", dataIndex: "setOfBooksCode"},
        {title: "帐套名称", dataIndex: "setOfBooksName"},
        {title: "会计期代码", dataIndex: "periodSetCode"},
        {title: "本位币", dataIndex: "functionalCurrencyCode"},
        {title: "科目表", dataIndex: "accountSetCode"},
        {title: "状态", dataIndex: 'enabled', render: enabled => (
          <Badge status={enabled ? 'success' : 'error'} text={enabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />)}
      ],
      pagination: {
        total: 0
      },
      searchForm: [
        {type: 'input', id: 'setOfBooksCode', label: "帐套代码"},
        {type: 'input', id: 'setOfBooksName', label: "帐套名称"}
      ],
      searchParams: {
        setOfBooksCode: '',
        setOfBooksName: ''
      },
      showSlideFrame: false,
      nowSetOfBooks: {}
    };
  }

  componentWillMount(){
    this.getList();
  }

  //得到列表数据
  getList(){
    this.setState({ loading: true });
    let params = this.state.searchParams;
    //TODO:tanant模式
    let url = `${config.baseUrl}/api/setOfBooks/query/dto?&page=${this.state.page}&size=${this.state.pageSize}&roleType=TENANT`;
    for(let paramsName in params){
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
    }
    return httpFetch.get(url).then((response)=>{
      response.data.map((item)=>{
        item.key = item.id;
      });
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager,
          current: this.state.page + 1
        }
      })
    });
  }

  //分页点击
  onChangePager = (page) => {
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getList();
      })
  };

  search = (result) => {
    this.setState({
      page: 0,
      searchParams: Object.assign({}, this.state.searchParams, result)
    }, ()=>{
      this.getList();
    })
  };

  clear = () => {
    this.setState({
      searchParams: {
        setOfBooksCode: '',
        setOfBooksName: ''
      }
    })
  };

  handleNew = () => {
    this.setState({ nowSetOfBooks: {}, showSlideFrame: true })
  };

  handleRowClick = (record) => {
    this.setState({ nowSetOfBooks: record, showSlideFrame: true })
  };

  handleCloseSlide = (success) => {
    success && this.getList();
    this.setState({showSlideFrame : false});
  };

  render(){
    const { columns, data, loading,  pagination, searchForm, showSlideFrame, nowSetOfBooks } = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <h3 className="header-title">帐套定义</h3>
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}/>

        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:"common.total"}, {total: pagination.total})}</div> {/* 共total条数据 */}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>{formatMessage({id:"common.create"})}</Button> {/* 新建 */}
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               onRowClick={this.handleRowClick}
               rowKey="setOfBooksId"
               bordered
               size="middle"/>

        <SlideFrame content={NewSetOfBooks}
                    title={nowSetOfBooks.setOfBooksId ? "编辑帐套" : "新建帐套"}
                    show={showSlideFrame}
                    onClose={() => this.setState({showSlideFrame : false})}
                    afterClose={this.handleCloseSlide}
                    params={nowSetOfBooks}/>

      </div>
    )
  }

}

SetOfBooks.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(SetOfBooks));
