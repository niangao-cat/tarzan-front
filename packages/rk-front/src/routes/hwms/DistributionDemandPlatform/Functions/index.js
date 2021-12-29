import React from 'react';
import { Modal, DataSet, Form, Lov } from 'choerodon-ui/pro/lib';
import { getCurrentUser } from 'utils/utils';
import { queryModalDS, adjustModalDS, batchAdjustModalDS } from '../stores/VMIProcurementDS';
import QueryModal from './QueryModal';
// eslint-disable-next-line import/no-cycle
import AdjustModal from './AdjustModal';

export function showQueryModal(closeCb = () => {}) {
  const queryDs = new DataSet({
    ...queryModalDS(),
    autoCreate: true,
  });
  const user = getCurrentUser();
  const { currentRoleName, realName, id } = user;
  const adminFlag = currentRoleName === '采购计划员';
  queryDs.get(0).set('planner', {
    plannerId: id,
    plannerName: realName,
  });
  Modal.open({
    title: '查询',
    style: { width: '7rem' },
    closable: true,
    children: <QueryModal dataSet={queryDs} adminFlag={adminFlag} />,
    okProps: { icon: 'search' },
    okText: '查询',
    cancelProps: { icon: 'cancel' },
    onOk: () => {
      const queryParams = queryDs.get(0).toData();
      closeCb(queryParams);
    },
  });
}

export function showAdjustModal(qeryParams, closeCb = () => {}) {
  const tableDs = new DataSet({
    ...adjustModalDS(),
    autoQuery: false,
  });
  tableDs.setQueryParameter('record', qeryParams);
  tableDs.query();

  Modal.open({
    title: '调整',
    style: { width: '12rem' },
    closable: true,
    children: <AdjustModal dataSet={tableDs} />,
    okProps: { icon: 'save' },
    okText: '提交',
    onOk: () => {
      return tableDs.validate().then((v) => {
        if (v) {
          return tableDs.submit().then((s) => {
            if (s) {
              closeCb();
              return true;
            } else {
              return false;
            }
          });
        } else {
          return false;
        }
      });
    },
    cancelProps: { icon: 'cancel' },
  });
}

export function showBatchAdjustModal({ dataSet, onOk }) {
  const records = dataSet.records[0].data;
  const formDs = new DataSet({
    ...batchAdjustModalDS(records.itemId, records.plantId),
    autoQuery: false,
  });
  Modal.open({
    style: { width: 380 },
    title: '批量调整供应商',
    closable: true,
    okProps: { icon: 'save' },
    cancelProps: { icon: 'cancel', color: 'gray' },
    onOk: () => {
      return formDs.validate().then((f) => {
        if (f) {
          onOk(dataSet, formDs);
        } else {
          return false;
        }
      });
    },
    children: (
      <React.Fragment>
        <Form dataSet={formDs}>
          <Lov name="supplier" placeholder="请选择供应商" />
        </Form>
      </React.Fragment>
    ),
  });
}
