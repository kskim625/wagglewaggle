import { useState, useEffect, useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { PlaceCard } from 'components/common';
import { placeDataType } from 'types/typeBundle';
import { palette } from 'constants/palette';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 24,
    marginTop: 8,
    backgroundColor: palette.grey[700],
  },
  header: {
    marginBottom: 24,
    width: '100%',
    fontSize: 18,
    fontWeight: 600,
  },
}));

const RelatedLocations = () => {
  const [places, setPlaces] = useState<placeDataType[]>([]);
  const classes = useStyles();
  const TEMP_PLACES: placeDataType[] = useMemo(
    () => [
      { id: 8, name: '장소8', category: '백화점', status: 'very crowded' },
      { id: 9, name: '장소9', category: '공원', status: 'crowded' },
      { id: 10, name: '장소10', category: '지하철역', status: 'normal' },
      { id: 11, name: '장소11', category: '지하철역', status: 'uncrowded' },
      { id: 12, name: '장소12', category: '백화점', status: 'very uncrowded' },
    ],
    []
  );

  useEffect(() => {
    // 임시 데이터 할당
    setPlaces(TEMP_PLACES);
  }, [TEMP_PLACES]);

  return (
    <div className={classes.wrap}>
      <div className={classes.header}>관련 장소 현황</div>
      {places.map((place: placeDataType, idx: number) => (
        <PlaceCard key={`related-locations-${idx}`} place={place} />
      ))}
    </div>
  );
};

export default RelatedLocations;