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
import { Modal, Form, Button, Spin, Row, Col, DatePicker } from 'hzero-ui';
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
  fetchLoading: loading.effects['collection/fetchHistoryList'],
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
          type: 'collection/fetchObjectHistory',
          payload: {
            page: pagination,
            tagGroupId: queryFromRecord,
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
      collection: { tagObjectHistory = [], tagObjectPaginationHistory = {} },
      fetchLoading,
    } = this.props;
    const { getFieldDecorator } = form;

    const columns = [
      {
        title: intl.get(`${modelPrompt}.objectCodeHistoryId`).d('数据收集组关联对象历史ID'),
        dataIndex: 'tagGroupObjectHisId',
        width: 200,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.objectCode`).d('数据收集组编码'),
        dataIndex: 'tagGroupCode',
        width: 160,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.objectDesc`).d('物料'),
        dataIndex: 'materialCode',
        width: 200,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.numberRange`).d('工艺'),
        dataIndex: 'operationName',
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.numberRange`).d('工艺路线'),
        dataIndex: 'routerName',
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.numberRange`).d('工艺路线步骤'),
        dataIndex: 'routerStepName',
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.numberRange`).d('工作单元'),
        dataIndex: 'workcellCode',
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.numExample`).d('WO'),
        dataIndex: 'workOrderNum',
        width: 150,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('EO'),
        dataIndex: 'eoNum',
        width: 120,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.objectType`).d('NC代码'),
        dataIndex: 'ncCode',
        width: 90,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.objectType`).d('装配清单'),
        dataIndex: 'bomName',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('装配清单组件'),
        dataIndex: 'bomComponentMaterialCode',
        width: 190,
        align: 'left',
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
              dataSource={tagObjectHistory}
              pagination={tagObjectPaginationHistory}
              onChange={this.handleTableChange}
              scroll={{ x: 2300 }}
            />
          </div>
        </Spin>
      </Modal>
    );
  }
}
