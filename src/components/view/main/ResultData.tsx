import { Fragment, useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { PlaceCard } from 'components/common';
import { useStore } from 'stores';
import { placeDataType } from 'types/typeBundle';
import { palette, locationNames } from 'constants/';
import emptyImage from 'assets/error-image.png';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '5px 24px 35px',
    color: palette.white,
  },
  emptyImg: {
    margin: '40px 0 24px',
    width: 120,
    height: 120,
  },
  emptyComment: {
    fontSize: 18,
    fontWeight: 600,
  },
  emptySuggestion: {
    margin: '8px 0 64px',
    color: palette.grey[400],
    fontSize: 14,
    fontWeight: 400,
  },
  emptyTitle: {
    marginTop: 32,
    width: '100%',
    fontSize: 18,
    fontWeight: 600,
  },
  listWrap: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: 10,
  },
  subComponent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  header: {
    display: 'flex',
    paddingBottom: 5,
    fontSize: 14,
  },
  title: {
    margin: '32px 0 24px',
    fontSize: 18,
    fontWeight: 600,
  },
}));

interface propsType {
  placeData: placeDataType[];
  searchWord: string;
}

const ResultData = observer((props: propsType) => {
  const { placeData, searchWord } = props;
  const [resultData, setResultData] = useState<placeDataType[]>([]);
  // const [relatedData, setRelatedData] = useState<placeDataType[]>([]);
  // const [suggestedData, setSuggestedData] = useState<placeDataType[]>([]);
  const classes = useStyles();
  const { ScreenSizeStore } = useStore().MobxStore;
  const WRAP_BOX_STYLE: { width: number } = {
    width: ScreenSizeStore.screenType === 'mobile' ? ScreenSizeStore.screenWidth - 48 : 352,
  };

  const getSuggestionList = useCallback(async () => {
    // const response = axiosRequest(`location/${placeData.name}`);
    setResultData(
      placeData.filter((data: placeDataType) =>
        (locationNames[data.name] || data.name).startsWith(searchWord)
      )
    );
  }, [placeData, searchWord]);

  useEffect(() => {
    const newSearchedList: string[] = JSON.parse(
      localStorage.getItem('@wagglewaggle_recently_searched') ?? '[]'
    );
    if (!newSearchedList.includes(searchWord)) {
      newSearchedList.push(searchWord);
    }
    localStorage.setItem('@wagglewaggle_recently_searched', JSON.stringify(newSearchedList));
  }, [searchWord]);

  useEffect(() => {
    getSuggestionList();
  }, [getSuggestionList]);

  return (
    <Box className={classes.wrap} sx={WRAP_BOX_STYLE}>
      {resultData.length === 0 ? (
        <Fragment>
          <div className={classes.emptyImg}>
            <img src={emptyImage} alt='empty' />
          </div>
          <div className={classes.emptyComment}>검색 결과가 없어요.</div>
          <span className={classes.emptySuggestion}>
            최근 사람들이 많이 검색한 인기 장소는 어떠신가요?
          </span>
        </Fragment>
      ) : (
        <Fragment>
          <div className={classes.subComponent}>
            <div className={classes.header}>
              <span className={classes.title}>{`검색 결과 ${resultData.length}`}</span>
            </div>
            {resultData.map((data: placeDataType, idx: number) => (
              <PlaceCard key={`result-data-${idx}`} place={data} />
            ))}
          </div>
          <div className={classes.subComponent}>
            <div className={classes.header}>
              <span className={classes.title}>주변 장소 현황</span>
            </div>
            {/* {relatedData.map((data: placeDataType, idx: number) => (
              <PlaceCard key={`related-data-${idx}`} place={data} />
            ))} */}
          </div>
        </Fragment>
      )}
    </Box>
  );
});

export default ResultData;
