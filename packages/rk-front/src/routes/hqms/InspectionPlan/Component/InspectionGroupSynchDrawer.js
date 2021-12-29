/*
 * @Description: inspectionPlan
 * @version: 0.1.0
 * @Author: wenjie.yang@hand-china.com
 * @Date: 2020-04-16 16:27:45
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-24 10:12:00
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component, Fragment } from 'react';
import { Modal, Button, Row, Col, Form, Table, notification } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import {
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';


@Form.create({ fieldNameProp: null })
@connect(({ inspectionPlan, loading }) => ({
  inspectionPlan,
  fetchInspectionGroupLoading: loading.effects['inspectionPlan/fetchInspectionGroup'],
}))
export default class InspectionGroupSynchDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRow: [],
    };
  }

  componentDidMount() {
    this.fetchInspectionGroup();
  }

   // 获取检验组数据
   @Bind()
   fetchInspectionGroup(params = {}) {
     const { dispatch, inspectionSchemeId, form } = this.props;
     const filterValue = form.getFieldsValue();
     // 查询检验组
     dispatch({
       type: 'inspectionPlan/fetchInspectionGroup',
       payload: {
         inspectionSchemeId,
         ...filterValue,
         page: isEmpty(params) ? {} : params,
       },
     });
   }


  // 关闭模态框
  @Bind()
  handleCancel() {
    const { inspectionGroupSynch, dispatch } = this.props;
    // 初始化数据
    dispatch({
      type: 'inspectionPlan/updateState',
      payload: {
        inspectionGroup: [],
      },
    });
    inspectionGroupSynch(false);
  }

  // 选中行数据
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRow) {
    this.setState({ selectedRowKeys, selectedRow });
  }

  // 增量同步/全量同步
  @Bind()
  synchronize(type) {
    const { selectedRow } = this.state;
    const { dispatch, inspectionSchemeId, handleSearchLine,
      } = this.props;
    // 判断是否选中数据 ，没有则报错
    if(selectedRow.length===0){
      return notification.error({ message: '请先选中数据!' });
    }
    const param = [];
    selectedRow.forEach(item => {
      param.push({
        inspectionSchemeId,
        remark: item.remark,
        tagGroupId: item.tagGroupId,
      });
    });
    dispatch({
      type:
        type === 'PART'
          ? 'inspectionPlan/partSynchronize'
          : 'inspectionPlan/allSynchronize',
      payload: {
        param,
      },
    }).then(res => {
      if (res) {
        notification.success({ message: '操作成功！' });
        this.fetchInspectionGroup();
        handleSearchLine();
      }
    });
  }

  // 全选
  @Bind()
  handleSelectAll() {
    const {
      inspectionPlan: { inspectionGroup = [] },
    } = this.props;
    this.setState({
      selectedRowKeys: [...Array(inspectionGroup.length).keys()],
    });
  }

  render() {
    const {
      form,
      visible,
      inspectionPlan: { inspectionGroup = [] },
      fetchInspectionGroupLoading,
    } = this.props;
    const { getFieldDecorator } = form;
    const { selectedRowKeys } = this.state;
    const columns = [
      {
        title: '检验组编码',
        align: 'center',
        width: 100,
        dataIndex: 'tagGroupCode',
      },
      {
        title: '检验组描述',
        align: 'center',
        width: 100,
        dataIndex: 'tagGroupDescription',
      },
      {
        title: '备注',
        align: 'center',
        width: 240,
        dataIndex: 'remark',
      },
    ];
    return (
      <Fragment>
        <Modal
          title="检验组同步"
          visible={visible}
          onCancel={() => this.handleCancel()}
          width={800}
          footer={null}
        >
          <Row>
            <Col>
              <Form>
                <Row {...SEARCH_FORM_ROW_LAYOUT}>
                  <Col span={9}>
                    <Form.Item label="检验组编码" {...SEARCH_FORM_ITEM_LAYOUT}>
                      {getFieldDecorator('tagGroupId', {})(
                        <Lov queryParams={{ tenantId: getCurrentOrganizationId() }} code="QMS.TAG_GROUP" textField="tagGroupCode" />
              )}
                    </Form.Item>
                  </Col>
                  <Col span={15} className={SEARCH_COL_CLASSNAME}>
                    <Form.Item>
                      <Button
                        data-code="search"
                        type="primary"
                        htmlType="submit"
                        icon="search"
                        onClick={this.fetchInspectionGroup}
                      >
                        {intl.get('hzero.common.button.search').d('查询')}
                      </Button>
                      <Button type="primary" onClick={() => this.synchronize('PART')}>
                        增量同步
                      </Button>
                      <Button type="primary" onClick={() => this.synchronize('ALL')}>
                        全量同步
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table
                bordered
                rowKey="instructionId"
                loading={fetchInspectionGroupLoading}
                dataSource={inspectionGroup}
                columns={columns}
                rowSelection={{
                  selectedRowKeys,
                  onChange: this.handleSelectRow,
                }}
              />
            </Col>
          </Row>
        </Modal>
      </Fragment>
    );
  }
}
