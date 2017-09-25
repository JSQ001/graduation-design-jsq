import React from 'react'
import { connect } from 'react-redux'

import { Form, Button, Table, Input } from 'antd'
const Search = Input.Search

import BasicInfo from 'components/basic-info'
import SlideFrame from 'components/slide-frame'
import NewStrategyControlDetail from 'containers/budget-setting/budget-organization/budget-strategy/new-strategy-control-detail'
import 'styles/budget/budget-strategy/strategy-control-detail.scss'


class StrategyControlDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      infoList: [
        {type: 'input', title: '序号：', id: 'detailSequence', message: '请输入', isDisabled: true},
        {type: 'input', title: '规则代码：', id: 'detailCode', message: '请输入', isDisabled: true},
        {type: 'select', title: '控制策略：', id: 'controlMethod', options: [{label: '禁止', value: '禁止'},{label: '警告', value: '警告'},{label: '通过', value: '通过'}], message: '请输入'},
        {type: 'input', title: '控制规则描述：', id: 'detailName', message: '请输入'},
        {type: 'input', title: '消息：', id: 'messageCode'},
        {type: 'input', title: '事件：', id: 'expWfEvent'},
      ],
      infoData: {
        detailSequence: 1,
        detailCode: 'code01',
        controlMethod: '通过',
        detailName: '这是一段描述',
        messageCode: '这是一段消息',
        expWfEvent: '这里是事件'
      },
      columns: [
        {title: '类型', dataIndex: 'controlStrategyCode', key: 'controlStrategyCode'},
        {title: '控制对象', dataIndex: 'object', key: 'object'},
        {title: '比较', dataIndex: 'range', key: 'range'},
        {title: '方式', dataIndex: 'manner', key: 'manner'},
        {title: '控制期段', dataIndex: 'periodStrategy', key: 'periodStrategy'},
        {title: '自定义函数', dataIndex: 'function', key: 'function'},
        {title: '操作', dataIndex: 'operator', key: 'operator'},
      ],
      data: [],
      showSlideFrame: false,
    }
  }

  showSlide = (flag) => {
    this.setState({
      showSlideFrame: flag
    })
  };

  handleCloseSlide = (params) => {
    if(params) {
      this.getList();
    }
    this.setState({
      showSlideFrame: false
    })
  };

  render() {
    const { infoList, infoData, columns, data, showSlideFrame } = this.state;
    return (
      <div className="strategy-control-detail">
        <BasicInfo infoList={infoList}
                   infoData={infoData}/>
        <div className="table-header">
          <div className="table-header-title"><h5>触发条件</h5> {`共搜索到 0 条数据`}</div>
          <div className="table-header-buttons">
            <Button type="primary"  onClick={() => this.showSlide(true)}>新 建</Button>
            <Search
              placeholder="请输入控制对象/控制期段"
              style={{ width:200,position:'absolute',right:0,bottom:0 }}
              onSearch={value => console.log(value)}
            />
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               bordered
               size="middle"/>
        <SlideFrame title="新建预算场景"
                    show={showSlideFrame}
                    content={NewStrategyControlDetail}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.showSlide(false)}/>
      </div>
    )
  }
}

function mapStateToProps() {
  return {}
}

const WrappedStrategyControlDetail = Form.create()(StrategyControlDetail);

export default connect(mapStateToProps)(WrappedStrategyControlDetail);
