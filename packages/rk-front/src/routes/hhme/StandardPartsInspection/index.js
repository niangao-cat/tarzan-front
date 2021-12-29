/*
 * @Description: 标准件检验
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-01 10:16:15
 * @LastEditTime: 2021-03-09 10:59:24
 */

import React, { useRef, Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, InputNumber, Form } from 'hzero-ui';
import EditTable from 'components/EditTable';
import { Content, Header } from 'components/Page';
import notification from 'utils/notification';
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import FilterForm from './FilterForm';
import EnterSite from '@/components/EnterSite';
import styles from './index.less';

const StandardPartsInspection = (props) => {
  const [enterSiteVisible, setEnterSiteVisible] = useState(true);

  const countRef = useRef();

  useEffect(() => {
    const { dispatch, tenantId } = props;
    dispatch({
      type: 'standardPartsInspection/getSiteList',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'standardPartsInspection/batchLovData',
      payload: {
        tenantId,
      },
    });
    return ()=>{
      dispatch({
        type: 'standardPartsInspection/updateState',
        payload: {
          list: [],
          workcellInfo: {},
        },
      });
    };
  }, []); // Our deps

  // 查询table
  const handleFetchList = () => {
    const {
      dispatch,
      standardPartsInspection: {
        workcellInfo = {},
      },
    } = props;
    const fieldsValue = countRef.current.formFields;
    const materialIdList = fieldsValue.materialId ? fieldsValue.materialId.split(",") : [];
    dispatch({
      type: 'standardPartsInspection/handleFetchList',
      payload: {
        ...fieldsValue,
        materialIdList,
        operationId: workcellInfo.operationId,
        wkcShiftId: workcellInfo.wkcShiftId,
        workcellCode: workcellInfo.workcellCode,
        workcellId: workcellInfo.workcellId,
      },
    });
  };

  // 根据不同结果值渲染颜色
  const renderResult = (val) => {
    if (val.inspectResult) {
      if (parseFloat(val.inspectResult, 6) <= parseFloat(val.maximalValue ? val.maximalValue : 0, 6) && parseFloat(val.inspectResult, 6) >= parseFloat(val.minimumValue ? val.minimumValue : 0, 6)) {
        return styles['standardPartsInspection-table-ok'];
      } else if (!val.maximalValue && !val.minimumValue) {
        return styles['standardPartsInspection-table-ok'];
      } else {
        return styles['standardPartsInspection-table-ng'];
      }
    }
  };

  // 结果回车
  const onEnterDown = (e, record, index) => {
    const { dispatch, standardPartsInspection: { list } } = props;
    if (e.keyCode === 13) {
      dispatch({
        type: 'standardPartsInspection/handleSaveResult',
        payload: {
          index,
          list,
          ...record,
          inspectResult: record.$form.getFieldValue('inspectResult'),
        },
      }).then(res => {
        if (res) {
          const barcode = document.getElementById(`${index + 1}`);
          if (barcode) {
            barcode.focus();
          } else {
            const barcodeNow = document.getElementById(`${index}`);
            barcodeNow.focus();
          }
        }
      });
    }
  };

  // 查询工位
  const enterSite = (val) => {
    const {
      dispatch,
      standardPartsInspection: { defaultSite = {} },
    } = props;
    dispatch({
      type: 'standardPartsInspection/enterSite',
      payload: {
        ...val,
        siteId: defaultSite.siteId,
      },
    }).then(res => {
      if (res) {
        if (res.operationIdList.length > 1) {
          notification.error({ message: `当前${res.workcellName}存在多个工艺，请重新扫描！` });
        } else {
          setEnterSiteVisible(false);
        }
      }
    });
  };

  // 提交
  const handleSubmitResult = () => {
    const {
      standardPartsInspection: {
        list = [],
        workcellInfo = {},
      },
      dispatch,
    } = props;
    let flag = false;
    list.forEach(ele => {
      if (!ele.inspectResult) {
        flag = true;
      }
    });
    if (flag) {
      return notification.error({ message: '提交失败,存在未记录结果的检验记录,请检查!' });;
    } else {
      const fieldsValue = countRef.current.formFields;
      const materialIdList = fieldsValue.materialId ? fieldsValue.materialId.split(",") : [];
      const params = getEditTableData(list);
      dispatch({
        type: 'standardPartsInspection/handleSubmitResult',
        payload: {
          ...fieldsValue,
          materialIdList,
          inspectTagList: params,
          operationId: workcellInfo.operationId,
          wkcShiftId: workcellInfo.wkcShiftId,
          workcellCode: workcellInfo.workcellCode,
          workcellId: workcellInfo.workcellId,
        },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'standardPartsInspection/updateState',
            payload: {
              list: [],
            },
          });
          countRef.current.formFieldsReset();
          notification.success();
        }
      });
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sequence',
      width: 70,
      align: 'center',
    },
    {
      title: '检验项编码',
      dataIndex: 'tagCode',
      width: 100,
      align: 'center',
    },
    {
      title: '检验项描述',
      dataIndex: 'tagDescription',
      width: 100,
      align: 'center',
    },
    {
      title: '最小值',
      dataIndex: 'minimumValue',
      width: 100,
      align: 'center',
    },
    {
      title: '最大值',
      dataIndex: 'maximalValue',
      width: 100,
      align: 'center',
    },
    {
      title: '结果',
      dataIndex: 'inspectResult',
      width: 100,
      align: 'left',
      render: (val, record, index) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item className={renderResult(record)}>
            {record.$form.getFieldDecorator(`inspectResult`, {
              initialValue: record.inspectResult,
            })(
              <InputNumber
                style={{ width: '100%' }}
                id={`${index}`}
                className="standardPartsInspection-result"
                onKeyDown={e => onEnterDown(e, record, index)}
              />
            )}
          </Form.Item>
        ) : (
            val
          ),
    },
  ];
  const {
    standardPartsInspection: {
      list = [],
      workcellInfo = {},
      workWay = [],
      defaultSite = {},
    },
    tenantId,
    getSiteListLoading,
    enterSiteLoading,
    handleFetchListLoading,
    handleSaveResultLoading,
    handleSubmitResultLoading,
  } = props;
  const filterFormProps = {
    handleFetchList,
    workcellInfo,
    workWay,
    tenantId,
    siteId: defaultSite.siteId,
    handleFetchListLoading,
  };
  const enterSiteProps = {
    visible: enterSiteVisible,
    loading: getSiteListLoading || (enterSiteLoading || false),
    closePath: '/hhme/standard-parts-inspection',
    enterSite,
  };
  return (
    <Fragment>
      <Header title="标准件检验">
        <Button
          type="primary"
          onClick={() => handleSubmitResult()}
          loading={handleSubmitResultLoading}
        >
          提交
        </Button>
      </Header>
      <Content>
        <FilterForm {...filterFormProps} wrappedComponentRef={countRef} />
        <div className={styles['standardPartsInspection-title']}>
          标准件检验
        </div>
        <Row>
          <Col span={22} className={styles['standardPartsInspection-table']}>
            <EditTable
              dataSource={list}
              columns={columns}
              loading={handleFetchListLoading || handleSaveResultLoading}
              rowKey="id"
              bordered
              onChange={page => handleFetchList(page)}
              pagination={false}
            />
          </Col>
          <Col span={2} style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              onClick={() => handleFetchList()}
              disabled={list.length === 0}
            >
              刷新
            </Button>
          </Col>
        </Row>
        {enterSiteVisible && <EnterSite {...enterSiteProps} />}
      </Content>
    </Fragment>
  );
};

export default connect(({ standardPartsInspection, loading }) => ({
  standardPartsInspection,
  getSiteListLoading: loading.effects['standardPartsInspection/getSiteList'],
  enterSiteLoading: loading.effects['standardPartsInspection/enterSite'],
  handleFetchListLoading: loading.effects['standardPartsInspection/handleFetchList'],
  handleSaveResultLoading: loading.effects['standardPartsInspection/handleSaveResult'],
  handleSubmitResultLoading: loading.effects['standardPartsInspection/handleSubmitResult'],
  tenantId: getCurrentOrganizationId(),
}))(StandardPartsInspection);