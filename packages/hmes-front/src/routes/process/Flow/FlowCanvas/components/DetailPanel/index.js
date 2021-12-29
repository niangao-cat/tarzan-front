import React, { forwardRef } from 'react';
import ProcessRouteDetail from './ProcessRouteDetail';
import 'hzero-ui/lib/input/style';
import 'hzero-ui/lib/select/style';
import 'hzero-ui/lib/switch/style';
import styles from './index.less';

/* eslint-disable */
const DetailPanel = forwardRef(
  (
    {
      height,
      model,
      users,
      groups,
      messageDefs,
      signalDefs,
      onChange,
      readOnly = false,
      graphData,
    },
    ref
  ) => {
    return (
      <div ref={ref} className={styles.detailPanel} style={{ height }}>
        <ProcessRouteDetail />
      </div>
    );
  }
);
/* eslint-disable */

export default DetailPanel;
