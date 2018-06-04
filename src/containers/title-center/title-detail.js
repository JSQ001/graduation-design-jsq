/**
 * Created by jsq on 2018/4/26.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button, Table, Badge, Popconfirm,Tabs} from 'antd';
import { injectIntl } from 'react-intl'
import httpFetch from 'share/httpFetch'
import config from 'config'
import menuRoute from 'routes/menuRoute'
import Generator from 'containers/title-center/generator'
import Importer from 'components/importer'
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class TitleDetail extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      titleNum: 1,
      showImportFrame: false,
      tabs: [
        {key: 'add', name:'手动添加',disabled: false},
        {key: 'import', name:'导入', disabled: false},
      ],
      nowTabs: 'add',
      json: {
        security: {
          title: '试题',
          key: 'page-create',
          hash: '33za1r8an66e59ng7ap69m9567'
        },
        layout: {
          width: '80%',
          gutter: 40,
          justify: 'start',
          align: 'top',
          span: 24,
          labelCol: { span: 1 ,offset:1},
          wrapperCol: { span: 60, offset: 1 },
          buttons: 'center',
          buttonsMargin: 10
        },
        forms: [
          {id: 't1', type: 'select', titleNumber: `第1题、`,title: '今年nba谁是总冠军?', defaultValue: 'caves',
            options:[
              {label: '骑士', value: 'caves'},
              {label: '火箭', value: 'rocket'},
              {label: '76人', value: '76'},
              {label: '勇士', value: 'GS'}
            ]
          },
        ],
        buttons: [
          { id: 'submit', type: 'submit', text: '提交', surface: 'primary' },
          { id: 'clear', type: 'clear', text: '清除', target: ['test1', 'test2', 'test3']},
          { id: 'set', type: 'set', text: '设置', surface: 'danger', target: [] }
        ]
      }
    }

  }

  titleLine = (e,record)=>{
    this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.newBudgetControlRules.url.replace(':id', this.props.id));

  };

  componentWillMount(){
    this.getList()
  }

  getList(){
    const { titleNum, json} = this.state;
    httpFetch.get(`${config.baseUrl}/api/title/line/search`,{id: this.props.params.id}).then(response=>{
      let forms = [];
      response.data.map((item,index)=>{
        let title = {
          id:'t'+titleNum+index,
          uuid: item.uuid,
          type: item.type,
          titleNumber: `第${titleNum+index}题`,
          title: item.title,
          defaultValue:item.answer,
          options:[]
        };
        item.options.map(i=>{title.options.push({label: i,value: i})});
        forms.push(title);
      });
      json.forms = forms;
      this.setState({
        json,
        titleNum: titleNum+response.data.length
      })
    })
  }

  onCancel = ()=>{
    this.props.form.resetFields()
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



  handleAdd = (values)=>{
    let json = this.state.json;
    let array = [];
    for(let item in values){
      let str = /option/;
      if(str.test(item)){
        array.push(values[item])
      }
    }
    console.log(values)
    httpFetch.post(`${config.baseUrl}/api/title/line/add/${this.props.params.id}`,{...values,options: array}).then(response=>{
      console.log(response)
      this.getList()
    });

    /*let forms=[];
    let i = json.forms.length+1;
    let title = {id:'t'+i, type: 'select', titleNumber: `第${i}题`, title: values.title,defaultValue:values.answer,options:[]};
    for(let item in values){
      let str = /option/;
      if(str.test(item)){
        let option = {label: values[item],value: values[item]}
        title.options.push(option)
      }
    }
    forms.push(title);
    json.forms = json.forms.concat(forms);
    this.setState({json})*/
  };

  deleteTitle =(item)=>{
    httpFetch.delete(`${config.baseUrl}/api/title/line/delete/${item.uuid}?id=${this.props.params.id}`).then(response=>{
      this.getList()
    })
  };

  handleImportOk = () => {
    this.showImport(false);
    this.getList()
  };

  showImport = (flag) => {
    this.setState({ showImportFrame: flag })
  };

  onChangeTabs = (key) =>{
    this.setState({
      nowTabs: key
    })
  };


  renderImport(){
    return (<div>
      <Button onClick={() => this.showImport(true)}>导入</Button>
    </div>)
  }


  render(){
    const { formatMessage } = this.props.intl;
    const { json, tabs, nowTabs, showImportFrame} = this.state;


    return (
      <div className="teacher-info">
        <Tabs onChange={this.onChangeTabs} defaultActiveKey={nowTabs}>
          {tabs.map(tab => <TabPane tab={tab.name} key={tab.key} disabled={tab.disabled}/>)}
        </Tabs>
        {
          nowTabs === 'add' ?
            <Generator json={JSON.stringify(json)} forms={json.forms} handleAdd={this.handleAdd}
                       delete={this.deleteTitle}/>
            : this.renderImport()
        }

        <Importer visible={showImportFrame}
                  title="导入学生"
                  templateUrl={`${config.baseUrl}/api/user/export/template`}
                  uploadUrl={`${config.baseUrl}/api/user/import`}
                  errorUrl={`${config.baseUrl}/api/user/export/failed/data`}
                  fileName="学生导入文件"
                  onOk={this.handleImportOk}
                  afterClose={() => this.showImport(false)}/>
        <br/>
      </div>)
  }
}
TitleDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user,
  }
}


export default connect(mapStateToProps)(injectIntl(TitleDetail));
