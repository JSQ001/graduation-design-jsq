import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import config from 'config'
import { Modal, Button, Tabs, Upload, Icon, message, Table } from 'antd'
const TabPane = Tabs.TabPane;
import httpFetch from 'share/httpFetch'
import FileSaver from 'file-saver'

//数据导入组件
class Importer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      fileList: [],
      uploading: false,
      tabKey: 'UPDATE',
      result: {},
      transactionID: null,
      errorColumns: [
        {title: '行号', dataIndex: 'index', width: '10%'},
        {title: '错误信息', dataIndex: 'error'}
      ],
      errorData: []
    };
  }

  handleOk = () => {
    const { tabKey } = this.state;
    //在导入tab下为上传
    if(tabKey === 'UPDATE'){
      const { fileList } = this.state;
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append('file', file);
      });
      this.setState({
        uploading: true,
      });
      //导入数据
      httpFetch.post(this.props.uploadUrl, formData, {"Content-type": 'multipart/form-data'}).then(res => {
        this.setState({ transactionID: res.data.transactionID },() => {
          this.listenStatus()
        });
      }).catch(() => {
        this.setState({ uploading: false });
        message.error('导入失败，请重试')
      })
    } else {
      this.props.onOk('close');
      this.setState({
        visible: false,
        tabKey: 'UPDATE'
      })
    }
  };

  //监听导入状态：PARSING_FILE(1001), PROCESS_DATA(1002), DONE(1003), ERROR(1004), CANCELLED(1005)
  listenStatus = () => {
    httpFetch.get(`${config.budgetUrl}/api/batch/transaction/logs/${this.state.transactionID}`).then(res => {
      if (res.data.status === 1004) {
        this.setState({ uploading: false });
        message.error('导入失败，请重试')
      } else if (res.data.status !== 1003) {
        setTimeout(() => {
          this.listenStatus()
        }, 1000)
      } else {
        this.setState({
          fileList: [],
          tabKey: 'SUCCESS',
          uploading: false,
          result: res.data
        }, () => {
          let errorData = [];
          let errors = this.state.result.errors;
          Object.keys(errors).map(error => {
            errors[error].map(index => {
              errorData.push({index, error})
            })
          });
          errorData.sort((a,b) => a.index > b.index);
          errorData = errorData.slice(0, 10);
          this.setState({ errorData })
        })
      }
    }).catch(() => {
      this.setState({ uploading: false });
      message.error('导入失败，请重试')
    })
  };

  showImporter = () => {
    this.setState({visible: true, tabKey: 'UPDATE'})
  };

  onCancel = () => {
    this.setState({visible: false, uploading: false});
    if (this.state.uploading && this.state.transactionID) {
      httpFetch.delete(`${config.budgetUrl}/api/batch/transaction/logs/${this.state.transactionID}`)
    }
  };

  //下载导入模板
  downloadTemplate = () => {
    let hide = message.loading('正在生成文件..');
    httpFetch.get(this.props.templateUrl, {}, {}, {responseType: 'arraybuffer'}).then(res => {
      let b = new Blob([res.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
      let name = this.props.fileName;
      FileSaver.saveAs(b, `${name}.xlsx`);
      hide();
    }).catch(() => {
      message.error('表格下载失败，请重试');
      hide();
    })
  };

  //下载错误信息
  downloadErrors = () => {
    let hide = message.loading('正在生成文件..');
    let url = this.props.errorUrl + `/${this.state.transactionID}`;
    httpFetch.get(url, {}, {}, {responseType: 'arraybuffer'}).then(res => {
      let b = new Blob([res.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
      let name = '错误信息';
      FileSaver.saveAs(b, `${name}.xlsx`);
      hide();
    }).catch(() => {
      hide();
      message.error('错误信息下载失败，请重试');
    })
  };

  //只能上传一个文件
  handleChange = (info) => {
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    this.setState({ fileList })
  };

  render() {
    const { title, uploadUrl } = this.props;
    const { visible, uploading, tabKey, result, errorColumns, errorData } = this.state;
    const props = {
      action: uploadUrl,
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
      onChange: this.handleChange
    };

    return (
      <Button onClick={this.showImporter}>
        导 入
        <Modal className="importer"
               visible={visible}
               onCancel={this.onCancel}
               onOk={this.handleOk}
               title={title}
               confirmLoading={uploading}
               okText={tabKey === 'UPDATE' ? '导入' : '完成'}>
          <Tabs defaultActiveKey="UPDATE" activeKey={tabKey} onChange={(key) => {this.setState({ tabKey: key })}}>
            <TabPane tab="上传文件" key="UPDATE" disabled={tabKey === 'SUCCESS'}>
              <h3>创建电子表格</h3>
              <Button size="small" type="primary" onClick={this.downloadTemplate}>下载Excel电子表格</Button><br/>
              1.点击上方按钮<br/>
              2.严格按照导入模板整理数据，检查必输事项是否缺少数据<br/>
              3.关闭Excel文件后，方可进行数据导入<br/>
              <br/>
              <h3>上传电子表格</h3>
              1.点击【选择文件】按钮<br/>
              2.选择你刚更新过的Excel文件，并点击确定<br/>
              3.点击【导入】按钮<br/>
              <br/>
              <Upload {...props}>
                <Button>
                  <Icon type="upload" /> 选择文件
                </Button>
              </Upload>
            </TabPane>
            <TabPane tab="导入结果" key="SUCCESS" disabled={tabKey === 'UPDATE'}>
              <div>导入成功：{result.successEntities}条</div>
              <div>导入失败：{result.failureEntities}条
                {result.failureEntities ? <span style={{fontSize:12,marginLeft:10}}>（请修改相应数据后，重新导入）</span> : ''}
              </div>
              {result.failureEntities > 10 ?
                <div style={{marginTop:10}}>
                  <Icon type="exclamation-circle-o" style={{marginRight:5, color:'red'}}/>导入失败超过10条，请下载错误信息查看详情
                </div> : ''}
              {result.failureEntities ? (
                <div>
                  <a style={{display:'block', textAlign:'right', marginBottom:6}}
                     onClick={this.downloadErrors}>下载错误信息</a>
                  <Table rowKey={record => record.index}
                         columns={errorColumns}
                         dataSource={errorData}
                         pagination={false}
                         scroll={{x: false, y: 170}}
                         bordered
                         size="small"/>
                </div>
              ) : ''}
            </TabPane>
          </Tabs>
        </Modal>
      </Button>
    );
  }
}

Importer.propTypes = {
  templateUrl: React.PropTypes.string,  //模版下载接口
  uploadUrl: React.PropTypes.string,  //上传接口
  errorUrl: React.PropTypes.string,  //错误信息下载接口，不需要写transactionID变量
  title: React.PropTypes.string,  //标题
  fileName: React.PropTypes.string, //下载文件名
  onOk: React.PropTypes.func
};

Importer.defaultProps = {
  title: '导入',
  fileName: '导入文件',
  onOk: () => {}
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(Importer));
