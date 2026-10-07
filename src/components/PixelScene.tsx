import homeShop from '../assets/pixel/home/home_shop.png'

/** The storefront is a native 160×96 sprite, displayed only at integer scale. */
export function PixelScene() {
  return <img className="pixel-scene pixel-sprite" src={homeShop} alt="暖暖的日式像素小食堂" width="160" height="96" />
}
