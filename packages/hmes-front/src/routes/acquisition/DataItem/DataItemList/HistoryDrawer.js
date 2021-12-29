import React, { PureComponent } from 'react';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { connect } from 'dva';
import moment from 'moment';
import { Modal, Form, Button, Spin, Badge, Row, Col, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

const modelPrompt = 'tarzan.acquisition.number.model.number';
const FormItem = Form.Item;

/**
 * 修改历史展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ dataItem, loading }) => ({
  dataItem,
  fetchLoading: loading.effects['dataItem/fetchTagHistory'],
}))
@Form.create({ fieldNameProp: null })
export default class HistoryDrawer extends PureComponent {
  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    this.queryValue(pagination);
  }

  @Bind()
  queryValue(pagination = {}) {
    const { form, dispatch, queryFromRecord } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'dataItem/fetchTagHistory',
          payload: {
            page: pagination,
            tagId: queryFromRecord.tagId,
            startTime: fieldsValue.startTime
              ? moment(fieldsValue.startTime).format('YYYY-MM-DD HH:mm:ss')
              : moment()
                  .subtract(6, 'months')
                  .format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(fieldsValue.endTime).format('YYYY-MM-DD HH:mm:ss'),
          },
        });
      }
    });
  }

  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const {
      form,
      visible,
      onCancel,
      dataItem: {
        historyList = [],
        historyPagination = {},
        collectionMthodList = [],
        valueTypeList = [],
      },
      fetchLoading,
    } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.objectCodeHistoryId`).d('数据项'),
        dataIndex: 'tagId',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.objectCode`).d('数据项编码'),
        dataIndex: 'tagCode',
        width: 160,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.objectDesc`).d('数据项描述'),
        dataIndex: 'tagDescription',
        width: 200,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.numberRange`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 90,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`${modelPrompt}.open`).d('启用')
                : intl.get(`${modelPrompt}.forbidden`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.numberRangeDesc`).d('备注'),
        dataIndex: 'remark',
        align: 'left',
        width: 220,
      },
      {
        title: intl.get(`${modelPrompt}.collectionMethod`).d('数据收集方式'),
        dataIndex: 'collectionMethod',
        width: 100,
        render: val =>
          (collectionMthodList.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.valueAllowMissing`).d('允许缺失值'),
        dataIndex: 'valueAllowMissing',
        width: 90,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.valueAllowMissing === 'Y' ? 'success' : 'error'}
            text={
              record.valueAllowMissing === 'Y'
                ? intl.get(`${modelPrompt}.open`).d('启用')
                : intl.get(`${modelPrompt}.forbidden`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.objectCode`).d('数据类型'),
        dataIndex: 'valueType',
        width: 90,
        render: val => (valueTypeList.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.objectDesc`).d('符合值'),
        dataIndex: 'trueValue',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('不符合值'),
        dataIndex: 'falseValue',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('最小值'),
        dataIndex: 'minimumValue',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('最大值'),
        dataIndex: 'maximalValue',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('计量单位'),
        dataIndex: 'uomCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('必须的数据条数'),
        dataIndex: 'mandatoryNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('可选的数据条数'),
        dataIndex: 'optionalNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.apiName`).d('转换API'),
        dataIndex: 'apiName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.eventTime`).d('变更时间'),
        dataIndex: 'eventTime',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.eventBy`).d('用户ID'),
        dataIndex: 'eventBy',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.eventId`).d('事件ID'),
        dataIndex: 'eventId',
        width: 150,
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={1080}
        title={intl.get(`${modelPrompt}.historyRecord`).d('修改历史')}
        visible={visible}
        onCancel={onCancel}
        onOk={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Spin spinning={false}>
          <div style={{ width: '99%' }}>
            <Form className={SEARCH_FORM_CLASSNAME}>
              <Row {...SEARCH_FORM_ROW_LAYOUT}>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    {...SEARCH_FORM_ITEM_LAYOUT}
                    label={intl.get(`${modelPrompt}.startTime`).d('开始时间')}
                  >
                    {getFieldDecorator('startTime', {
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${modelPrompt}.startTime`).d('开始时间'),
                          }),
                        },
                      ],
                      initialValue: moment(
                        moment()
                          .subtract(6, 'months')
                          .format('YYYY-MM-DD HH:mm:ss')
                      ),
                    })(
                      <DatePicker
                        showTime={{ format: 'HH:mm:ss' }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    {...SEARCH_FORM_ITEM_LAYOUT}
                    label={intl.get(`${modelPrompt}.endTime`).d('结束时间')}
                  >
                    {getFieldDecorator('endTime', {
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${modelPrompt}.endTime`).d('结束时间'),
                          }),
                        },
                      ],
                      initialValue: moment(moment().format('YYYY-MM-DD HH:mm:ss')),
                    })(
                      <DatePicker
                        showTime={{ format: 'HH:mm:ss' }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT} className={SEARCH_COL_CLASSNAME}>
                  <FormItem>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                      {intl.get(`tarzan.acquisition.number.button.reset`).d('重置')}
                    </Button>
                    <Button type="primary" htmlType="submit" onClick={this.queryValue}>
                      {intl.get('tarzan.acquisition.number.button.search').d('查询')}
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <EditTable
              loading={fetchLoading}
              bordered
              rowKey="eventId"
              columns={columns}
              dataSource={historyList}
              pagination={historyPagination}
              onChange={this.handleTableChange}
              scroll={{ x: tableScrollWidth(columns) }}
            />
          </div>
        </Spin>
      </Modal>
    );
  }
}
