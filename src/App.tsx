import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import useResizeObserver from 'use-resize-observer';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { CustomDialog } from 'components/common';
import { Main, Error } from './components/view';
import { CreateStore, RootStore } from 'stores';
import { screenType } from 'types/typeBundle';
import { palette } from 'constants/';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    justifyContent: 'center',
    minWidth: 360,
    backgroundColor: palette.grey[800],
  },
  serviceWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: 1024,
    height: 'fit-content',
    minHeight: '100vh',
  },
}));

export const MobxStore = new RootStore();

const App = observer(() => {
  const classes = useStyles();
  const { ScreenSizeStore, ThemeStore } = MobxStore;
  const { ref, width } = useResizeObserver();
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const disableIosInputAutoZoom = () => {
    const metaEl = document.querySelector('meta[name=viewport]');
    if (!metaEl) return;
    const newContentArr: string[] = (metaEl as unknown as { content: string }).content.split(', ');
    const maximumScaleContent: string = 'maximum-scale=1';
    if (newContentArr.includes(maximumScaleContent)) return;
    newContentArr.push(maximumScaleContent);
    metaEl.setAttribute('content', newContentArr.join(', '));
  };

  useEffect(() => {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      disableIosInputAutoZoom();
    }
  }, []);

  useEffect(() => {
    if (!width) return;
    const screenType: screenType = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'pc';
    ScreenSizeStore.setScreenType(screenType);
    ScreenSizeStore.setScreenWidth(width);
  }, [ScreenSizeStore, width]);

  return (
    <Box
      className={classes.wrap}
      sx={{
        color: isDarkTheme ? palette.white : palette.black,
        backgroundColor: isDarkTheme ? palette.grey[800] : palette.white,
      }}
    >
      <CreateStore.Provider value={{ MobxStore }}>
        <div className={classes.serviceWrap} ref={ref}>
          <BrowserRouter>
            <Routes>
              <Route path='/main/*' element={<Main />} />
              <Route path='/not-found' element={<Error />} />
              <Route path='/error' element={<Error />} />
              <Route path='/' element={<Navigate to='/main' />} />
              <Route path='/*' element={<Navigate to='/not-found' />} />
            </Routes>
          </BrowserRouter>
        </div>
        <CustomDialog />
      </CreateStore.Provider>
    </Box>
  );
});

export default App;
