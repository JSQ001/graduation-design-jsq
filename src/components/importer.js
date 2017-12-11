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
      //TODO:导入数据，根据结果跳转success tab，显示成功与失败的结果
      httpFetch.post(this.props.uploadUrl, formData, {"Content-type": 'multipart/form-data'}).then(res => {
        this.setState({ transactionID: res.data.transactionID });
        httpFetch.get(`${config.budgetUrl}/api/batch/transaction/logs/${res.data.transactionID}`).then(res => {
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
                if (errorData.length) {
                  errorData.map((item, i) => {
                    if (index === item.index) {
                      errorData[i].erros = error
                    } else {
                      errorData.push({index, error})
                    }
                  })
                } else {
                  errorData.push({index, error})
                }
              })
            });
            this.setState({ errorData })
          })
        }).catch(() => {
          this.setState({ uploading: false });
          message.error('导入失败，请重试')
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

  showImporter = () => {
    this.setState({visible: true, tabKey: 'UPDATE'})
  };

  onCancel = () => {
    this.setState({visible: false});
    if (this.state.uploading) {
      httpFetch.delete(`${config.budgetUrl}/api/batch/transaction/logs/${this.state.transactionID}`)
    }
  };

  //TODO:下载表格
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
      message.error('错误信息下载失败，请重试');
      hide();
    })
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
              {result.failureEntities ? (
                <div>
                  <a style={{display:'block', textAlign:'right', marginBottom:6}}
                     onClick={this.downloadErrors}>下载错误信息</a>
                  <Table rowKey={record => record.index}
                         columns={errorColumns}
                         dataSource={errorData}
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
  errorUrl: React.PropTypes.string,  //错误信息下载接口
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
