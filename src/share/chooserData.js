import React from 'react'
import config from 'config'
import {messages} from "share/common";
import selectorData from 'share/selectorData'

const chooserData = {
  'class': {
    title: '添加班级',
    url: `${config.baseUrl}/api/class/search`,
    searchForm: [
      { type: 'input', id: 'sectionCode', label: "系部" },
      { type: 'input', id: 'sectionName', label: "班级" }
    ],
    columns: [
      { title: "年级", dataIndex: 'grade' },
      { title: "班级", dataIndex: 'className' },
      { title: "人数", dataIndex: 'classCount' },
    ],
    key: 'id'
  }
};

export default chooserData
