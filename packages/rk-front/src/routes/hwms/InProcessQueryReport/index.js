/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 在制查询报表
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Table, Input } from 'hzero-ui';
import moment from 'moment';
import { isEmpty } from 'lodash';

import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import MultipleLov from '@/components/MultipleLov';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';
import styles from './index.less';
import ExpandDrawer from './ExpandDrawer';

const tenantId = getCurrentOrganizationId();

const commonModelPrompt = 'tarzan.hwms.inProcessQueryReport';

@connect(({ inProcessQueryReport, loading }) => ({
  inProcessQueryReport,
  fetchListLoading: loading.effects['inProcessQueryReport/queryDataList'],
}))
@Form.create({ fieldNameProp: null })
export default class InProcessQueryReport extends Component {
  state = {
    expandForm: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inProcessQueryReport/getSiteList',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'inProcessQueryReport/updateState',
      payload: {
        headList: [],
        headPagination: {},
        colData: [],
        expandDrawer: false, // 弹出创建层
        sumData: "",
        searchForDetail: {}, // 查询明细的数据
      },
    });
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'inProcessQueryReport/queryDataList',
          payload: filterNullValueObject({
            ...values,
            page: isEmpty(page) ? {} : {...page, pageSize: page.pageSize - 1},
            startTime: isEmpty(values.startTime) ? null : moment(values.startTime).format(DEFAULT_DATETIME_FORMAT),
            endTime: isEmpty(values.endTime) ? null : moment(values.endTime).format(DEFAULT_DATETIME_FORMAT),
          }),
        });
      }
    });
  }

  @Bind
  onDetail(workcellId, flag, materialId) {
    this.setState({ searchForDetail: { workcellId, flag, materialId }, expandDrawer: !this.state.expandDrawer });
    const { dispatch } = this.props;
    // 根据页数查询报表明细信息
    dispatch({
      type: 'inProcessQueryReport/fetchDetailList',
      payload: {
        workcellId, flag, materialId,
      },
    });
  }

  @Bind
  onSearch(page = {}) {
    const { dispatch } = this.props;
    // 根据页数查询报表明细信息
    dispatch({
      type: 'inProcessQueryReport/fetchDetailList',
      payload: {
        ...this.state.searchForDetail,
        page,
      },
    });
  }

  @Bind
  expandColseData() {
    this.setState({ expandDrawer: !this.state.expandDrawer });
  }

  // 设置展开/关闭 更多查询
  @Bind()
  setExpandForm() {
    this.setState({ expandForm: !this.state.expandForm });
  }

  // 重置查询
  @Bind
  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };

  @Bind
  handleExport() {
    const { dispatch } = this.props;
    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'inProcessQueryReport/handleExport',
          payload: {
            ...values,
            startTime:
              values.startTime == null
                ? ''
                : moment(values.startTime).format(DEFAULT_DATETIME_FORMAT),
            endTime:
              values.endTime == null ? '' : moment(values.endTime).format(DEFAULT_DATETIME_FORMAT),
          },
        }).then(res => {
          if (res) {
            const file = new Blob(
              [res],
              { type: 'application/vnd.ms-excel' }
            );
            const fileURL = URL.createObjectURL(file);
            const fileName = '在制查询报表.xls';
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = fileURL;
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          }
        });;
      }
    });
  }

  // 渲染 界面布局
  render() {
    // 获取默认数据
    const {
      fetchListLoading,
      handleExportLoading,
      inProcessQueryReport: {
        headList = [],
        headPagination = {},
        colData = [],
        detailList = [],
        detailPagination = {},
        defaultSite = {},
        qty,
      },
    } = this.props;
    const pagination = {...headPagination, pageSize: headPagination.pageSize + 1};
    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.prodLineName`).d('生产线'),
        dataIndex: 'prodLineName',
        align: 'center',
        render: (val, record, index) => {
          if(index === 0) {
            const obj = {
              props: {},
              children: (
                <div>
                  工序合计
                </div>
              ),
            };
            obj.props.colSpan = 4;
            return obj;
          } else {
            return val;
          }
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('产品编码'),
        dataIndex: 'materialCode',
        align: 'center',
        render: (val, record, index) => {
          if(index === 0) {
            const obj = {
              props: {},
            };
            obj.props.colSpan = 0;
            return obj;
          } else {
            return val;
          }
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        align: 'left',
        render: (val, record, index) => {
          if(index === 0) {
            const obj = {
              props: {},
            };
            obj.props.colSpan = 0;
            return obj;
          } else {
            return val;
          }
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('待上线'),
        dataIndex: 'queueNum',
        align: 'center',
        render: (val, record, index) => {
          if(index === 0) {
            const obj = {
              props: {},
            };
            obj.props.colSpan = 0;
            return obj;
          } else {
            return (<a onClick={() => this.onDetail(record.prodLineId, "Q", record.materialId)}>{val}</a>);
          }
        },
      },
      ...colData.map(v => {
        const workCellKey = v.workcellId.split('.').join('#');
        return {
          title: `${v.description}`,
          children: [
            {
              title: '运行',
              dataIndex: `${workCellKey}runNum`,
              className: styles['data-one'],
              align: 'center',
              render: (val, record, index) => {
                if(index === 0) {
                  const obj = {
                    props: {},
                    children: (
                      <div>
                        {record[workCellKey]}
                      </div>
                    ),
                  };
                  obj.props.colSpan = 2;
                  return obj;
                } else if (record.materialName !== "合计") {
                  return (<a onClick={() => this.onDetail(v.workcellId, "Y", record.materialId)}>{val}</a>);
                }
              },
            },
            {
              title: '库存',
              dataIndex: `${workCellKey}finishNum`,
              className: styles['data-two'],
              align: 'center',
              render: (val, record, index) => {
                if(index === 0) {
                  const obj = {
                    props: {},
                  };
                  obj.props.colSpan = 0;
                  return obj;
                } else if (record.materialName !== "合计") {
                  return (<a onClick={() => this.onDetail(v.workcellId, "N", record.materialId)}>{val}</a>);
                }
              },
            },
          ],
        };
      }),
      {
        title: intl.get(`${commonModelPrompt}.unCount`).d('未入库库存'),
        dataIndex: 'unCount',
        render: (val, record) => {
          if (record.materialName !== "合计") {
            // return val;
            return (<a onClick={() => this.onDetail(record.prodLineId, "M", record.materialId)}>{val}</a>);
          }
          return {
            children: val,
            props: {
              className: styles['data-last'],
            },
          };
        },
      },
    ];

    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator } = form;
    const expandDataProps = {
      expandDrawer: this.state.expandDrawer,
      onCancel: this.expandColseData,
      onSearch: this.onSearch,
      detailList,
      detailPagination,
    };
    //  返回默认界面数据
    return (
      <Fragment>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('在制查询报表')}>
          <Button
            type="primary"
            icon='export'
            onClick={() => this.handleExport()}
            loading={handleExportLoading}
          >
            导出
          </Button>
          <div className={styles['title-form-item']}>
            <Form.Item label="在制合计" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {qty}
            </Form.Item>
          </div>
        </Header>
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.siteId`).d('站点')}
                >
                  {getFieldDecorator('siteCode', {
                    initialValue: defaultSite.siteCode,
                  })(
                    <Input disabled />
                  )}
                </Form.Item>
                <Form.Item style={{ display: 'none' }}>
                  {getFieldDecorator('siteId', {
                    initialValue: defaultSite.siteId,
                  })(
                    <Input disabled />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.prodLineId`).d('产线')}
                >
                  {getFieldDecorator('prodLineId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonModelPrompt}.prodLineId`).d('产线'),
                        }),
                      },
                    ],
                  })(
                    <Lov code="MT.PRODLINE" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialId`).d('物料编码')}
                >
                  {getFieldDecorator('materialId')(
                    <MultipleLov code="HME.SITE_MATERIAL" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
                <Form.Item>
                  <Button onClick={this.resetSearch.bind(this)}>
                    {intl.get(`hzero.common.button.reset`).d('重置')}
                  </Button>
                  <Button type="primary" htmlType="submit" onClick={() => this.handleSearch()}>
                    {intl.get(`hzero.common.button.search`).d('查询')}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div className="tableClass">
            <Table
              bordered
              dataSource={headList}
              columns={columns}
              pagination={pagination}
              onChange={this.handleSearch}
              loading={fetchListLoading}
              bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
            />
            <ModalContainer ref={registerContainer} />
          </div>

        </Content>
        {this.state.expandDrawer && <ExpandDrawer {...expandDataProps} />}
      </Fragment>
    );
  }
}
