import React from 'react'
import { injectIntl } from 'react-intl';
import { Form, Upload, Icon, message } from 'antd'
const Dragger = Upload.Dragger;

import config from 'config'

/**
 * 上传附件组件
 * @params extensionName: 附件支持的扩展名
 * @params fileNum: 最大上传文件的数量
 * @params attachmentType: 附件类型
 */

class UploadFile extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      fileList: []
    }
  }

  beforeUpload = (file) => {
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error('文件大小不能超过3MB!');
    }
    return isLt3M;
  };

  handleChange = (info) => {
    let fileList = info.fileList;
    fileList = fileList.slice(`-${this.props.fileNum}`);
    this.setState({ fileList },() => {
      const status = info.file.status;
      if (status !== 'uploading') {
        // console.log(info.file);
        // console.log(info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    });
  };

  render() {
    const upload_headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + localStorage.token
    };
    return (
      <div className="upload">
        <Dragger name="file"
                 action={`${config.baseUrl}/api/upload/attachment`}
                 headers={upload_headers}
                 data={{attachmentType: this.props.attachmentType}}
                 fileList={this.state.fileList}
                 beforeUpload={this.beforeUpload}
                 onChange={this.handleChange}
                 style={{padding: '20px 0'}}>
          <p className="ant-upload-drag-icon">
            <Icon type="cloud-upload-o" />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
          <p className="ant-upload-hint">支持扩展名：{this.props.extensionName}</p>
        </Dragger>
      </div>
    )
  }
}

UploadFile.propTypes = {
  attachmentType: React.PropTypes.string.isRequired,  //附件类型
  extensionName: React.PropTypes.string,  //附件支持的扩展名
  fileNum: React.PropTypes.number,  //最大上传文件的数量
};

UploadFile.defaultProps={
  extensionName: '.rar .zip .doc .docx .pdf .jpg...',
  fileNum: 0
};

const WrappedUploadFile= Form.create()(injectIntl(UploadFile));

export default WrappedUploadFile;
