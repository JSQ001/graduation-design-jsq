import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Row, Col, Badge, Button, Table, Checkbox, Input } from 'antd'

class CompanyDistribution extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      companyTypeList: [
        {label: '账套', id: 'setOfBooksId'},
        {label: '合同类型代码', id: 'contractTypeCode'},
        {label: '合同类型名称', id: 'contractTypeName'},
        {label: '合同类型状态', id: 'isEnabled'}
      ],
      companyTypeInfo: {},
      pagination: {
        total: 0
      },
      columns: [
        {title: '公司代码', dataIndex: '1'},
        {title: '公司名称', dataIndex: '2'},
        {title: '公司类型', dataIndex: '3'},
        {title: '账套', dataIndex: '4'},
        {title: '付款条件', dataIndex: '5', render: condition => <Input defaultValue={condition}/>},
        {title: '启用', dataIndex: '6', render: isEnabled => <Checkbox defaultChecked={isEnabled}></Checkbox>}
      ],
      data: [],
    }
  }

  componentWillMount() {
    this.setState({
      companyTypeInfo: {
        setOfBooksId: 'CNY_LEDGER',
        contractTypeCode: '123123444',
        contractTypeName: '上海XX有限公司',
        isEnabled: true,
      },
      data: [
        {
          id: '111',
          1: '122222',
          2: '上海甄汇信息科技有限公司',
          3: '123',
          4: 'ZTKIKI',
          5: 'ZTKIKI',
          6: true
        }, {
          id: '222',
          1: '122222',
          2: '上海甄汇信息科技有限公司',
          3: '123',
          4: 'ASDSC',
          5: 'ASDSC',
          6: false
        }
      ]
    })
  }

  handleDistribution = () => {

  };

  render() {
    const { companyTypeList, companyTypeInfo, pagination, columns, data } = this.state;
    let periodRow = [];
    let periodCol = [];
    companyTypeList.map((item, index) => {
      index <= 2 && periodCol.push(
        <Col span={8} style={{marginBottom: '15px'}} key={item.id}>
          <div style={{color: '#989898'}}>{item.label}</div>
          <div style={{wordWrap:'break-word'}}>{companyTypeInfo[item.id]}</div>
        </Col>
      );
      if (index == 2) {
        periodRow.push(
          <Row style={{background:'#f7f7f7',padding:'20px 25px 0',borderRadius:'6px'}} key="1">
            {periodCol}
          </Row>
        );
      }
      if (index == 3) {
        periodRow.push(
          <Row style={{background:'#f7f7f7',padding:'0 25px 5px',borderRadius:'6px'}} key="2">
            <Col span={8} style={{marginBottom: '15px'}} key={item.id}>
              <div style={{color: '#989898'}}>{item.label}</div>
              <Badge status={companyTypeInfo[item.id] ? 'success' : 'error'}
                     text={companyTypeInfo[item.id] ? '启用' : '禁用'} /></Col>
          </Row>
        );
      }
    });
    return (
      <div className="company-distribution">
        {periodRow}
        <div className="table-header">
          <div className="table-header-title">{`共搜索到 ${pagination.total} 条数据`}</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleDistribution}>批量分配公司</Button>
          </div>
        </div>
        <Table rowKey={render => render.id}
               columns={columns}
               dataSource={data}
               bordered
               size="middle"/>
      </div>
    )
  }
}

const wrappedCompanyDistribution = Form.create()(injectIntl(CompanyDistribution));

export default wrappedCompanyDistribution;
