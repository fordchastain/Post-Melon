import { styled } from '@mui/material';
import RequestBuilder from './components/RequestBuilder';

const AppContainer = styled('div')({
  display: 'flex',
  height: '100vh',
});

const MainSection = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

function App() {
  return (
    <AppContainer>
      <MainSection>
        <RequestBuilder />
      </MainSection>
    </AppContainer>
  );
}

export default App;
