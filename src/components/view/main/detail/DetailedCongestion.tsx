import { Fragment, useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Box, Button, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { PlaceStatus } from 'components/common';
import { useStore } from 'stores';
import { locationDataType } from 'types/typeBundle';
import { palette } from 'constants/';
import { ReactComponent as RefreshIcon } from 'assets/icons/refresh-icon.svg';
import personIcon from 'assets/icons/person-icon.svg';
import carIcon from 'assets/icons/car-icon.svg';
import { ReactComponent as RightIcon } from 'assets/icons/right-icon.svg';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 24px 16px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    '& span': {
      fontSize: 18,
      fontWeight: 600,
    },
  },
  buttonArea: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 600,
    gap: 4,
  },
  iconImage: {
    width: 16,
    height: 16,
  },
  statusCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 24,
    width: '100%',
    fontSize: 14,
    fontWeight: 600,
  },
  trafficStatusCard: {
    margin: 0,
  },
  statusLeft: {
    display: 'flex',
    gap: 8,
    '& img': {
      borderRadius: '50%',
      padding: 8,
      width: 24,
      height: 24,
      backgroundColor: palette.black,
    },
  },
  statusDesc: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '20px',
    '& span:last-child': {
      fontWeight: 400,
    },
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 400,
  },
  cctvButton: {
    border: 'none',
    padding: 0,
    backgroundColor: 'transparent',
  },
  divider: {
    width: '100%',
    border: `1px solid ${palette.grey[600]}`,
  },
}));

interface propsType {
  locationData: locationDataType | null;
  initLocationData: () => void;
}

const DetailedCongestion = observer((props: propsType) => {
  const { locationData, initLocationData } = props;
  const [timePassed, setTimePassed] = useState<string>('');
  const classes = useStyles();
  const { CustomDialogStore, ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const COMMENTS_BY_STATUS: { [key: string]: string } = {
    VERY_RELAXATION: '???????????? ??? ?????????',
    RELAXATION: '???????????? ????????? ??? ?????????',
    NORMAL: '???????????? ???????????? ?????????',
    CROWDED: '?????? ??? ???????????? ????????????',
    VERY_CROWDED: '???????????? ????????????',
  };
  const TRAFFIC_TO_COMMENTS: { [key: string]: string } = {
    ??????: '???????????? ??? ?????????',
    ??????: '?????? ????????? ????????? ??? ?????????',
    ??????: '???????????? ????????????',
  };

  const handleOpenDialog = () => {
    CustomDialogStore.openCctvDialog(locationData?.cctvs || []);
  };

  useEffect(() => {
    const newTimePassed: number = Math.round(
      (new Date().getTime() - new Date(locationData?.populations[0]?.updatedDate || '').getTime()) /
        60000
    );
    setTimePassed(
      newTimePassed >= 60 ? `${Math.floor(newTimePassed / 60)}?????? ???` : `${newTimePassed}??? ???`
    );
  }, [locationData]);

  return (
    <Box
      className={classes.wrap}
      sx={{
        backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
        '& path': {
          fill: isDarkTheme ? palette.white : palette.black,
        },
        '& hr': {
          border: `1px solid ${palette.grey[isDarkTheme ? 600 : 300]}`,
        },
      }}
    >
      <div className={classes.header}>
        <span>????????? ?????? ??????</span>
        <div className={classes.buttonArea}>
          <IconButton sx={{ padding: 0 }} onClick={initLocationData}>
            <RefreshIcon className={classes.iconImage} />
          </IconButton>
          {timePassed}
        </div>
      </div>
      <div className={classes.statusCard}>
        <div className={classes.statusLeft}>
          <img src={personIcon} alt='person' />
          <div className={classes.statusDesc}>
            <span>?????? ??????</span>
            <Box
              sx={{
                color: palette.grey[isDarkTheme ? 400 : 500],
              }}
            >
              {COMMENTS_BY_STATUS[locationData?.populations[0]?.level || 'NORMAL']}
            </Box>
          </div>
        </div>
        <PlaceStatus status={locationData?.populations[0].level || undefined} />
      </div>
      {locationData?.roadTraffic?.type && (
        <div className={`${classes.statusCard} ${classes.trafficStatusCard}`}>
          <div className={classes.statusLeft}>
            <img src={carIcon} alt='car' />
            <div className={classes.statusDesc}>
              <span>?????? ??????</span>
              <Box
                sx={{
                  color: palette.grey[isDarkTheme ? 400 : 500],
                }}
              >
                {TRAFFIC_TO_COMMENTS[locationData?.roadTraffic?.type || '??????']}
              </Box>
            </div>
          </div>
          <PlaceStatus
            status={locationData?.roadTraffic?.type || undefined}
            comments={{ ??????: '??????', ??????: '??????', ??????: '??????' }}
          />
        </div>
      )}
      {(locationData?.cctvs || []).length > 0 && (
        <Fragment>
          <hr className={classes.divider} />
          <Button
            sx={{
              justifyContent: 'space-between',
              padding: '12px 0',
              width: '100%',
              color: isDarkTheme ? palette.white : palette.black,
              fontWeight: 600,
            }}
            onClick={handleOpenDialog}
          >
            CCTV
            <RightIcon />
          </Button>
        </Fragment>
      )}
    </Box>
  );
});

export default DetailedCongestion;
