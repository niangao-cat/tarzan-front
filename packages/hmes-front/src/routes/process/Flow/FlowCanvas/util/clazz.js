export function getShapeName(clazz) {
  switch (clazz) {
    case 'technique':
      return 'technique-node';
    case 'process':
      return 'process-node';
    case 'stepGroup':
      return 'stepGroup-node';
    default:
      return 'technique-node';
  }
}
