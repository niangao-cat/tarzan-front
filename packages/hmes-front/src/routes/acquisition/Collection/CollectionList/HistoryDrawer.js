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

const modelPrompt = 'tarzan.acquisition.number.model.number';
const FormItem = Form.Item;

/**
 * 修改历史展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ collection, loading }) => ({
  collection,
  fetchLoading: loading.effects['collection/fetchTagListHistory'],
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
          type: 'collection/fetchTagListHistory',
          payload: {
            page: pagination,
            tagGroupId: queryFromRecord.tagGroupId,
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
      collection: {
        tagListHistory = [],
        tagPaginationHistory = {},
        collectionTimeControlList = [],
        businessList = [],
        statusList = [],
        typeList = [],
      },
      fetchLoading,
    } = this.props;
    const { getFieldDecorator } = form;

    const columns = [
      {
        title: intl.get(`${modelPrompt}.objectCodeHistoryId`).d('数据收集组历史表ID'),
        dataIndex: 'tagGroupHisId',
        width: 180,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.objectCode`).d('数据收集组ID'),
        dataIndex: 'tagGroupId',
        width: 160,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.objectDesc`).d('数据收集组编码'),
        dataIndex: 'tagGroupCode',
        width: 200,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.numberRange`).d('数据收集组描述'),
        dataIndex: 'tagGroupDescription',
        width: 200,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.numberRangeDesc`).d('状态'),
        dataIndex: 'status',
        width: 90,
        align: 'center',
        render: val => (statusList.filter(ele => ele.statusCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.numExample`).d('数据收集组类型'),
        dataIndex: 'tagGroupType',
        width: 120,
        align: 'left',
        render: val => (typeList.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.userVerification`).d('来源数据收集组ID'),
        dataIndex: 'sourceGroupId',
        width: 120,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.objectType`).d('业务类型'),
        dataIndex: 'businessType',
        width: 90,
        render: val => (businessList.filter(ele => ele.typeCode === val)[0] || {}).description,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.objectType`).d('数据收集时点'),
        dataIndex: 'collectionTimeControl',
        width: 100,
        align: 'left',
        render: val =>
          (collectionTimeControlList.filter(ele => ele.typeCode === val)[0] || {}).description,
        },
      {
        title: intl.get(`${modelPrompt}.userVerification`).d('需要用户验证'),
        dataIndex: 'userVerification',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.userVerification === 'Y' ? 'success' : 'error'}
            text={
              record.userVerification === 'Y'
                ? intl.get(`${modelPrompt}.open`).d('启用')
                : intl.get(`${modelPrompt}.forbidden`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.eventTime`).d('变更时间'),
        dataIndex: 'eventTime',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.createBy`).d('事件人'),
        dataIndex: 'eventUserName',
        width: 90,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.eventId`).d('事件ID'),
        dataIndex: 'eventId',
        width: 90,
        align: 'left',
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
              dataSource={tagListHistory}
              pagination={tagPaginationHistory}
              onChange={this.handleTableChange}
              scroll={{ x: 2300 }}
            />
          </div>
        </Spin>
      </Modal>
    );
  }
}
