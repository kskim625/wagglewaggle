import { Fragment, useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { CustomDrawer, SearchInput } from 'components/common';
import PlaceData from './PlaceData';
import SearchData from './SearchData';
import SuggestData from './SuggestData';
import ResultData from './ResultData';
import { Detail } from 'components/view';
import { placeDataType } from 'types/typeBundle';
import { useStore } from 'stores';
import logo from 'assets/temp-logo.png';
import searchIcon from 'assets/icons/search-icon.svg';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    height: 56,
    '& img': {
      cursor: 'pointer',
    },
  },
  searchBox: {
    flexGrow: 1,
    height: '100%',
    cursor: 'pointer',
  },
}));

const Main = () => {
  const [currentPage, setCurrentPage] = useState<JSX.Element>(<Fragment />);
  const [placeData, setPlaceData] = useState<placeDataType[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [latestList, setLatestList] = useState<string[]>([]);
  const [includeInput, setIncludeInput] = useState<boolean>(false);
  const classes = useStyles();
  const { CustomDialogStore, ErrorStore } = useStore().MobxStore;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLatestListChange = (newList: string[]) => {
    setLatestList(newList);
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
          latestSearchList={latestList}
          handleWordClick={handleWordClick}
          handleLatestListChange={handleLatestListChange}
        />
      ) : (
        <SuggestData
          placeData={placeData}
          searchValue={newValue}
          latestSearchList={latestList}
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
        latestSearchList={latestList}
        handleWordClick={handleWordClick}
        handleLatestListChange={handleLatestListChange}
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
    navigate('/main');
  };

  useEffect(() => {
    const dummyPlaceData: placeDataType[] = [
      { id: 0, name: 'test1', category: '테마파크', status: 'CROWDED' },
      { id: 1, name: 'test2', category: '쇼핑몰', status: 'RELAXATION' },
      { id: 2, name: 'test3', category: '쇼핑몰, 테마파크', status: 'VERY_CROWDED' },
    ];
    setPlaceData(dummyPlaceData);
    CustomDialogStore.setOpen(location.search === '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!ErrorStore.statusCode) return;
    navigate(ErrorStore.statusCode === 404 ? '/not-found' : '/error');
  }, [ErrorStore.statusCode, navigate]);

  useEffect(() => {
    setLatestList(JSON.parse(localStorage.getItem('@wagglewaggle_recently_searched') ?? '[]'));
  }, [localStorage.getItem('@wagglewaggle_recently_searched')]);

  return (
    <div className={classes.wrap}>
      <div className={classes.search}>
        <img src={logo} alt='logo' onClick={navigateToHome} />
        <div className={classes.searchBox} onClick={handleSearchClick} />
        <img src={searchIcon} alt='search' onClick={handleSearchClick} />
      </div>
      <PlaceData placeData={placeData} />
      <CustomDrawer
        open={openDrawer}
        onClose={onDrawerClose}
        searchInput={
          includeInput ? (
            <SearchInput
              searchValue={searchValue}
              handleSearchEnter={handleSearchEnter}
              handleDrawerClose={onDrawerClose}
              handleSearchValueChange={handleSearchValueChange}
            />
          ) : undefined
        }
        component={currentPage}
      />
    </div>
  );
};

export default Main;
