import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Modal, Button, Tabs, Upload, Icon } from 'antd'
const TabPane = Tabs.TabPane;
import httpFetch from 'share/httpFetch'

//数据导入组件
class Importer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      fileList: [],
      uploading: false,
      tabKey: 'UPDATE'
    };
  }

  handleOk = () => {
    const { tabKey } = this.state;
    //在导入tab下为上传
    if(tabKey === 'UPDATE'){
      const { fileList } = this.state;
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append('files[]', file);
      });
      this.setState({
        uploading: true,
      });
      //TODO:导入数据，根据结果跳转success tab，显示成功与失败的结果
      httpFetch.post(this.props.uploadUrl, formData).then(res => {
        this.setState({
          fileList: [],
          uploading: false,
        });
      }).catch(e => {
        this.setState({
          uploading: false,
        });
      })
    } else {
      this.props.onOk('close');
      this.setState({visible: false})
    }
  };

  showImporter = () => {
    this.setState({visible: true})
  };

  onCancel = () => {
    this.setState({visible: false})
  };

  //TODO:下载表格
  downloadTemplate = () => {

  };

  render() {
    const { title, uploadUrl } = this.props;
    const { visible, uploading, tabKey } = this.state;
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
          <Tabs defaultActiveKey="UPDATE" onChange={(key) => {this.setState({ tabKey: key })}}>
            <TabPane tab="上传文件" key="UPDATE">
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
            <TabPane tab="导入结果" key="SUCCESS">

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
  title: React.PropTypes.string,  //标题
  onOk: React.PropTypes.func  //点击OK后的回调，当有选择的值时会返回一个数组
};

Importer.defaultProps = {
  title: '导入',
  onOk: () => {}
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(Importer));
