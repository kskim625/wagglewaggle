import { Fragment, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { CustomDrawer, SearchInput } from 'components/common';
import PlaceData from './PlaceData';
import SearchData from './SearchData';
import SuggestData from './SuggestData';
import ResultData from './ResultData';
import { Detail } from 'components/view';
import lottie from 'lottie-web';
import MainLottie from 'assets/lottie/Main.json';
import { placeDataType } from 'types/typeBundle';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';
import { palette } from 'constants/';
import { ReactComponent as Logo } from 'assets/icons/logo-icon.svg';
import { ReactComponent as SearchIcon } from 'assets/icons/search-icon.svg';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    zIndex: 2,
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    height: 56,
    '& svg': {
      width: 40,
      height: 40,
      cursor: 'pointer',
    },
    '& svg:last-of-type': {
      width: 32,
      height: 32,
    },
  },
  searchBox: {
    flexGrow: 1,
    height: '100%',
  },
  lottie: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 1720,
    height: '100%',
    overflow: 'hidden',
    zIndex: 1,
    opacity: 0.7,
  },
}));

const Main = observer(() => {
  const [currentPage, setCurrentPage] = useState<JSX.Element>(<Fragment />);
  const [placeData, setPlaceData] = useState<placeDataType[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [includeInput, setIncludeInput] = useState<boolean>(false);
  const lottieContainer = useRef<HTMLDivElement>(null);
  const classes = useStyles();
  const { ScreenSizeStore, LocationStore, CustomDialogStore, ErrorStore, ThemeStore } =
    useStore().MobxStore;
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handleLatestListChange = (newList: string[]) => {
    localStorage.setItem('@wagglewaggle_recently_searched', JSON.stringify(newList));
  };

  const handleWordClick = (searchWord: string) => {
    setSearchValue(searchWord);
    setCurrentPage(<ResultData placeData={placeData} searchWord={searchWord} />);
  };

  const handleSearchEnter = (searchWord: string) => {
    handleWordClick(searchWord);
  };

  const handleSearchValueChange = (newValue: string) => {
    setSearchValue(newValue);
    setCurrentPage(
      newValue.length === 0 ? (
        <SearchData
          handleWordClick={handleWordClick}
          handleLatestListChange={handleLatestListChange}
          handleSearchValueChange={handleSearchValueChange}
        />
      ) : (
        <SuggestData
          placeData={placeData}
          searchValue={newValue}
          handleWordClick={handleWordClick}
          handleLatestListChange={handleLatestListChange}
        />
      )
    );
  };

  const handleSearchClick = () => {
    setOpenDrawer(true);
    setCurrentPage(
      <SearchData
        handleWordClick={handleWordClick}
        handleLatestListChange={handleLatestListChange}
        handleSearchValueChange={handleSearchValueChange}
      />
    );
  };

  const onDrawerClose = () => {
    navigate('/main');
    setOpenDrawer(false);
    setSearchValue('');
    setCurrentPage(<Fragment />);
  };

  const navigateToHome = () => {
    onDrawerClose();
  };

  const handlePlaceDataChange = (newPlaceData: placeDataType[]) => {
    setPlaceData(JSON.parse(JSON.stringify(newPlaceData)));
  };

  const initPlaceData = async () => {
    const params = { populationSort: true };
    const ktData: { data: { list: placeDataType[] } } | undefined = await axiosRequest(
      'kt-place',
      params
    );
    const sktData: { data: { list: placeDataType[] } } | undefined = await axiosRequest(
      'skt-place',
      params
    );
    if (!ktData || !sktData) return;
    const statusArr: string[] = [
      'VERY_RELAXATION',
      'RELAXATION',
      'NORMAL',
      'CROWDED',
      'VERY_CROWDED',
    ];
    setPlaceData(
      [...ktData.data.list, ...sktData.data.list].sort(
        (prev: placeDataType, next: placeDataType) => {
          const prevLevel = statusArr.indexOf(prev.populations[0].level);
          const nextLevel = statusArr.indexOf(next.populations[0].level);
          if (prevLevel > nextLevel) return -1;
          else if (nextLevel > prevLevel) return 1;
          return 0;
        }
      )
    );
    [...ktData.data.list, ...sktData.data.list].forEach((data: placeDataType) => {
      LocationStore.setCategories(data.name, data.categories);
    });
  };

  useEffect(() => {
    initPlaceData();
    const openIntroDialog: boolean =
      location.search === '' &&
      sessionStorage.getItem('@wagglewaggle_intro_popup_open') !== 'false';
    CustomDialogStore.setOpen(openIntroDialog);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!lottieContainer.current) return;
    lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: MainLottie,
    });
  }, []);

  useEffect(() => {
    const newDrawerState: boolean = location.search.length !== 0;
    setOpenDrawer(newDrawerState);
    setIncludeInput(!newDrawerState);
    setCurrentPage(newDrawerState ? <Detail /> : <Fragment />);
    setSearchValue(newDrawerState ? searchValue : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    if (searchValue.length === 0 || location.search.length === 0) {
      const htmlTitle = document.querySelector('title');
      if (!htmlTitle) return;
      htmlTitle.innerHTML = '????????????';
    }
  }, [searchValue, location.search]);

  useEffect(() => {
    if (!ErrorStore.statusCode) return;
    navigate(ErrorStore.statusCode === 404 ? '/not-found' : '/error');
  }, [ErrorStore.statusCode, navigate]);

  return (
    <Fragment>
      <div className={classes.wrap}>
        <Box
          className={classes.search}
          sx={{
            '& path': {
              fill: isDarkTheme ? palette.white : palette.black,
            },
          }}
        >
          <Logo onClick={navigateToHome} />
          <div className={classes.searchBox} />
          <SearchIcon onClick={handleSearchClick} />
        </Box>
        <PlaceData placeData={placeData} handlePlaceDataChange={handlePlaceDataChange} />
        <CustomDrawer
          open={openDrawer}
          onClose={onDrawerClose}
          searchInput={
            includeInput ? (
              <SearchInput
                searchValue={searchValue}
                handleSearchEnter={handleSearchEnter}
                handleDrawerClose={
                  searchValue.length === 0 || !LocationStore.suggestionExists
                    ? onDrawerClose
                    : handleSearchClick
                }
                handleSearchValueChange={handleSearchValueChange}
              />
            ) : undefined
          }
          component={currentPage}
        />
      </div>
      <Box
        sx={{ transform: `translateX(${ScreenSizeStore.screenType === 'mobile' ? '-280px' : 0})` }}
        className={classes.lottie}
        ref={lottieContainer}
      />
    </Fragment>
  );
});

export default Main;
