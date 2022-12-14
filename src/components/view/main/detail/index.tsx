import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import DetailHeader from './DetailHeader';
import DetailedCongestion from './DetailedCongestion';
import LocationInformation from './LocationInformation';
import RelatedLocations from './RelatedLocations';
import { useStore } from 'stores';
import { locationDataType } from 'types/typeBundle';
import { palette, locationNames, locationRequestTypes } from 'constants/';
import axiosRequest from 'api/axiosRequest';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
  },
  veryUncrowded: {
    color: palette.blue,
  },
  uncrowded: {
    color: palette.green,
  },
  normal: {
    color: palette.yellow,
  },
  crowded: {
    color: palette.orange,
  },
  veryCrowded: {
    color: palette.red,
  },
}));

const Detail = observer(() => {
  const [locationData, setLocationData] = useState<locationDataType | null>(null);
  const classes = useStyles();
  const location = useLocation();
  const { ScreenSizeStore, CustomDialogStore, LocationStore, ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const BOX_STYLE: { width: number; color: string } = {
    width: ScreenSizeStore.screenType === 'mobile' ? ScreenSizeStore.screenWidth : 640,
    color: isDarkTheme ? palette.white : palette.black,
  };

  const setAccidentLists = useCallback(() => {
    if (locationData && locationData?.accidents?.length > 0) {
      CustomDialogStore.openAccidentDialog(locationData.accidents);
    }
  }, [CustomDialogStore, locationData]);

  const initLocationData = useCallback(async () => {
    if (location.search.length === 0) return;
    const placeName: string = decodeURI(location.search).replace('?name=', '');
    LocationStore.setPlaceName(placeName);
    const requestType: string = locationRequestTypes.skt.includes(
      locationNames[placeName] || placeName
    )
      ? 'skt-place'
      : 'kt-place';
    const pathnameArr: string[] = location.pathname.split('/');
    const response: { data: locationDataType } | undefined = await axiosRequest(
      `${requestType}/${pathnameArr[pathnameArr.length - 1]}`
    );
    if (!response) return;
    setLocationData(response.data);
  }, [LocationStore, location.pathname, location.search]);

  useEffect(() => {
    if (location.search.length === 0) return;
    const placeName: string = decodeURI(location.search).replace('?name=', '');
    const htmlTitle = document.querySelector('title');
    if (!htmlTitle) return;
    htmlTitle.innerHTML = `${locationNames[placeName] || placeName} : ???????????? ??????`;
  }, [location.search]);

  useEffect(() => {
    initLocationData();
  }, [initLocationData, LocationStore.placeName]);

  useEffect(() => {
    setAccidentLists();
  }, [locationData, setAccidentLists]);

  return (
    <Box className={classes.wrap} sx={BOX_STYLE}>
      <DetailHeader locationData={locationData} />
      <DetailedCongestion locationData={locationData} initLocationData={initLocationData} />
      <LocationInformation locationData={locationData} />
      <RelatedLocations />
      <Box sx={{ height: '64px', backgroundColor: isDarkTheme ? palette.black : palette.white }} />
    </Box>
  );
});

export default Detail;
