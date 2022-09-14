import sanityClient from '@sanity/client';
import ImageUrlBuilder from '@sanity/image-url';

const client = sanityClient({
  projectId: 'eoh5c5p2',
  dataset: 'production',
  apiVersion: '2022-09-08',
  useCdn: false,
  token: 'skobOhYVaj0G2jHLYazTWAd3bAVo8KdmxohIGAEaLUZfeYDxoudjXwAGpaWWJ8wNp85LjObF4bL1b62bRcdJjcr5BlTwrDsBIyeV1JHIEZQ0WeXGzt8b6Pu2roiXjpWnXMUUtb5s1X2Sp5aeMDNCwr8NlZOeLxkpngBt04ylm5Tvn7oNCHXu',
});
const urlFor = (source) => {
    return source && ImageUrlBuilder(client).image(source).width(350).url();

}
export {client}
export {urlFor}