const PLATFORMS = [
  ['spotify',    'Spotify'],
  ['apple',      'Apple Music'],
  ['beatport',   'Beatport'],
  ['soundcloud', 'SoundCloud'],
  ['instagram',  'Instagram'],
];

/* Real profiles. Share-tracking parameters (igsh / si / utm_* / ref) stripped,
   and on.soundcloud.com shorteners resolved to their canonical profile URLs so
   they can't expire. A platform with no entry simply renders no icon — never a
   dead link, and never one platform's URL behind another's icon. */
const ARTISTS = [
  { name:'Mishell', photo:'/img/mishell.jpg', epk:'/mishell/', links:{
      spotify:   'https://open.spotify.com/artist/3kCsXVpVs1ZhLnIVkNzdHJ',
      apple:     'https://music.apple.com/il/artist/mishell/250454064',
      beatport:  'https://www.beatport.com/artist/mishell/270228',
      soundcloud:'https://soundcloud.com/mishellmusik',
      instagram: 'https://www.instagram.com/_mishell_____' } },

  { name:'Genish', photo:'/img/genish.jpg', epk:'/genish/', links:{
      spotify:   'https://open.spotify.com/artist/12rfpY7qPWCqM5kN8q1Ry1',
      apple:     'https://music.apple.com/il/artist/genish/787229909',
      beatport:  'https://www.beatport.com/artist/genish/929264',
      soundcloud:'https://soundcloud.com/genishmusic',
      instagram: 'https://www.instagram.com/genish__' } },

  { name:'Yuvee', photo:'/img/yuvee.jpg', epk:'/yuvee/', links:{
      spotify:   'https://open.spotify.com/artist/2uUpxGX8XaVGhqh398dP2f',
      apple:     'https://music.apple.com/il/artist/yuvee/1216600486',
      beatport:  'https://www.beatport.com/artist/yuve/1243590',
      soundcloud:'https://soundcloud.com/yuveemusic',
      instagram: 'https://www.instagram.com/yuvee_music' } },

  /* Still needed for Nevos: Spotify, Apple Music, Beatport */
  { name:'Nevos', photo:'/img/nevos.jpg', epk:'/nevos/', links:{
      soundcloud:'https://soundcloud.com/nevosmusic',
      instagram: 'https://www.instagram.com/nevos_music' } },

  { name:'Mentesh', photo:'/img/mentesh.jpg', epk:'/mentesh/', links:{
      spotify:   'https://open.spotify.com/artist/4AUqHwTX2zVGZOlXgrSNoF',
      apple:     'https://music.apple.com/il/artist/mentesh/1671188421',
      beatport:  'https://www.beatport.com/artist/mentesh/1109477',
      soundcloud:'https://soundcloud.com/mentesh',
      instagram: 'https://www.instagram.com/guymentesh' } },
];
