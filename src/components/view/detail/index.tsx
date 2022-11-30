import makeStyles from '@mui/styles/makeStyles';
import { Block } from 'components/common';
import DetailHeader from './DetailHeader';
import DetailContent from './DetailContent';
import DetailPrediction from './DetailPrediction';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    margin: '48px 0 35px',
    width: '100%',
  },
  footer: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
  },
}));

const Detail = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrap}>
      <DetailHeader />
      <DetailContent />
      <DetailPrediction />
      <footer className={classes.footer}>
        <Block blockHeight='28px' blockColor='#ff7979' />
      </footer>
    </div>
  );
};

export default Detail;
