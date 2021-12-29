import React, { PureComponent } from 'react';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { connect } from 'dva';
import moment from 'moment';
import { Modal, Form, Button, Spin, Badge, Row, Col, Input, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.hmes.number.model.number';
const FormItem = Form.Item;

/**
 * 修改历史展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ numberRangeDistribution, loading }) => ({
  numberRangeDistribution,
  fetchLoading: loading.effects['numberRangeDistribution/fetchHistoryList'],
}))
@Form.create({ fieldNameProp: null })
export default class HistoryDrawer extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    numrangeGroup: [],
  };

  initData(data) {
    this.setState(
      {
        numrangeGroup: data,
      },
      () => {
        this.queryValue();
      }
    );
  }

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
    const { numrangeGroup } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'numberRangeDistribution/fetchHistoryList',
          payload: {
            page: pagination,
            objectId: queryFromRecord.objectId,
            numrangeGroupList: [...new Set(numrangeGroup)].join(','),
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
      numberRangeDistribution: { historyList = [], historyPagination = {} },
      queryFromRecord,
      fetchLoading,
    } = this.props;
    const { getFieldDecorator } = form;

    const columns = [
      {
        title: intl.get(`${modelPrompt}.objectCodeHistoryId`).d('号码分配历史表ID'),
        dataIndex: 'numrangeAssignHisId',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.objectCode`).d('编码对象编码'),
        dataIndex: 'objectCode',
        width: 200,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.objectDesc`).d('编码对象描述'),
        dataIndex: 'objectDesc',
        width: 250,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.numberRange`).d('号段组号'),
        dataIndex: 'numrangeGroup',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.numberRangeDesc`).d('号段描述'),
        dataIndex: 'numDescription',
        width: 250,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.numExample`).d('号段示例'),
        dataIndex: 'numExample',
        width: 150,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.outsideNumFlag`).d('外部输入编码'),
        dataIndex: 'outsideNumFlag',
        width: 150,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.outsideNumFlag === 'Y' ? 'success' : 'error'}
            text={
              record.outsideNumFlag === 'Y'
                ? intl.get(`${modelPrompt}.open`).d('启用')
                : intl.get(`${modelPrompt}.forbidden`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 120,
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
        title: intl.get(`${modelPrompt}.objectType`).d('对象类型编码'),
        dataIndex: 'objectTypeId',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.objectTypeDesc`).d('对象类型描述'),
        dataIndex: 'objectTypeDesc',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('站点编码'),
        dataIndex: 'site',
        width: 150,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.siteDesc`).d('站点描述'),
        dataIndex: 'siteDesc',
        width: 150,
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
        dataIndex: 'createBy',
        width: 90,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.eventId`).d('事件ID'),
        dataIndex: 'eventId',
        width: 90,
        align: 'center',
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
                <Col {...FORM_COL_4_LAYOUT}>
                  <Form.Item
                    {...SEARCH_FORM_ITEM_LAYOUT}
                    label={intl.get(`${modelPrompt}.objectId`).d('编码对象')}
                  >
                    {getFieldDecorator('objectId', {
                      initialValue: queryFromRecord.description,
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_4_LAYOUT}>
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
                <Col {...FORM_COL_4_LAYOUT}>
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
                <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
                  <FormItem>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                      {intl.get(`tarzan.hmes.number.button.reset`).d('重置')}
                    </Button>
                    <Button type="primary" htmlType="submit" onClick={this.queryValue}>
                      {intl.get('tarzan.hmes.number.button.search').d('查询')}
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
              scroll={{ x: 2300 }}
            />
          </div>
        </Spin>
      </Modal>
    );
  }
}
