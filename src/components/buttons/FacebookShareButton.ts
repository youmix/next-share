// import assert from './utils/assert';
import transformObjectToParams from '../../utils';
import createShareButton from '../../hocs/createShareButton';

function facebookLink(url: string, { quote, hashtag }: { quote?: string; hashtag?: string }) {
  // assert(url, 'facebook.url');

  return (
    'https://www.facebook.com/sharer/sharer.php' +
    transformObjectToParams({
      u: url,
      quote,
      hashtag,
    })
  );
}

const FacebookShareButton = createShareButton<{ quote?: string; hashtag?: string }>(
  'facebook',
  facebookLink,
  props => ({
    quote: props.quote,
    hashtag: props.hashtag,
  }),
  {
    windowWidth: 550,
    windowHeight: 400,
  },
);

export default FacebookShareButton;