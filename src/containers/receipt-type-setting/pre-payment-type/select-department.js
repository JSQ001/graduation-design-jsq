/**
 * Created By ZaraNengap on 2017/09/21
 */
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Modal, Table, message, Button, Input, Row, Col, Card, Checkbox, Tree } from 'antd'

const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;

const TreeNode = Tree.TreeNode;

import httpFetch from 'share/httpFetch'
import SearchArea from 'components/search-area'

import config from 'config'

import 'styles/pre-payment/my-pre-payment/select-contract.scss'

class SelectEmployeeGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            expandedKeys: ['0-0-0', '0-0-1'],
            autoExpandParent: true,
            checkedKeys: ['0-0-0'],
            selectedKeys: [],
        };
    }

    onExpand = (expandedKeys) => {
        console.log('onExpand', arguments);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    }
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    }
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item} />;
        });
    }

    onLoadData = (treeNode) => {
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }

            httpFetch.get(`${config.baseUrl}/api/department/child/${treeNode.props.eventKey}`).then(res => {
                let temp = [];

                res.data.map(item => {
                    temp.push({ title: item.name, key: item.departmentOID, isLeaf: !item.hasChildrenDepartments });
                })

                treeNode.props.dataRef.children = temp;

                this.setState({
                    treeData: this.state.treeData.concat([]),
                });

                resolve();
            })

        });
    }

    componentDidMount() {
        httpFetch.get(`${config.baseUrl}/api/departments/root?flag=1001`).then(res => {
            if (res.data && res.data.length) {
                let temp = [];

                res.data.map(item => {
                    temp.push({ title: item.name, key: item.departmentOID });
                    if (item.hasChildrenDepartments) {
                        this.getTreeData(res.data, item);
                    }
                })

                this.setState({ treeData: temp });
            }

        })
    }


    //递归构造树形数据
    getTreeData = (data, model) => {
        let treeData = [];

        data.map(item => {
            if (item.parentDepartmentOID == model.departmentOID) {
                treeData.push({ title: item.name, key: item.departmentOID });
                if (item.hasChildrenDepartments) {
                    this.getTreeData(data, item);
                }
            }
        })

        model.children = treeData;
    }

    render() {
        const { visible, onCancel, afterClose } = this.props;
        const { treeData } = this.state;
        return (
            <Modal title={"选择人员组"} visible={visible} onCancel={onCancel} afterClose={afterClose} width={800} onOk={this.handleOk} className="list-selector select-department">
                <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
                <Tree
                    checkable
                    loadData={this.onLoadData}
                >
                    {this.renderTreeNodes(treeData)}
                </Tree>
            </Modal >
        );
    }
}

SelectEmployeeGroup.propTypes = {
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

SelectEmployeeGroup.defaultProps = {
    afterClose: () => { },
    extraParams: {},
    single: false
};

function mapStateToProps() {
    return {}
}

export default connect(mapStateToProps)(injectIntl(SelectEmployeeGroup));

