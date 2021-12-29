import React, { forwardRef } from 'react';
import '../../iconfont.css';
import { Tooltip } from 'hzero-ui';
import styles from './index.less';
import 'hzero-ui/lib/tooltip/style';

const ToolbarPanel = forwardRef((props, ref) => {
  return (
    <div className={styles.toolbar} ref={ref}>
      <Tooltip title="撤销">
        <span className={styles.command} data-command="undo">
          <span className="iconfont icon-undo" />
        </span>
      </Tooltip>
      <Tooltip title="重复">
        <span className={styles.command} data-command="redo">
          <span className="iconfont icon-redo" />
        </span>
      </Tooltip>
      <span className={styles.separator} />
      <Tooltip title="删除">
        <span className={styles.command} data-command="delete">
          <span className="iconfont icon-delete-o" />
        </span>
      </Tooltip>
      <Tooltip title="设置">
        <span className={styles.command}>
          <span className="iconfont icon-to-back" />
        </span>
      </Tooltip>
      <span className={styles.separator} />
      <Tooltip title="复制">
        <span className={styles.command} data-command="copy">
          <span className="iconfont icon-copy-o" />
        </span>
      </Tooltip>
      <Tooltip title="粘贴">
        <span className={styles.command} data-command="paste">
          <span className="iconfont icon-paster-o" />
        </span>
      </Tooltip>
      <span className={styles.separator} />
      <Tooltip title="放大">
        <span className={styles.command} data-command="zoomIn">
          <span className="iconfont icon-zoom-in-o" />
        </span>
      </Tooltip>
      <Tooltip title="缩小">
        <span className={styles.command} data-command="zoomOut">
          <span className="iconfont icon-zoom-out-o" />
        </span>
      </Tooltip>
      <span className={styles.separator} />
      <Tooltip title="实际大小">
        <span className={styles.command} data-command="resetZoom">
          <span className="iconfont icon-actual-size-o" />
        </span>
      </Tooltip>
      <Tooltip title="适应屏幕">
        <span className={styles.command} data-command="autoFit">
          <span className="iconfont icon-fit" />
        </span>
      </Tooltip>
    </div>
  );
});

export default ToolbarPanel;
