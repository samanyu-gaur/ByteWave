// Planet images as visual notes (public domain, Wikipedia Commons)
export const PLANET_IMAGES = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/80px-Mercury_in_true_color.jpg',   // Mercury
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus2.jpg/80px-Venus2.jpg',                                       // Venus
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Earth_Western_Hemisphere.jpg/80px-Earth_Western_Hemisphere.jpg',   // Earth
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Mars_23_aug_2003_hubble.jpg/80px-Mars_23_aug_2003_hubble.jpg',     // Mars
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/80px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg', // Jupiter
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/80px-Saturn_during_Equinox.jpg',         // Saturn
]

export function getPlanetImage(index) {
  return PLANET_IMAGES[index % PLANET_IMAGES.length]
}
