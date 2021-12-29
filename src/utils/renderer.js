import React from 'react';
import { Badge } from 'hzero-ui';
import intl from 'utils/intl';
/**
 * 返回 启用/禁用 对应的多语言 并加上状态
 * @param {0|1} v 启用状态
 * return 1 ? enable(多语言) : disabled(多语言)
 */
export function enableRender(v) {
  return (
    <Badge
      status={v === 'Y' ? 'success' : 'error'}
      text={
        v === 'Y' ? intl.get('hzero.common.status.enable') : intl.get('hzero.common.status.disable')
      }
    />
  );
}
