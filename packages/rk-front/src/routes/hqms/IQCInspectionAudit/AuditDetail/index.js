/*
 * @Description: 明细
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-19 09:46:07
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-09-15 13:50:55
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Row, Col, Button, Table, Spin, notification, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import UploadModal from 'components/Upload/index';
import { isEmpty } from 'lodash';
import TopFormInfo from './TopFormInfo';
import ListTableRow from './ListTableRow';

@connect(({ iqcInspectionAudit, loading }) => ({
  iqcInspectionAudit,
  tenantId: getCurrentOrganizationId(),
  fetchRowDetailLoading: loading.effects['iqcInspectionAudit/handleSearchRowDetail'],
  fetchiqcLineLoading: loading.effects['iqcInspectionAudit/fetchiqcLine'],
}))
export default class TicketManagement extends Component {
  constructor(props) {
    super(props);
    const { iqcHeaderId, objectVersionNumber } = this.props.match.params;
    this.state = {
      selectedHeadKeys: [],
      selectedHead: [],
      iqcHeaderId,
      objectVersionNumber,
      auditisDetail: false,
      butFlag: false,
      docType: '',
    };
  }

  filterForm;

  componentDidMount() {
    this.fetchAuditistDetail();
    this.fetchiqcLine();
  }

  // 获取iqc检验审核数据
  @Bind()
  fetchAuditistDetail(params = {}) {
    const { dispatch, tenantId } = this.props;
    this.setState({ auditisDetail: true });
    dispatch({
      type: 'iqcInspectionAudit/fetchAuditistDetail',
      payload: {
        tenantId,
        page: isEmpty(params) ? {} : params,
        iqcHeaderId: this.state.iqcHeaderId,
      },
    }).then(res => {
      this.setState({ docType: res.content[0].docType });
      if (res.content[0].inspectionStatus === 'TBD') {
        this.setState({ butFlag: false });
      } else {
        this.setState({ butFlag: true });
      }
      this.setState({ auditisDetail: false });
    });
  }

  // 获取检验单行数据
  @Bind()
  fetchiqcLine(params = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'iqcInspectionAudit/fetchiqcLine',
      payload: {
        tenantId,
        page: isEmpty(params) ? {} : params,
        iqcHeaderId: this.state.iqcHeaderId,
      },
    });
  }

  /**
   * 获取查询表单组件this对象
   * @param {object} ref - 查询表单组件this
   */
  @Bind
  handleBindRef(ref) {
    this.filterForm = (ref.props || {}).form;
  }

  // 选中表格行
  @Bind()
  onSelectTableRow(selectedHeadKeys, selectedHead) {
    this.setState({ selectedHeadKeys, selectedHead }, () => {
      this.handleSearchRowDetail();
    });
  }

  // 查询质检单明细数据
  @Bind()
  handleSearchRowDetail(params) {
    const { dispatch, tenantId } = this.props;
    const { selectedHead } = this.state;
    dispatch({
      type: 'iqcInspectionAudit/handleSearchRowDetail',
      payload: {
        iqcLineId: selectedHead[0].iqcLineId,
        tenantId,
        page: isEmpty(params) ? {} : params,
      },
    });
  }

  // 让步、挑选、退货
  @Bind()
  auditis(inspectionStatus, finalDecision) {
    Modal.confirm({
      title: '执行后数据无法修改, 是否继续执行',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch, tenantId, history } = this.props;
        const filterValue = this.filterForm === undefined ? {} : this.filterForm.getFieldsValue();
        dispatch({
          type: 'iqcInspectionAudit/auditis',
          payload: {
            ...filterValue,
            inspectionStatus,
            finalDecision,
            tenantId,
            objectVersionNumber: this.state.objectVersionNumber,
            iqcHeaderId: this.state.iqcHeaderId,
          },
        }).then(res => {
          if (res) {
            this.setState({ butFlag: true });
            notification.success({ message: '操作成功！' });
            history.push(`/hqms/iqc-inspection-audit`);
          }
        });
      },
    });
  }

  render() {
    const {
      iqcInspectionAudit: {
        rowDetailList = [],
        rowDetailListPagination = {},
        iqcLine = [],
        iqcLinePagination = {},
        iqcHeader = [],
      },
      fetchiqcLineLoading,
      fetchRowDetailLoading,
    } = this.props;
    const { selectedHeadKeys, docType } = this.state;
    const columns = [
      {
        title: '序号',
        width: 70,
        dataIndex: 'number',
        align: 'center',
      },
      {
        title: '结果值',
        width: 70,
        dataIndex: 'result',
        align: 'center',
      },
      {
        title: '备注',
        width: 70,
        dataIndex: 'remark',
        align: 'center',
      },
    ];
    return (
      <Fragment>
        <Header title="IQC检验单明细" backPath="/hqms/iqc-inspection-audit">
          <Button
            type="primary"
            onClick={() => this.auditis('COMPLETED', 'FX')}
            disabled={this.state.butFlag}
          >
            现场返修
          </Button>
          <Button
            type="primary"
            onClick={() => this.auditis('COMPLETED', 'RB')}
            disabled={this.state.butFlag}
          >
            让步
          </Button>
          <Button
            type="primary"
            onClick={() => this.auditis('TBP', 'TX')}
            disabled={this.state.butFlag || docType === 'IQC_DOC'}
          >
            挑选
          </Button>
          <Button
            type="primary"
            onClick={() => this.auditis('COMPLETED', 'TH')}
            disabled={this.state.butFlag}
          >
            退货
          </Button>
          <Button style={{ backgroundColor: '#06B809', color: '#fff' }}>
            <UploadModal
              // bucketName="xxx-bucket"
              // attachmentUUID={attachmentUuid}
              // afterOpenUploadModal={this.afterOpenUploadModal}
              // uploadSuccess={this.uploadSuccess}
              // removeCallback={this.removeCallback}
              // filesNumber={filesNumber}
              btnText="图纸"
              icon={false}
            />
          </Button>
        </Header>
        <Content>
          <Spin spinning={this.state.auditisDetail}>
            <Row>
              <Col span={18}>
                <TopFormInfo iqcHeader={iqcHeader[0]} onRef={this.handleBindRef} />
              </Col>
              <Col span={5}>
                <Table
                  bordered
                  columns={columns}
                  loading={fetchRowDetailLoading}
                  dataSource={rowDetailList}
                  pagination={rowDetailListPagination}
                  onChange={page => this.handleSearchRowDetail(page)}
                />
              </Col>
            </Row>
          </Spin>
          <Row>
            <Col span={24} style={{ marginRight: '20px' }}>
              <ListTableRow
                onSelectTableRow={this.onSelectTableRow}
                selectedHeadKeys={selectedHeadKeys}
                iqcLine={iqcLine}
                iqcLinePagination={iqcLinePagination}
                onSearch={page => this.fetchiqcLine(page)}
                loading={fetchiqcLineLoading}
              />
            </Col>
          </Row>
        </Content>
      </Fragment>
    );
  }
}
