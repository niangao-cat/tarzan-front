/**
 * EventDetailsDrawer 对象详细信息抽屉
 * @date: 2019-7-30
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Input, Modal, Row, Col, Divider, Form } from 'hzero-ui';
import intl from 'utils/intl';
import {
  FORM_COL_2_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';
import styles from './index.less';

const modelPrompt = 'tarzan.event.eventQuery.model.eventQuery';
const FormItem = Form.Item;

@formatterCollections({
  code: ['tarzan.event.eventQuery'], // code 为 [服务].[功能]的字符串数组
})
export default class ParentEventDrawer extends React.PureComponent {
  render() {
    const { initData, visible, onCancel } = this.props;
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get('tarzan.event.eventQuery.title.parentEvent').d('父子事件')}
        visible={visible}
        onCancel={onCancel}
        onOk={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        {initData.map(item => {
          return (
            <div>
              <div style={{ paddingLeft: 14, fontSize: 14, borderLeft: '2px solid' }}>
                {item.parentEventFlag
                  ? intl.get(`${modelPrompt}.parentEvent`).d('父事件')
                  : intl.get(`${modelPrompt}.sonEvent`).d('子事件')}
              </div>
              <Divider style={{ margin: '14px 0 8px 0' }} />
              <Row {...SEARCH_FORM_ROW_LAYOUT} className={styles.row}>
                <Col {...FORM_COL_2_LAYOUT}>
                  <FormItem
                    {...DRAWER_FORM_ITEM_LAYOUT}
                    label={intl.get(`${modelPrompt}.eventId`).d('事件主键')}
                  >
                    <Input disabled defaultValue={item.eventId} />
                  </FormItem>
                </Col>
                <Col {...FORM_COL_2_LAYOUT}>
                  <FormItem
                    label={intl.get(`${modelPrompt}.eventTypeCode`).d('事件编码')}
                    {...DRAWER_FORM_ITEM_LAYOUT}
                  >
                    <Input disabled defaultValue={item.eventTypeCode} />
                  </FormItem>
                </Col>
              </Row>
              <Row {...SEARCH_FORM_ROW_LAYOUT} className={styles.row}>
                <Col {...FORM_COL_2_LAYOUT}>
                  <FormItem
                    label={intl.get(`${modelPrompt}.eventTypeDescription`).d('事件描述')}
                    {...DRAWER_FORM_ITEM_LAYOUT}
                  >
                    {' '}
                    <Input disabled defaultValue={item.eventTypeDescription} />
                  </FormItem>
                </Col>
                <Col {...FORM_COL_2_LAYOUT}>
                  <FormItem
                    label={intl.get(`${modelPrompt}.eventTime`).d('事件时间')}
                    {...DRAWER_FORM_ITEM_LAYOUT}
                  >
                    <Input disabled defaultValue={item.eventTime} />
                  </FormItem>
                </Col>
              </Row>
              <Row {...SEARCH_FORM_ROW_LAYOUT} className={styles.row}>
                <Col {...FORM_COL_2_LAYOUT}>
                  <FormItem
                    label={intl.get(`${modelPrompt}.eventTypeUserName`).d('操作人')}
                    {...DRAWER_FORM_ITEM_LAYOUT}
                  >
                    <Input disabled defaultValue={item.eventTypeUserName} />
                  </FormItem>
                </Col>
                <Col {...FORM_COL_2_LAYOUT}>
                  <FormItem
                    label={intl.get(`${modelPrompt}.requestTypeCode`).d('事件请求编码')}
                    {...DRAWER_FORM_ITEM_LAYOUT}
                  >
                    {' '}
                    <Input disabled defaultValue={item.requestTypeCode} />
                  </FormItem>
                </Col>
              </Row>
              <Row {...SEARCH_FORM_ROW_LAYOUT} className={styles.row}>
                <Col {...FORM_COL_2_LAYOUT}>
                  <FormItem
                    label={intl.get(`${modelPrompt}.workcellCode`).d('工作单元')}
                    {...DRAWER_FORM_ITEM_LAYOUT}
                  >
                    <Input disabled defaultValue={item.workcellCode} />
                  </FormItem>
                </Col>
                <Col {...FORM_COL_2_LAYOUT}>
                  <FormItem
                    label={intl.get(`${modelPrompt}.locatorCode`).d('库位')}
                    {...DRAWER_FORM_ITEM_LAYOUT}
                  >
                    <Input disabled defaultValue={item.locatorCode} />
                  </FormItem>
                </Col>
              </Row>
              <Row {...SEARCH_FORM_ROW_LAYOUT}>
                <Col {...FORM_COL_2_LAYOUT}>
                  <FormItem
                    label={intl.get(`${modelPrompt}.shiftDate`).d('班次日期')}
                    {...DRAWER_FORM_ITEM_LAYOUT}
                  >
                    <Input disabled defaultValue={item.shiftDate} />
                  </FormItem>
                </Col>
                <Col {...FORM_COL_2_LAYOUT}>
                  <FormItem
                    label={intl.get(`${modelPrompt}.shiftCode`).d('班次编码')}
                    {...DRAWER_FORM_ITEM_LAYOUT}
                  >
                    <Input disabled defaultValue={item.shiftCode} />
                  </FormItem>
                </Col>
              </Row>
            </div>
          );
        })}
      </Modal>
    );
  }
}
