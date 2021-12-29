import React, { Component } from 'react';
import {Select, Form, Radio} from 'hzero-ui';
import UploadModal from 'components/Upload';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { tableScrollWidth } from 'utils/utils';
import styles from './index.less';
import RadioGroup from 'hzero-ui/lib/radio/group';

const { Option } = Select;

@connect(({ oqcInspectPlat, loading }) => ({
  oqcInspectPlat,
  fetchDataLoading: loading.effects['oqcInspectPlat/fetchList'],
}))
class ListTableRow extends Component {
  @Bind()
  handleTableChange(pagination) {
    const { onSearch } = this.props;
    onSearch(pagination);
  }

  // 变幻时调用更新
  @Bind()
  changeInspectionResult = (value, records, index) => {
    const {
      dispatch,
      oqcInspectPlat: { headList = []},
    } = this.props;
    debugger;
    headList.lineList[index].inspectionResult = value.target.value;

    // 新增 判断数据是否全为OK 是则改变头信息
    // 最终更具变化的行信息  填写头信息
    let setHeadOkStatusFlag = true;
    let setHeadNgStatusFlag = true;
    for (let i = 0; i < headList.lineList.length; i++) {
      if (headList.lineList[i].inspectionResult !== 'OK') {
        setHeadOkStatusFlag = false;
      }
      if (
        headList.lineList[i].inspectionResult === '' ||
        headList.lineList[i].inspectionResult === null ||
        headList.lineList[i].inspectionResult === undefined
      ) {
        setHeadNgStatusFlag = false;
      }
    }
    if (setHeadOkStatusFlag) {
      headList.inspectionResultMeaning = 'OK';
      headList.inspectionResult = 'OK';
    } else if (setHeadNgStatusFlag) {
      headList.inspectionResultMeaning = 'NG';
      headList.inspectionResult = 'NG';
    }

    dispatch({
      type: 'oqcInspectPlat/updateState',
      payload: {
        headList,
      },
    });
  };

  @Bind()
  changeBackColor(record) {
    const { selectLine} = this.props;
    if ( selectLine.oqcLineId === record.oqcLineId) {
      return styles['data-click'];
    } else {
      return '';
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.oqcInspectPlat.model.oqcInspectPlat';
    const {
      loading,
      inspectLine,
      rowClick,
      // changeBackColor,
      // resultMap,
      oqcInspectPlat: { resultMap = []},
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.sequence`).d('序列号'),
        width: 65,
        dataIndex: 'number',
        align: 'center',
      },
      {
        title: '检验项目',
        dataIndex: 'inspection',
        width: 85,
        align: 'inspection',
      },
      {
        title: '检验项目描述',
        dataIndex: 'inspectionDesc',
        width: 95,
        align: 'center',
      },
      {
        title: '检验项目类别',
        dataIndex: 'inspectionTypeMeaning',
        width: 95,
        align: 'center',
      },
      {
        title: '规格类型',
        width: 120,
        dataIndex: 'standardTypeMeaning',
        align: 'center',
      },
      {
        title: '精度',
        dataIndex: 'accuracy',
        width: 80,
        align: 'center',
      },
      {
        title: '规格值从',
        dataIndex: 'standardFrom',
        width: 95,
        align: 'center',
      },
      {
        title: '规格值至',
        dataIndex: 'standardTo',
        width: 95,
        align: 'center',
      },
      {
        title: '规格单位',
        dataIndex: 'standardUom',
        width: 85,
        align: 'center',
      },
      {
        title: '文本规格值',
        dataIndex: 'standardText',
        width: 95,
        align: 'center',
      },
      {
        title: '检验工具',
        dataIndex: 'inspectionToolMeaning',
        width: 85,
        align: 'center',
      },
      {
        title: '检验结果',
        dataIndex: 'inspectionResult',
        width: 150,
        align: 'center',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <div className='lineHeight'>
              <Form.Item>
                {record.$form.getFieldDecorator(`inspectionResult`, {
                initialValue: record.inspectionResult,
              })(
                // <Select
                //   defaultValue={val}
                //   onChange={(values, records) =>
                //     this.changeInspectionResult(values, records, index)
                //   }
                //   style={{ width: '100%' }}
                // >
                //   {resultMap.map(ele => (
                //     <Option value={ele.value}>{ele.meaning}</Option>
                //   ))}
                // </Select>
                <RadioGroup defaultValue={val}
                  onChange={(values, records) =>
                    this.changeInspectionResult(values, records, index)
                  }
                  style={{ width: '100%' }}
                >
                  {resultMap.map(ele => (
                    <Radio style={{ backgroundColor: ele.meaning==="OK"? '#1AC0A6': ele.meaning==="NG"?"#FE6767":"white", color: 'white'}} key={ele.value} value={ele.value}>
                      <span style={{ backgroundColor: ele.meaning==="OK"? '#1AC0A6': ele.meaning==="NG"?"#FE6767":"white", color: 'white'}}>{ele.meaning}</span>
                    </Radio>
                  ))}
                </RadioGroup>
              )}
              </Form.Item>
            </div>
          ) : (
            (resultMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: '附件',
        width: 100,
        align: 'center',
        dataIndex: 'attachmentUuid',
        render: (val, record) => {
          if (record.attachmentUuid) {
            return ['create', 'update'].includes(record._status) ? (
              <UploadModal
                attachmentUUID={val}
                bucketName="file-mes"
                bucketDirectory="hwfp01"
                btnText="浏览"
              />
            ) : (
              <UploadModal
                attachmentUUID={val}
                bucketName="file-mes"
                viewOnly
                bucketDirectory="hwfp01"
                btnText="浏览"
              />
            );
          }
        },
      },
    ];
    return (
      <div className="tableOqcClass">
        <EditTable
          bordered
          rowKey="oqcLineId"
          loading={loading}
          dataSource={inspectLine}
          columns={columns}
          pagination={false}
          scroll={{ x: tableScrollWidth(columns, 50), y: 500 }}
          onRow={record => {
          return {
            onClick: () => {
              rowClick(record);
            },
          };
        }}
          onChange={this.handleTableChange}
          rowClassName={this.changeBackColor}
        />
      </div>
    );
  }
}

export default ListTableRow;
