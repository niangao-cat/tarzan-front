/**
 * EventDetailsDrawer 对象详细信息抽屉
 * @date: 2019-7-30
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Input, Modal, Row, Col } from 'hzero-ui';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { SEARCH_FORM_ROW_LAYOUT } from '@/utils/constants';
import styles from './index.less';

const modelPrompt = 'tarzan.event.eventQuery.model.eventQuery';

@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: ['tarzan.event.eventQuery'], // code 为 [服务].[功能]的字符串数组
})
export default class EventDetailsDrawer extends React.PureComponent {
  render() {
    const { initData, visible, onCancel } = this.props;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get('tarzan.event.eventQuery.title.effectObj').d('事件影响对象')}
        visible={visible}
        onCancel={onCancel}
        onOk={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        {initData.map(item => {
          let words = '';
          item.columnValueList.forEach(code => {
            words = `${words}${code.title}:${code.value}\n`;
          });
          return (
            <>
              <Row {...SEARCH_FORM_ROW_LAYOUT} className={styles.eventRow}>
                <Col span={8} className={styles.leftCol}>
                  <span>{intl.get(`${modelPrompt}.objectTypeCode`).d('对象类型编码')}</span>
                </Col>
                <Col span={16} className={styles.rightCol}>
                  <Input disabled defaultValue={item.objectTypeCode} />
                </Col>
              </Row>
              <Row {...SEARCH_FORM_ROW_LAYOUT} className={styles.eventRow}>
                <Col span={8} className={styles.leftCol}>
                  <span>{intl.get(`${modelPrompt}.objectDescription`).d('对象类型描述')}</span>
                </Col>
                <Col span={16} className={styles.rightCol}>
                  <Input disabled defaultValue={item.objectDescription} />
                </Col>
              </Row>
              <Row {...SEARCH_FORM_ROW_LAYOUT} className={styles.eventRow}>
                <Col span={8} className={styles.leftCol}>
                  <span>{intl.get(`${modelPrompt}.eventDetails`).d('对象详细信息')}</span>
                </Col>
                <Col span={16} className={styles.rightCol}>
                  <Input.TextArea style={{ height: 260 }} disabled defaultValue={words} />
                </Col>
              </Row>
            </>
          );
        })}
      </Modal>
    );
  }
}
