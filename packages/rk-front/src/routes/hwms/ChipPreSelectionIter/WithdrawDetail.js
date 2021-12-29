// 撤回详情
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Button, Table, DatePicker } from 'hzero-ui';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import Lov from 'components/Lov';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { getCurrentOrganizationId, getDateTimeFormat } from 'utils/utils';
import { isFunction } from 'lodash';
import { Button as ButtonPermission } from 'components/Permission';
import styles from './index.less';

@connect(({ chipPreSelection, loading }) => ({
  chipPreSelection,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['chipPreSelection/queryDataByWithdraw'],
  saveLoading: loading.effects['chipPreSelection/doWithdraw'],
}))
@Form.create({ fieldNameProp: null })
export default class LotDetail extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {};
  }

  // 加载时调用
  componentDidMount() {
    this.handleFormReset();
  }

  /**
   * 撤回
   */
  @Bind()
  doWithdraw() {
    // 传入对应的数据
    const { doWithdraw, paginationMap } = this.props;
    doWithdraw(
      {
        ...this.props.form.getFieldsValue(),
        creationDateFrom:
          this.props.form.getFieldValue('creationDateFrom') === undefined ||
          this.props.form.getFieldValue('creationDateFrom') === null
            ? null
            : moment(this.props.form.getFieldValue('creationDateFrom')).format(
                DEFAULT_DATETIME_FORMAT
              ),
        creationDateTo:
          this.props.form.getFieldValue('creationDateTo') === undefined ||
          this.props.form.getFieldValue('creationDateTo') === null
            ? null
            : moment(this.props.form.getFieldValue('creationDateTo')).format(
                DEFAULT_DATETIME_FORMAT
              ),
      },
      paginationMap.length > 0 ? Number(paginationMap.map(item => item.value)[0]) : 10
    );
  }

  // 查询对应的信息
  @Bind()
  queryLotData() {
    const { dispatch, paginationMap, doSetPage } = this.props;
    // 暂存查询条件
    doSetPage({
      pageSize: paginationMap.length > 0 ? Number(paginationMap.map(item => item.value)[0]) : 10,
    });
    // 查询数据
    dispatch({
      type: 'chipPreSelection/queryDataByWithdraw',
      payload: {
        ...this.props.form.getFieldsValue(),
        creationDateFrom:
          this.props.form.getFieldValue('creationDateFrom') === undefined ||
          this.props.form.getFieldValue('creationDateFrom') === null
            ? null
            : moment(this.props.form.getFieldValue('creationDateFrom')).format(
                DEFAULT_DATETIME_FORMAT
              ),
        creationDateTo:
          this.props.form.getFieldValue('creationDateTo') === undefined ||
          this.props.form.getFieldValue('creationDateTo') === null
            ? null
            : moment(this.props.form.getFieldValue('creationDateTo')).format(
                DEFAULT_DATETIME_FORMAT
              ),
        size: paginationMap.length > 0 ? Number(paginationMap.map(item => item.value)[0]) : 10,
      },
    });
  }

  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  // 查询对应的信息
  @Bind()
  queryLotDataByPagination(page) {
    const { dispatch, doSetPage } = this.props;

    // 暂存查询条件
    doSetPage(page);

    // 查询数据
    dispatch({
      type: 'chipPreSelection/queryDataByWithdraw',
      payload: {
        ...this.props.form.getFieldsValue(),
        creationDateFrom:
          this.props.form.getFieldValue('creationDateFrom') === undefined ||
          this.props.form.getFieldValue('creationDateFrom') === null
            ? null
            : moment(this.props.form.getFieldValue('creationDateFrom')).format(
                DEFAULT_DATETIME_FORMAT
              ),
        creationDateTo:
          this.props.form.getFieldValue('creationDateTo') === undefined ||
          this.props.form.getFieldValue('creationDateTo') === null
            ? null
            : moment(this.props.form.getFieldValue('creationDateTo')).format(
                DEFAULT_DATETIME_FORMAT
              ),
        page,
      },
    });
  }

  // 改变中部底色
  @Bind
  changeBackColor(record) {
    if (!record.changeBackColor) {
      return styles['data-click-chip-lter'];
    } else {
      return '';
    }
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      expandDrawer,
      dataSource,
      updateMaterialLotCode,
      expandUpColseData,
      form,
      rowsSelection,
      fetchLoading,
      saveLoading,
      materialLotCode,
      paginationMap,
      pagination,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    // 获取表单的字段属性
    const columns = [
      {
        title: '序号',
        width: 60,
        render: (value, record, index) => index + 1,
      },
      {
        title: '挑选批次',
        dataIndex: 'selectLot',
        width: 100,
      },
      {
        title: '原盒子号',
        dataIndex: 'materialLotCode',
        width: 150,
      },
      {
        title: '原盒位置',
        dataIndex: 'oldLoad',
        width: 90,
      },
      {
        title: '目标条码',
        dataIndex: 'targetMaterialLotCode',
        width: 150,
      },
      {
        title: '目标位置',
        dataIndex: 'targetLoad',
        width: 150,
      },
      {
        title: '热沉编号',
        dataIndex: 'hotSinkCode',
        width: 120,
      },
      {
        title: '虚拟号',
        dataIndex: 'virtualNum',
        width: 80,
      },
      // {
      //   title: '器件编码',
      //   dataIndex: 'deviceNumber',
      //   width: 120,
      // },
      {
        title: '路数',
        dataIndex: 'ways',
        width: 80,
      },
      {
        title: '状态',
        dataIndex: 'statusMeaning',
        width: 80,
      },
      {
        title: '时间',
        dataIndex: 'creationDate',
        width: 150,
      },
    ];

    // 获取表单的字段属性
    return (
      <Modal
        destroyOnClose
        width={1500}
        onCancel={expandUpColseData}
        onOk={() => updateMaterialLotCode()}
        visible={expandDrawer}
        footer={null}
        title="挑选结果撤回"
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={5}>
              <Form.Item labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="挑选批次">
                {getFieldDecorator('selectLot', {
                  initialValue: materialLotCode,
                })(
                  <Lov
                    isInput
                    code="HME.SELECT_LOT"
                    queryParams={{ tenantId: getCurrentOrganizationId() }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="虚拟号">
                {getFieldDecorator('virtualNum', {})(<Input />)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="原盒子号">
                {getFieldDecorator('materialLotCode', {})(<Input />)}
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item>
                <Button
                  loading={saveLoading}
                  type="primary"
                  htmlType="submit"
                  onClick={this.queryLotData}
                >
                  查询
                </Button>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item>
                <Button onClick={this.handleFormReset}>重置</Button>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item>
                <ButtonPermission
                  permissionList={[
                    {
                      code: 'hzero.hwms.chipk-pre-selection.ps.do-back',
                      type: 'button',
                      meaning: '撤回',
                    },
                  ]}
                  loading={saveLoading}
                  type="primary"
                  onClick={this.doWithdraw}
                >
                  撤回
                </ButtonPermission>
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={5}>
              <Form.Item labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="挑选时间从">
                {getFieldDecorator(
                  'creationDateFrom',
                  {}
                )(
                  <DatePicker
                    showTime
                    placeholder=""
                    style={{ width: '100%' }}
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                      getFieldValue('creationDateTo') &&
                      moment(getFieldValue('creationDateTo')).isBefore(currentDate, 'second')
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="挑选时间至">
                {getFieldDecorator(
                  'creationDateTo',
                  {}
                )(
                  <DatePicker
                    showTime
                    placeholder=""
                    style={{ width: '100%' }}
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                      getFieldValue('creationDateFrom') &&
                      moment(getFieldValue('creationDateFrom')).isAfter(currentDate, 'second')
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="目标盒子">
                {getFieldDecorator('newMaterialLotCode', {})(<Input />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className="stopTableChipLterLot">
          <Table
            columns={columns}
            bordered
            loading={fetchLoading}
            pagination={{
              ...pagination,
              defaultPageSize:
                paginationMap.length > 0 ? Number(paginationMap.map(item => item.value)[0]) : 10,
              pageSizeOptions:
                paginationMap.length > 0 ? paginationMap.map(item => Number(item.value)) : [],
            }}
            dataSource={dataSource}
            rowKey="selectionDetailsId"
            rowClassName={this.changeBackColor}
            rowSelection={rowsSelection}
            onChange={page => this.queryLotDataByPagination(page)}
          />
        </div>
      </Modal>
    );
  }
}
