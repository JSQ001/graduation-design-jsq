/**
 * Created by fudebao on 2017/12/05.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import { Table, Badge, Button, Popover, message } from 'antd';
import httpFetch from 'share/httpFetch'
import SearchArea from 'components/search-area'
import SlideFrame from 'components/slide-frame'

import NewSubjectSheet from './new-supplier-type'

class SupplierType extends React.Component {
    constructor(props) {
        super(props);
        const { formatMessage } = this.props.intl;
        this.state = {
            loading: true,
            data: [],
            page: 0,
            pageSize: 10,
            columns: [
                { title: formatMessage({ id: "supplier.type.code" }), dataIndex: 'supplierTypeCode', width: '20%' },
                {
                    title: formatMessage({ id: "supplier.type.name" }), dataIndex: 'supplierTypeName', width: '30%',
                    render: accountSetDesc => (
                        <Popover content={accountSetDesc}>
                            {accountSetDesc}
                        </Popover>)
                },
                {
                    title: formatMessage({ id: "common.column.status" }), dataIndex: 'isEnabled', width: '15%',
                    render: enabled => (
                        <Badge status={enabled ? 'success' : 'error'}
                            text={enabled ? formatMessage({ id: "common.status.enable" }) : formatMessage({ id: "common.status.disable" })} />
                    )
                }
            ],
            pagination: {
                total: 0
            },
            searchForm: [
                //科目表代码
                { type: 'input', id: 'supplierTypeCode', label: formatMessage({ id: "supplier.type.code" }) },
                ////科目表描述
                { type: 'input', id: 'supplierTypeName', label: formatMessage({ id: "supplier.type.name" }) }
            ],
            searchParams: {
                accountSetCode: '',
                accountSetDesc: ''
            },
            updateParams: {},
            showSlideFrame: false,
            showSlideFrameNew: false,
        };
    }

    componentWillMount() {
        this.getList();
    }

    editItem = (record) => {
        this.setState({
            updateParams: record,
            showSlideFrame: true
        })
        this.showSlideNew(true);
    };

    //得到列表数据
    getList() {
        this.setState({ loading: true });
        let params = this.state.searchParams;
        let url = `http://139.224.2.45:11012/vendor-info-service/api/supplier/type/query?page=${this.state.page}&size=${this.state.pageSize}`;
        for (let paramsName in params) {
            url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
        }
        return httpFetch.get(url).then((response) => {
            response.data.map((item) => {
                item.key = item.id;
            });
            this.setState({
                data: response.data,
                loading: false,
                pagination: {
                    total: Number(response.headers['x-total-count']) ? Number(response.headers['x-total-count']) : 0,
                    onChange: this.onChangePager,
                    current: this.state.page + 1
                }
            })
        });
    }

    //分页点击
    onChangePager = (page) => {
        if (page - 1 !== this.state.page)
            this.setState({
                page: page - 1,
                loading: true
            }, () => {
                this.getList();
            })
    };

    handleRowClick = (record) => {
        this.context.router.push(this.state.budgetOrganizationDetailPage.url.replace(':id', record.id));
    };

    search = (result) => {
        this.setState({
            page: 0,
            searchParams: {
                supplierTypeCode: result.supplierTypeCode ? result.supplierTypeCode : '',
                supplierTypeName: result.supplierTypeName ? result.supplierTypeName : ''
            }
        }, () => {
            this.getList();
        })
    };

    clear = () => {
        this.setState({
            searchParams: {
                accountSetCode: '',
                accountSetDesc: ''
            }
        })
    };

    handleCloseNewSlide = (params) => {
        if (params) {
            this.getList();
        }
        this.setState({
            showSlideFrameNew: false
        })
    };

    showSlideNew = (flag) => {
        this.setState({
            showSlideFrameNew: flag
        })
    };

    newItemShowSlide = () => {
        this.setState({
            updateParams: {},
        }, () => {
            this.showSlideNew(true)
        })
    }

    render() {
        const { formatMessage } = this.props.intl;
        const { columns, data, loading, pagination, searchForm, updateParams, showSlideFrame, showSlideFrameNew } = this.state;
        return (
            <div className="budget-organization">
                <h3 className="header-title">{formatMessage({ id: "menu.supplier-type" })}</h3>
                <SearchArea
                    searchForm={searchForm}
                    submitHandle={this.search}
                    clearHandle={this.clear}
                />

                <div className="table-header">
                    <div className="table-header-title">{formatMessage({ id: "common.total" }, { total: pagination.total ? pagination.total : '0' })}</div> {/* 共total条数据 */}
                    <div className="table-header-buttons">
                        <Button type="primary" onClick={this.newItemShowSlide}>{formatMessage({ id: "common.create" })}</Button>
                    </div>
                </div>

                <Table columns={columns}
                    dataSource={data}
                    pagination={pagination}
                    loading={loading}
                    bordered
                    onRowClick={this.editItem}
                    size="middle" />

                <SlideFrame title={JSON.stringify(updateParams) === "{}" ? `新建${formatMessage({ id:"menu.supplier-type"})}` : `编辑${formatMessage({ id:"menu.supplier-type"})}`}
                    show={showSlideFrameNew}
                    content={NewSubjectSheet}
                    afterClose={this.handleCloseNewSlide}
                    onClose={() => this.setState({ showSlideFrameNew: false })}
                    params={updateParams} />
            </div>
        )
    }

}

SupplierType.contextTypes = {
    router: React.PropTypes.object
};

function mapStateToProps() {
    return {}
}

export default connect(mapStateToProps)(injectIntl(SupplierType));
