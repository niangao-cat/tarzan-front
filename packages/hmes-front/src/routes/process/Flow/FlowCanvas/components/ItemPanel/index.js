import React, { forwardRef } from 'react';
import { Collapse, message } from 'hzero-ui';
import styles from './index.less';
import 'hzero-ui/lib/collapse/style';
import start from '@/assets/flow/start.svg';
import timerStart from '@/assets/flow/timer-start.svg';
import messageStart from '@/assets/flow/message-start.svg';
import userTask from '@/assets/flow/user-task.svg';
import javaTask from '@/assets/flow/java-task.svg';
import scriptTask from '@/assets/flow/script-task.svg';
import signalStart from '@/assets/flow/signal-start.svg';

const { Panel } = Collapse;
/* eslint-disable */
const ItemPanel = forwardRef(({ height, onChange, model }, ref) => {
  const result =
    JSON.stringify(model) !== '{}' &&
    (model.clazz === 'technique' || model.clazz === 'stepGroup' || model.clazz === 'process');
  return (
    <div ref={ref} className={styles.itemPanel} style={{ height }}>
      <Collapse bordered={false} defaultActiveKey={['1']} className={styles.drag}>
        <Panel header="基本元素" key="1" forceRender showArrow={false}>
          <img
            data-item={
              "{clazz:'technique',size:'30*30',label:'工艺',hideIcon1:true,hideIcon2:true,hideIcon3:true,hideIcon4:true}"
            }
            src={userTask}
            style={{ width: 62, height: 42 }}
          />
          <div>工艺</div>
          <img
            data-item={
              "{clazz:'stepGroup',size:'30*30',label:'步骤组',hideIcon1:true,hideIcon2:true,hideIcon3:true,hideIcon4:true}"
            }
            src={javaTask}
            style={{ width: 62, height: 42 }}
          />
          <div>步骤组</div>
          <img
            data-item={
              "{clazz:'process',size:'30*30',label:'嵌套工艺路线',hideIcon1:true,hideIcon2:true,hideIcon3:true,hideIcon4:true}"
            }
            src={scriptTask}
            style={{ width: 62, height: 42 }}
          />
          <div>嵌套工艺路线</div>
        </Panel>
      </Collapse>
      <Collapse bordered={false} defaultActiveKey={['1']} className={styles.click}>
        <Panel header="元素操作" key="1" forceRender showArrow={false}>
          <img
            src={start}
            style={{ width: 60, height: 35 }}
            title="入口步骤"
            onClick={() => {
              if (result) {
                onChange('hideIcon1', !model.hideIcon1);
                if (model.hideIcon1) {
                  message.success('已设置该步骤为入口步骤');
                } else {
                  message.success('已取消该步骤为入口步骤');
                }
              } else {
                message.warning('请先选择元素进行操作');
              }
            }}
          />
          <img
            src={messageStart}
            style={{ width: 60, height: 35 }}
            title="完成步骤"
            onClick={() => {
              if (result) {
                onChange('hideIcon2', !model.hideIcon2);
                if (model.hideIcon2) {
                  message.success('已设置该步骤为完成步骤');
                } else {
                  message.success('已取消该步骤为完成步骤');
                }
              } else {
                message.warning('请先选择元素进行操作');
              }
            }}
          />
          <img
            src={timerStart}
            style={{ width: 60, height: 35 }}
            title="返回步骤"
            onClick={() => {
              if (result) {
                onChange('hideIcon3', !model.hideIcon3);
              } else {
                message.warning('请先选择元素进行操作');
              }
            }}
          />
          <img
            src={signalStart}
            style={{ width: 60, height: 35 }}
            title="关键步骤"
            onClick={() => {
              if (result) {
                onChange('hideIcon4', !model.hideIcon4);
                if (model.hideIcon4) {
                  message.success('已设置该步骤为关键步骤');
                } else {
                  message.success('已取消该步骤为关键步骤');
                }
              } else {
                message.warning('请先选择元素进行操作');
              }
            }}
          />
        </Panel>
      </Collapse>
    </div>
  );
});
/* eslint-disable */
export default ItemPanel;
