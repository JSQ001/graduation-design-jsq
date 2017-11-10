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
 * @params uploadHandle: 获取上传文件的OID
 */

class UploadFile extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      OIDs: [],
    }
  }

  handleData = (file) => {
    let data = {
      file,
      attachmentType: this.props.attachmentType
    };
    return data;
  };

  beforeUpload = (file) => {
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error('文件大小不能超过3MB!');
    }
    return isLt3M;
  };

  handleChange = (info) => {
    const fileNum = parseInt(`-${this.props.fileNum}`);
    let fileList = info.fileList;
    let OIDs = this.state.OIDs;
    fileList = fileList.slice(fileNum);
    this.setState({ fileList },() => {
      const status = info.file.status;
      if (status === 'done') {
        message.success(`${info.file.name} 上传成功`);
        OIDs.push(info.file.response.attachmentOID);
        OIDs = OIDs.slice(fileNum);
        this.setState({ OIDs }, () => {
          this.props.uploadHandle(this.state.OIDs)
        })
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    });
  };

  handleRemove = (info) => {
    let OIDs = this.state.OIDs;
    OIDs.map(OID => {
      OID === info.response.attachmentOID && OIDs.delete(OID);
    });
    this.setState({ OIDs },() => {
      this.props.uploadHandle(this.state.OIDs)
    })
  };

  render() {
    const upload_headers = {
      'Authorization': 'Bearer ' + localStorage.token
    };
    return (
      <div className="upload">
        <Dragger name="file"
                 action={`${config.baseUrl}/api/upload/attachment`}
                 headers={upload_headers}
                 data={this.handleData}
                 fileList={this.state.fileList}
                 beforeUpload={this.beforeUpload}
                 onChange={this.handleChange}
                 onRemove={this.handleRemove}
                 style={{padding: '20px 0'}}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
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
  uploadHandle: React.PropTypes.func, //获取上传文件的OID
};

UploadFile.defaultProps={
  extensionName: '.rar .zip .doc .docx .pdf .jpg...',
  fileNum: 0,
  uploadHandle:()=>{}
};

const WrappedUploadFile= Form.create()(injectIntl(UploadFile));

export default WrappedUploadFile;
