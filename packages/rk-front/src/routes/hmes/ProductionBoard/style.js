import styled from 'styled-components';
import pageBg from '@/assets/pageBg.png';

export const IndexPageStyle = styled.div`
  position: relative;
  overflow: hidden;
  margin: 0px;
  padding: 10px 0 0 0;
  background: url(${pageBg}) center center no-repeat;
  height: 100%;
  background-size: cover;
`;
export const IndexPageContent = styled.div`
  justify-content: space-between;
  flex-wrap: nowrap;
  .center-page {
    flex: 1;
  }
`;
