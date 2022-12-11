import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useResizeObserver from 'use-resize-observer';
import makeStyles from '@mui/styles/makeStyles';
import { Main, NotFound } from './components/view';
import { CreateStore, RootStore } from 'stores';
import { screenType } from 'types/typeBundle';
import { palette } from 'constants/palette';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    justifyContent: 'center',
    minWidth: 360,
    backgroundColor: palette.black,
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

const App = () => {
  const classes = useStyles();
  const { ScreenSizeStore } = MobxStore;
  const { ref, width } = useResizeObserver();

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
    <div className={classes.wrap}>
      <CreateStore.Provider value={{ MobxStore }}>
        <div className={classes.serviceWrap} ref={ref}>
          <BrowserRouter>
            <Routes>
              <Route path='/main/*' element={<Main />} />
              <Route path='/' element={<Navigate to='/main' />} />
              <Route path='/*' element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </CreateStore.Provider>
    </div>
  );
};

export default App;
