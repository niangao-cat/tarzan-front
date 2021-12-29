/**
 * 异常信息维护 - AbnormalInfo
 * @date: 2020/05/09 10:12:38
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Fragment, useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import { Button, Spin, Form, Modal } from 'hzero-ui';
import uuid from 'uuid/v4';
import { isEmpty, isUndefined } from 'lodash';
import queryString from 'querystring';

import { Header, Content } from 'components/Page';
import { openTab } from 'utils/menuTab';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import BaseInfo from './BaseInfo';
import OpticsItems from './OpticsItems';
import ElectricityItem from './ElectricityItem';
import HourlyWage from './HourlyWage';

const OPTIONS = {
  CREATE: '新增',
  EDIT: '编辑',
  DELETE: '删除',
};;


const AfterSaleQuotation = (props) => {

  const [isRevise, setIsRevise] = useState(false);
  const [currentOption, setCurrentOption] = useState(null); // 当前状态若为“提交”， 需要限制行上只能执行一个操作， 修改 或 新增 或 删除

  const baseInfoForm = useRef();
  const opticsItemsForm = useRef();
  const electricityItemForm = useRef();

  const handleInit = () => {
    const { dispatch } = props;
    dispatch({
      type: 'afterSaleQuotation/updateState',
      payload: {
        baseInfo: {},
        electricLineList: [],
        hourFeeLineList: [],
        opticsLineList: [],
        deleteLineList: [],
      },
    });
    dispatch({
      type: 'afterSaleQuotation/fetchDefaultSite',
    });
    setCurrentOption(null);
    setIsRevise(false);
    if (baseInfoForm.current && !isRevise) {
      baseInfoForm.current.formFields.resetFields();
    }
  };

  useEffect(() => {
    handleInit();
  }, []);

  const handleScanSnNum = (snNum) => {
    const { dispatch } = props;
    setCurrentOption(null);
    setIsRevise(false);
    dispatch({
      type: 'afterSaleQuotation/fetchSnInfo',
      payload: snNum,
    }).then(res => {
      if (res && res.headData.message) {
        Modal.info({
          title: res.headData.message,
        });
      }
    });
  };

  const handleCreate = () => {
    const { dispatch, afterSaleQuotation: { baseInfo } } = props;
    dispatch({
      type: 'afterSaleQuotation/create',
      payload: baseInfo.snNum,
    }).then(res => {
      if (res) {
        notification.success();
      }
    });
  };

  const handleCreateLine = (listName, idName) => {
    const { dispatch, afterSaleQuotation } = props;
    const { baseInfo } = afterSaleQuotation;
    const dataSource = afterSaleQuotation[listName];
    if (!currentOption && baseInfo.status === 'SUBMIT') {
      setCurrentOption('CREATE');
    } else if (currentOption !== 'CREATE' && baseInfo.status === 'SUBMIT') {
      return notification.warning({ description: `当前单据只能进行“${OPTIONS[currentOption]}“行操作` });
    }
    dispatch({
      type: 'afterSaleQuotation/updateState',
      payload: {
        [listName]: [
          {
            [idName]: uuid(),
            _status: 'create',
          },
          ...dataSource,
        ],
      },
    });
  };

  /**
   * 编辑当前行
   *
   * @param {string} dataSource 数据源在model里的名称
   * @param {string} id 数据源的id名称
   * @param {object} current 当前行
   * @param {boolean} flag
   * @memberof ContractBaseInfo
   */
  const handleEditLine = (dataSource, id, current, flag) => {
    const { dispatch, afterSaleQuotation } = props;
    const list = afterSaleQuotation[dataSource];
    const { baseInfo } = afterSaleQuotation;
    if (!currentOption && baseInfo.status === 'SUBMIT') {
      setCurrentOption('EDIT');
    } else if (currentOption !== 'EDIT' && baseInfo.status === 'SUBMIT') {
      return notification.warning({ description: `当前单据只能进行“${OPTIONS[currentOption]}“行操作` });
    }
    const newList = list.map(item =>
      item[id] === current[id] ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'afterSaleQuotation/updateState',
      payload: {
        [dataSource]: newList,
      },
    });
  };

  /**
   * 清除当前行
   *
   * @param {string} dataSource
   * @param {string} id
   * @param {object} current
   * @memberof ContractBaseInfo
   */
  const handleCleanLine = (dataSource, id, current) => {
    const { dispatch, afterSaleQuotation } = props;
    const list = afterSaleQuotation[dataSource];
    const newList = list.filter(item => item[id] !== current[id]);
    dispatch({
      type: 'afterSaleQuotation/updateState',
      payload: {
        [dataSource]: newList,
      },
    });
  };

  /**
   * 删除操作
   *
   * @param {array} selectedRows 勾选项
   * @param {string} dataSourceName 数据源模板
   * @param {string} idName 主键id名称
   * @param {string} effects
   * @memberof ContractBaseInfo
   */
  const handleDelete = (record, dataSourceName) => {
    const { dispatch, afterSaleQuotation: { deleteLineList, [dataSourceName]: dataSource, baseInfo } } = props;
    if (!currentOption && baseInfo.status === 'SUBMIT') {
      setCurrentOption('DELETE');
    } else if (currentOption !== 'DELETE' && baseInfo.status === 'SUBMIT') {
      return notification.warning({ description: `当前单据只能进行“${OPTIONS[currentOption]}“行操作` });
    }
    if (!isEmpty(record)) {
      dispatch({
        type: `afterSaleQuotation/updateState`,
        payload: {
          deleteLineList: deleteLineList.concat([record]),
          [dataSourceName]: dataSource.filter(e => e.materialId !== record.materialId),
        },
      });
    }
  };

  const handleCancel = () => {
    const { dispatch } = props;
    handleGetAllInfo().then(res => {
      if (res) {
        dispatch({
          type: 'afterSaleQuotation/cancel',
          payload: res,
        }).then(result => {
          if (result && result.type === 'S') {
            notification.success({ description: result.message });
            handleScanSnNum(baseInfo.snNum);
          } else if (result && result.type === 'E') {
            notification.error({ description: result.message });
          }
        });
      }
    });
  };

  const handleRevise = () => {
    const { dispatch } = props;
    if (!isRevise) {
      setIsRevise(true);
    } else {
      handleGetAllInfo().then(res => {
        if (res) {
          dispatch({
            type: 'afterSaleQuotation/revise',
            payload: res,
          }).then(result => {
            if (result && result.type === 'S') {
              notification.success({ description: result.message });
              setIsRevise(false);
              handleScanSnNum(baseInfo.snNum);
              handleInit();
            } else if (result && result.type === 'E') {
              notification.error({ description: result.message });
            }
          });
        }
      });
    }
  };


  const handleToReport = () => {
    const { afterSaleQuotation: { baseInfo } } = props;
    openTab({
      key: `/hhme/after-sale-quotation-report`, // 打开 tab 的 key
      path: `/hhme/after-sale-quotation-report`, // 打开页面的path
      title: '售后报价单报表',
      search: queryString.stringify({
        serialNumber: baseInfo.snNum,
      }),
      closable: true,
    });
  };

  const getEditTableData = (
    dataSource = [],
    filterList = [],
    scrollOptions = {},
    treeChildrenAlias = 'children'
  ) => {
    const paramsList = [];
    const errList = [];
    const fetchForm = (source, list) => {
      if (Array.isArray(source)) {
        for (let i = 0; i < source.length; i++) {
          if (source[i].$form && source[i]._status) {
            source[i].$form.validateFieldsAndScroll(
              { scroll: { allowHorizontalScroll: true }, ...scrollOptions },
              (err, values) => {
                if (!err) {
                  const { $form, ...otherProps } = source[i];
                  if (Array.isArray(filterList) && filterList.length > 0) {
                    for (const name of filterList) {
                      // 如果record中存在需要过滤的值，且是新增操作，执行过滤，默认过滤$form
                      // eslint-disable-next-line
                      if (source[i][name] && source[i]._status === 'create') {
                        delete otherProps[name];
                        // eslint-disable-next-line
                        delete values[name];
                      }
                    }
                  }
                  list.push({ ...otherProps, ...values });
                } else {
                  // 捕获表单效验错误
                  errList.push(err);
                }
                return err;
              }
            );
          } else {
            list.push(source[i]);
          }
          if (source[i][treeChildrenAlias] && Array.isArray(source[i][treeChildrenAlias])) {
            fetchForm(source[i][treeChildrenAlias], list);
          }
        }
      }
    };
    fetchForm(dataSource, paramsList);
    return errList.length > 0 ? [] : paramsList;
  };

  /**
   * 校验行编辑
   *
   * @param {array} [dataSource=[]] 数组
   * @param {array} [excludeKeys=[]]
   * @param {object} [property={}]
   * @returns
   * @memberof ContractBaseInfo
   */
  const validateEditTable = (dataSource = [], excludeKeys = [], property = {}) => {
    if (dataSource.length === 0) {
      return Promise.resolve([]);
    }
    return new Promise((resolve, reject) => {
      const validateDataSource = getEditTableData(dataSource, excludeKeys, property);
      if (validateDataSource.length === 0) {
        reject(
          notification.error({
            description: intl
              .get('ssrm.leaseContractCreate.view.message.error')
              .d('请完整页面上的必填信息'),
          })
        );
      } else {
        resolve(validateDataSource);
      }
    });
  };

  const handleGetAllInfo = () => {
    const { afterSaleQuotation: { electricLineList, opticsLineList, hourFeeLineList, deleteLineList } } = props;
    return Promise.all([
      validateEditTable(electricLineList),
      validateEditTable(opticsLineList),
      validateEditTable(hourFeeLineList),
    ]).then(res => {
      let info = {};
      if (res) {
        const [newElectricLineList, newOpticsLineList, newHourFeeList] = res;
        const baseInfoFormValue = isUndefined(baseInfoForm.current) ? {} : baseInfoForm.current.formFields.getFieldsValue();
        const opticsItemsFormValue = isUndefined(opticsItemsForm.current) ? {} : opticsItemsForm.current.formFields.getFieldsValue();
        const electricityItemFormValue = isUndefined(electricityItemForm.current) ? {} : electricityItemForm.current.formFields.getFieldsValue();
        info = {
          deleteLineList,
          electricLineList: newElectricLineList,
          opticsLineList: newOpticsLineList,
          hourFeeLineList: newHourFeeList,
          headData: {
            ...baseInfo,
            ...baseInfoFormValue,
          },
          opticsNoFlag: opticsItemsFormValue.opticsNoFlag ? 'Y' : 'N',
          electricNoFlag: electricityItemFormValue.electricNoFlag ? 'Y' : 'N',
        };
      }
      return info;
    });
  };

  const handleSave = () => {
    const { dispatch, afterSaleQuotation: { baseInfo } } = props;
    handleGetAllInfo().then(res => {
      if (res) {
        dispatch({
          type: 'afterSaleQuotation/save',
          payload: res,
        }).then(result => {
          if (result) {
            notification.success();
            handleScanSnNum(baseInfo.snNum);
          }
        });
      }
    });
  };


  const handleSubmit = () => {
    const { dispatch } = props;
    handleGetAllInfo().then(res => {
      if (res) {
        const { opticsNoFlag, opticsLineList, electricNoFlag, electricLineList } = res;
        if ((isEmpty(electricLineList) && electricNoFlag === 'N') || (isEmpty(opticsLineList) && opticsNoFlag === 'N')) {
          return notification.warning({ description: '光学器件、电学器件不输入且没有勾选"无需更换“时，不允许"提交"' });
        }
        if (isEmpty(res.hourFeeLineList)) {
          return notification.warning({ description: "工时费不能为空" });
        }
        dispatch({
          type: 'afterSaleQuotation/submit',
          payload: res,
        }).then(result => {
          if (result && result.type === 'S') {
            notification.success({ description: result.message });
            handleScanSnNum(baseInfo.snNum);
          } else if (result && result.type === 'E') {
            notification.error({ description: result.message });
          }
        });
      }
    });
  };

  const handleFetchSendDate = (data, record, listName) => {
    const { afterSaleQuotation: { baseInfo }, dispatch } = props;
    const { sendTo, snNum } = baseInfo;
    if ((record.materialId || record.materialLotId) && sendTo) {
      dispatch({
        type: 'afterSaleQuotation/fetchSendDate',
        payload: {
          snNum,
          materialId: data.materialId,
          materialLotId: data.materialLotId,
          sendTo,
          listName,
          currentMaterialId: record.materialId,
        },
      });
    }
  };


  const {
    fetchSnInfoLoading,
    tenantId,
    createLoading,
    saveLoading,
    submitLoading,
    afterSaleQuotation: {
      baseInfo = {},
      electricLineList = [],
      hourFeeLineList = [],
      opticsLineList = [],
      siteInfo = {},
    },
  } = props;
  const isEdit = ['NEW', 'STORAGE'].includes(baseInfo.status) || isRevise;
  const baseInfoProps = {
    baseInfo,
    isEdit,
    wrappedComponentRef: baseInfoForm,
    onScanSnNum: handleScanSnNum,
  };
  const opticsItemsProps = {
    baseInfo,
    tenantId,
    siteInfo,
    isEdit,
    wrappedComponentRef: opticsItemsForm,
    dataSource: opticsLineList,
    onCreate: handleCreateLine,
    onEditLine: handleEditLine,
    onCleanLine: handleCleanLine,
    onDelete: handleDelete,
    onFetchSendDate: handleFetchSendDate,
  };
  const electricityItemProps = {
    baseInfo,
    tenantId,
    siteInfo,
    isEdit,
    wrappedComponentRef: electricityItemForm,
    dataSource: electricLineList,
    onCreate: handleCreateLine,
    onEditLine: handleEditLine,
    onCleanLine: handleCleanLine,
    onDelete: handleDelete,
    onFetchSendDate: handleFetchSendDate,
  };
  const hourlyWageProps = {
    tenantId,
    siteInfo,
    isEdit,
    dataSource: hourFeeLineList,
    onCreate: handleCreateLine,
    onEditLine: handleEditLine,
    onCleanLine: handleCleanLine,
    onDelete: handleDelete,
  };
  return (
    <React.Fragment>
      <Header title="售后报价单">
        {!['CANCEL'].includes(baseInfo.status) && !isRevise && (
          <Button type="default" onClick={() => handleCancel()}>
            报价取消
          </Button>
        )}

        {['SUBMIT'].includes(baseInfo.status) && (
          <Button
            type="default"
            onClick={() => handleRevise()}
          >
            {isRevise ? '确认' : '修改'}
          </Button>
        )}
        {!isEmpty(baseInfo) && (
          <Button
            type="default"
            onClick={() => handleToReport()}
          >
            报价单历史
          </Button>
        )}
        {(['CANCEL'].includes(baseInfo.status) || !baseInfo.status) && !isRevise && (
          <Button
            type="primary"
            icon="plus"
            onClick={() => handleCreate()}
            loading={createLoading}
          >
            新建
          </Button>
        )}
        {['NEW', 'STORAGE'].includes(baseInfo.status) && !isRevise && (
          <Button
            type="primary"
            icon="save"
            onClick={() => handleSave()}
            loading={saveLoading}
          >
            保存
          </Button>
        )}
        {['STORAGE'].includes(baseInfo.status) && !isRevise && (
          <Button
            type="default"
            onClick={() => handleSubmit()}
            loading={submitLoading}
          >
            提交
          </Button>
        )}
        <Button
          type="default"
          onClick={() => handleInit()}
        >
          重置
        </Button>
      </Header>
      <Content>
        <Spin spinning={fetchSnInfoLoading || createLoading || saveLoading || false}>
          <BaseInfo {...baseInfoProps} />
          {!isEmpty(baseInfo) && (
            <Fragment>
              <OpticsItems {...opticsItemsProps} />
              <ElectricityItem {...electricityItemProps} />
              <HourlyWage {...hourlyWageProps} />
            </Fragment>
          )}

        </Spin>

      </Content>
    </React.Fragment>
  );
};

export default connect(({ afterSaleQuotation, loading }) => ({
  afterSaleQuotation,
  fetchSnInfoLoading: loading.effects['afterSaleQuotation/fetchSnInfo'],
  createLoading: loading.effects['afterSaleQuotation/create'],
  saveLoading: loading.effects['afterSaleQuotation/save'],
  submitLoading: loading.effects['afterSaleQuotation/submit'],
  cancelLoading: loading.effects['afterSaleQuotation/cancel'],
  reviseLoading: loading.effects['afterSaleQuotation/revise'],
  fetchHistoryListLoading: loading.effects['afterSaleQuotation/fetchHistoryList'],
  tenantId: getCurrentOrganizationId(),
}))(Form.create({ fieldNameProp: null })(AfterSaleQuotation));
