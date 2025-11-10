import React from 'react';
import MainBanner from '../components/MainBanner';
import Categories from '../components/Categories';
import BestSeller from '../components/BestSeller';
import BottomBanner from '../components/BottomBanner';
import NewsLetter from '../components/NewsLetter';
import MiddleBanner from '../components/MiddleBanner';
import OpticsVideo from '../components/OpticsVideo';
import HappyCustomers from '../components/HappyCustomers';
import ScrollFadeIn from '../components/ScrollFadeIn';
import ShopByCategory from '../components/ShopByCategory';

const Home = () => {
  return (
    <div className='mt-10 space-y-16'>
      <ScrollFadeIn><MainBanner /></ScrollFadeIn>
      <ScrollFadeIn delay={0.1}><Categories /></ScrollFadeIn>
      <ScrollFadeIn delay={0.2}><BestSeller /></ScrollFadeIn>
      <ScrollFadeIn delay={0.3}><MiddleBanner /></ScrollFadeIn>
      {/* <ScrollFadeIn delay={0.4}><OpticsVideo /></ScrollFadeIn> */}
      <ScrollFadeIn delay={0.5}><BottomBanner /></ScrollFadeIn>
      <ScrollFadeIn delay={0.6}><ShopByCategory /></ScrollFadeIn>
      <ScrollFadeIn delay={0.6}><HappyCustomers /></ScrollFadeIn>
      <ScrollFadeIn delay={0.7}><NewsLetter /></ScrollFadeIn>
    </div>
  );
};

export default Home;
