import React, { Component } from 'react';
import { InputNumber, Select, Form } from 'hzero-ui';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import UploadModal from 'components/Upload';
import { connect } from 'dva';
import { tableScrollWidth } from 'utils/utils';

const { Option } = Select;

@connect(({ iqcInspectionPlatform, loading }) => ({
  iqcInspectionPlatform,
  fetchDataLoading: loading.effects['iqcInspectionPlatform/queryInspectLineTwoData'],
}))
class ListTableRow extends Component {
  @Bind()
  handleTableChange(pagination) {
    const { onSearch } = this.props;
    onSearch(pagination);
  }

  // 变幻时调用更新
  @Bind()
  changeStandTo = (value, index) => {
    if(value===""||value===null||value===undefined||Number(value)===0){
      return;
    }

    const {
      dispatch,
      iqcInspectionPlatform: { inspectLineData = [] },
    } = this.props;

      // 当数据小于置顶数量时, 设置为最小值
      if(Number(value)<inspectLineData[index].sampleSize){
        inspectLineData[index].sampleSizeTem = inspectLineData[index].sampleSize;
      }else{
        inspectLineData[index].sampleSizeTem = value;
      }

    const addDataLength =
      Number(inspectLineData[index].sampleSizeTem) - inspectLineData[index].detailList.length;

    // 当为新增时候
    if (addDataLength >= 0) {
      // 添加对应的数据
      if (inspectLineData[index].detailList.length > 0) {
        for (let i = 0; i < addDataLength; i++) {
          inspectLineData[index].detailList = [
            ...inspectLineData[index].detailList,
            {
              detailId: `${inspectLineData[index].iqcLineId}-${Number(
                inspectLineData[index].detailList[inspectLineData[index].detailList.length - 1]
                  .number
              ) + 1}`,
              number: Number(inspectLineData[index].detailList[inspectLineData[index].detailList.length - 1].number)+ 1,
              _status: 'update',
            },
          ];
        }
      } else {
        for (let i = 0; i < addDataLength; i++) {
          inspectLineData[index].detailList = [
            ...inspectLineData[index].detailList,
            { detailId: `${i + 1}`, number: (i + 1), _status: 'update'},
          ];
        }
      }
    }else{
      const deleteDataLength =
       inspectLineData[index].detailList.length-Number(inspectLineData[index].sampleSizeTem);
       for (let i = 0; i < deleteDataLength; i++) {
        inspectLineData[index].detailList.splice(inspectLineData[index].detailList.length-1-index, 1);
      }
    }
    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        inspectLineData,
      },
    });
  };

  // 变幻时调用更新
  @Bind()
  changeOkQty = (value, index) => {
    const {
      dispatch,
      iqcInspectionPlatform: { inspectLineData = [] },
    } = this.props;
    inspectLineData[index].okQty = value;
    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        inspectLineData,
      },
    });
  };

  // 变幻时调用更新
  @Bind()
  changeNcQty = (value, index) => {
    const {
      dispatch,
      iqcInspectionPlatform: { inspectLineData = [] },
    } = this.props;
    inspectLineData[index].ngQty = value;
    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        inspectLineData,
      },
    });
  };

  // 变幻时调用更新
  @Bind()
  changeInspectionResult = (value, records, index) => {
    const {
      dispatch,
      iqcInspectionPlatform: { inspectLineData = [], inspectHeadData = {} },
    } = this.props;
    inspectLineData[index].inspectionResult = value;

    // 新增 判断数据是否全为OK 是则改变头信息
    // 最终更具变化的行信息  填写头信息
    let setHeadOkStatusFlag = true;
    let setHeadNgStatusFlag = true;
    for (let i = 0; i < inspectLineData.length; i++) {
      if (inspectLineData[i].inspectionResult !== 'OK') {
        setHeadOkStatusFlag = false;
      }
      if (
        inspectLineData[i].inspectionResult === '' ||
        inspectLineData[i].inspectionResult === null ||
        inspectLineData[i].inspectionResult === undefined
      ) {
        setHeadNgStatusFlag = false;
      }
    }

    if (setHeadOkStatusFlag) {
      inspectHeadData.inspectionResultMeaning = 'OK';
      inspectHeadData.inspectionResult = 'OK';
    } else if (setHeadNgStatusFlag) {
      inspectHeadData.inspectionResultMeaning = 'NG';
      inspectHeadData.inspectionResult = 'NG';
    }

    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        inspectLineData,
        inspectHeadData,
      },
    });
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.deliverQuery.model.deliverQuery';
    const {
      loading,
      inspectLine,
      rowClick,
      changeBackColor,
      iqcInspectionPlatform: { resultMap = [], specificalTypeMap = [] },
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.sequence`).d('序号'),
        width: 65,
        dataIndex: 'number',
        align: 'center',
      },
      {
        title: '检验项别',
        width: 85,
        dataIndex: 'inspectionTypeMeaning',
        align: 'center',
      },
      {
        title: '检验项目',
        dataIndex: 'inspection',
        width: 85,
        align: 'inspection',
      },
      {
        title: '检验项描述',
        dataIndex: 'inspectionDesc',
        width: 95,
        align: 'center',
      },
      {
        title: '抽样数量',
        width: 85,
        dataIndex: 'sampleSizeTem',
        align: 'center',
        render: (value, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <div className='lineHeight'>
              <Form.Item>
                {record.$form.getFieldDecorator('unitQty', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`sampleSize`).d('抽样数量'),
                    }),
                  },
                ],
              })(
                <InputNumber
                  onChange={values => this.changeStandTo(values, index)}
                  min={record.sampleSize}
                  style={{
                    width: '100%',
                  }}
                />
              )}
              </Form.Item>
            </div>
          ) : (
            value
          ),
      },
      {
        title: 'AC/RE',
        dataIndex: 'acSplitRe',
        width: 80,
        align: 'center',
      },
      {
        title: '文本规格值',
        dataIndex: 'standardText',
        width: 95,
        align: 'center',
      },
      {
        title: '规格范围',
        dataIndex: 'standardRange',
        width: 85,
        align: 'center',
      },
      {
        title: '规格单位',
        dataIndex: 'uomCode',
        width: 85,
        align: 'center',
      },
      {
        title: '规格类型',
        width: 120,
        dataIndex: 'standardType',
        align: 'center',
        render: val => (specificalTypeMap.filter(ele => ele.value === val)[0] || {}).meaning,
      },
      {
        title: '检验工具',
        dataIndex: 'inspectionToolMeaning',
        width: 85,
        align: 'center',
      },
      {
        title: '不良数',
        dataIndex: 'ngQty',
        width: 100,
        align: 'center',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <div className='lineHeight'>
              <Form.Item>
                {record.$form.getFieldDecorator(`ngQty`, {
                initialValue: record.ngQty,
              })(
                <InputNumber
                  defaultValue={record.ngQty}
                  onChange={values => this.changeNcQty(values, index)}
                  style={{ width: '100%' }}
                  min={0}
                />
              )}
              </Form.Item>
            </div>
          ) : (
            val
          ),
      },
      {
        title: '合格数',
        dataIndex: 'okQty',
        width: 100,
        align: 'center',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <div className='lineHeight'>
              <Form.Item>
                {record.$form.getFieldDecorator(`okQty`, {
                initialValue: record.okQty,
              })(
                <InputNumber
                  defaultValue={record.okQty}
                  onChange={values => this.changeOkQty(values, index)}
                  style={{ width: '100%' }}
                  min={0}
                />
              )}
              </Form.Item>
            </div>
          ) : (
            val
          ),
      },
      {
        title: '结论',
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
                <Select
                  defaultValue={val}
                  onChange={(values, records) =>
                    this.changeInspectionResult(values, records, index)
                  }
                  style={{ width: '100%' }}
                >
                  {resultMap.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
                  ))}
                </Select>
              )}
              </Form.Item>
            </div>
          ) : (
            (specificalTypeMap.filter(ele => ele.typeCode === val)[0] || {}).description
          ),
      },
      {
        title: '抽样方案类型',
        dataIndex: 'sampleTypeCode',
        width: 105,
        align: 'center',
      },
      {
        title: '缺陷等级',
        width: 85,
        dataIndex: 'defectLevelsMeaning',
        align: 'center',
      },
      {
        title: '检验水平',
        width: 85,
        align: 'center',
        dataIndex: 'inspectionLevelsMeaning',
      },
      {
        title: 'AQL值',
        dataIndex: 'acceptanceQuantityLimit',
        width: 70,
        align: 'center',
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
      <div className="tableClass">
        <EditTable
          bordered
          rowKey="iqcLineId"
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
          rowClassName={changeBackColor}
        />
      </div>
    );
  }
}

export default ListTableRow;
