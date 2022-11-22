import makeStyles from '@mui/styles/makeStyles';
import { placeDataType } from '../../../types/typeBundle';
import dummyImage from '../../../assets/dummy-image.png';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    margin: 20,
    gap: 10,
  },
  placeCard: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 12px',
    width: 'calc(100% - 20px)',
    height: 'fit-content',
    backgroundColor: '#d9d9d9',
  },
  placeLeft: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  placeTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  placeName: {
    fontSize: 18,
    fontWeight: 500,
  },
  placeCategory: {
    marginLeft: 7,
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  placeStatus: {
    fontSize: 12,
    fontWeight: 500,
  },
  placeImage: {
    display: 'flex',
    alignItems: 'center',
    '& img': {
      width: 46,
      height: 35,
    },
  },
}));

interface propsType {
  placeData: placeDataType[];
}

const PlaceData = (props: propsType) => {
  const { placeData } = props;
  const classes = useStyles();

  return (
    <div className={classes.wrap}>
      {placeData.map((place: placeDataType, idx: number) => (
        <div key={`place-card-${idx}`} className={classes.placeCard}>
          <div className={classes.placeLeft}>
            <div className={classes.placeTitle}>
              <span className={classes.placeName}>{place.name}</span>
              <span className={classes.placeCategory}>{place.category}</span>
            </div>
            <div className={classes.placeStatus}>{place.status}</div>
          </div>
          <div className={classes.placeImage}>
            <img src={dummyImage} alt='home' />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaceData;
