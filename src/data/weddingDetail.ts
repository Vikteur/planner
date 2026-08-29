/**
 * Wedding detail content. `emma-julian` is transcribed verbatim from screen 1d;
 * the other weddings follow the same shape so every row in the overview opens.
 */

export type TeamMember = { role: string; name: string; note: string; phone: string; email: string }
export type PersonCard = { name: string; note: string; phone: string; email: string }
export type PlaylistRow = { title: string; preview: string; count: string }
export type SchemaRow = { time: string; what: string; who: string }

export type WeddingDetail = {
  id: string
  couple: string
  dateLine: string
  summary: string
  team: TeamMember[]
  shareUrl: string
  people: PersonCard[]
  musicHeading: string
  playlists: PlaylistRow[]
  schema: SchemaRow[]
}

export const musicFootnote = 'Read only. The music stays between couple and DJ.'

export const weddingDetails: Record<string, WeddingDetail> = {
  'emma-julian': {
    id: 'emma-julian',
    couple: 'Emma & Julian',
    dateLine: '14 JUNE 2027 · IN 42 DAYS',
    summary: 'De Oude Tuinderij, Aalsmeer · 120 guests · ceremony 13:30, opening dance 20:30',
    team: [
      { role: 'VENUE', name: 'Sanne de Groot', note: 'De Oude Tuinderij · rain plan: glass house', phone: '+31 20 555 0184', email: 'sanne@oudetuinderij.nl' },
      { role: 'DJ', name: 'Daan Vermeer', note: 'On the decks 20:30 · load-in side door 19:45', phone: '+31 6 14 82 30 77', email: 'daan@daanvermeer.nl' },
      { role: 'CATERING', name: 'Petra Willems · Smaakmakers', note: 'Dinner 17:30 · 4 vegan, 2 gluten free', phone: '+31 6 58 09 12 76', email: 'petra@smaakmakers.nl' },
      { role: 'PHOTO', name: 'Merel Jansen', note: "Arrives 08:00 at the bride's parents", phone: '+31 6 22 70 45 18', email: 'merel@mereljansen.nl' },
      { role: 'MC', name: 'Tim Bakker', note: 'Friend of the groom · runs the speeches', phone: '+31 6 40 71 29 55', email: 'tim.bakker@gmail.com' },
    ],
    shareUrl: 'rekordmatch.app/emma-julian-14june',
    people: [
      { name: 'Emma Verhoeven', note: 'bride · getting ready at her parents', phone: '+31 6 30 55 81 40', email: 'emma.verhoeven@gmail.com' },
      { name: 'Julian Meijer', note: 'groom · reachable until 12:00', phone: '+31 6 19 72 03 66', email: 'julian.meijer@gmail.com' },
    ],
    musicHeading: 'THEIR MUSIC · 6 OF 6 LISTS IN',
    playlists: [
      { title: 'Opening dance', preview: "Can't Help Falling in Love · Elvis Presley", count: '1 SONG' },
      { title: 'Second & third song', preview: 'Perfect Day · then everyone on the floor', count: '2 SONGS' },
      { title: 'Their top 20', preview: 'Dreams, September, Tender, Golden…', count: '20 SONGS' },
      { title: "Friends' top 20", preview: 'Mr. Brightside, Dancing Queen, Levels…', count: '17 SONGS' },
      { title: 'The never list', preview: 'The Chicken Dance, Macarena', count: '2 SONGS' },
      { title: 'Must-plays, no matter what', preview: "L'Amour Toujours, Purple Rain, Free Bird", count: '3 SONGS' },
    ],
    schema: [
      { time: '08:00', what: "Photographer at the bride's parents", who: 'Merel Jansen' },
      { time: '13:30', what: 'Ceremony in the garden', who: 'Sanne de Groot' },
      { time: '15:00', what: 'Reception, drinks on the lawn', who: 'Petra Willems' },
      { time: '17:30', what: 'Dinner, speeches between courses', who: 'Tim Bakker' },
      { time: '19:45', what: 'DJ load-in through the side door', who: 'Daan Vermeer' },
      { time: '20:30', what: 'Opening dance, floor opens after', who: 'Daan Vermeer' },
      { time: '01:00', what: 'Last song, lights up', who: 'Daan Vermeer' },
    ],
  },
  'sofie-mark': {
    id: 'sofie-mark',
    couple: 'Sofie & Mark',
    dateLine: '3 JULY 2027 · IN 61 DAYS',
    summary: 'Landgoed Ter Hooge, Middelburg · 85 guests · ceremony 14:00, opening dance 21:00',
    team: [
      { role: 'VENUE', name: 'Wouter Roelofs', note: 'Landgoed Ter Hooge · chapel on the estate', phone: '+31 118 555 26 40', email: 'wouter@terhooge.nl' },
      { role: 'DJ', name: 'Yara Postma', note: 'On the decks 21:00 · load-in courtyard 20:15', phone: '+31 6 27 55 91 02', email: 'yara@yarapostma.nl' },
      { role: 'PHOTO', name: 'Bram Hoekstra · Studio Noord', note: 'Two shooters · same-day preview', phone: '+31 50 555 41 08', email: 'bram@studionoord.nl' },
    ],
    shareUrl: 'rekordmatch.app/sofie-mark-3july',
    people: [
      { name: 'Sofie Brouwer', note: 'bride · reachable until 11:00', phone: '+31 6 45 20 73 18', email: 'sofie.brouwer@gmail.com' },
      { name: 'Mark Nieuwenhuis', note: 'groom · staying at the estate', phone: '+31 6 52 88 04 27', email: 'mark.nieuwenhuis@gmail.com' },
    ],
    musicHeading: 'THEIR MUSIC · 3 OF 6 LISTS IN',
    playlists: [
      { title: 'Opening dance', preview: 'At Last · Etta James', count: '1 SONG' },
      { title: 'Second & third song', preview: 'Not filled in yet', count: 'WAITING' },
      { title: 'Their top 20', preview: 'Redbone, Vienna, Alright, Sunflower…', count: '14 SONGS' },
      { title: "Friends' top 20", preview: 'Not filled in yet', count: 'WAITING' },
      { title: 'The never list', preview: 'Not filled in yet', count: 'WAITING' },
      { title: 'Must-plays, no matter what', preview: 'Zeeuws Meisje, Dancing in the Dark', count: '2 SONGS' },
    ],
    schema: [
      { time: '10:00', what: 'Getting ready at the estate', who: 'Bram Hoekstra' },
      { time: '14:00', what: 'Ceremony in the chapel', who: 'Wouter Roelofs' },
      { time: '18:00', what: 'Dinner in the orangery', who: 'Caterer open' },
      { time: '20:15', what: 'DJ load-in through the courtyard', who: 'Yara Postma' },
      { time: '21:00', what: 'Opening dance, floor opens after', who: 'Yara Postma' },
    ],
  },
  'lisa-tom': {
    id: 'lisa-tom',
    couple: 'Lisa & Tom',
    dateLine: '21 AUGUST 2027 · IN 110 DAYS',
    summary: 'Strandpaviljoen Zuid, Bloemendaal · 150 guests · ceremony 15:00, music stops 01:00',
    team: [
      { role: 'VENUE', name: 'Karin Smit', note: 'Strandpaviljoen Zuid · hard stop on music at 01:00', phone: '+31 23 555 07 22', email: 'karin@strandpaviljoenzuid.nl' },
      { role: 'PHOTO', name: 'Merel Jansen', note: 'Golden hour portraits on the beach', phone: '+31 6 22 70 45 18', email: 'merel@mereljansen.nl' },
    ],
    shareUrl: 'rekordmatch.app/lisa-tom-21august',
    people: [
      { name: 'Lisa Kuiper', note: 'bride · getting ready at the hotel', phone: '+31 6 12 66 39 84', email: 'lisa.kuiper@gmail.com' },
      { name: 'Tom de Waal', note: 'groom · reachable all morning', phone: '+31 6 29 41 57 03', email: 'tom.dewaal@gmail.com' },
    ],
    musicHeading: 'THEIR MUSIC · NOT STARTED',
    playlists: [
      { title: 'Opening dance', preview: 'Not filled in yet', count: 'WAITING' },
      { title: 'Second & third song', preview: 'Not filled in yet', count: 'WAITING' },
      { title: 'Their top 20', preview: 'Not filled in yet', count: 'WAITING' },
      { title: "Friends' top 20", preview: 'Not filled in yet', count: 'WAITING' },
      { title: 'The never list', preview: 'Not filled in yet', count: 'WAITING' },
      { title: 'Must-plays, no matter what', preview: 'Not filled in yet', count: 'WAITING' },
    ],
    schema: [
      { time: '12:00', what: 'Getting ready at the hotel', who: 'Merel Jansen' },
      { time: '15:00', what: 'Ceremony on the beach', who: 'Karin Smit' },
      { time: '18:30', what: 'Dinner in the pavilion', who: 'Caterer open' },
      { time: '21:00', what: 'Opening dance, DJ still open', who: 'DJ open' },
      { time: '01:00', what: 'Music stops, house rule', who: 'Karin Smit' },
    ],
  },
  'nora-wessel': {
    id: 'nora-wessel',
    couple: 'Nora & Wessel',
    dateLine: '2 MAY 2026 · PAST',
    summary: 'Kasteel Wijenburg, Echteld · 95 guests · archived',
    team: [
      { role: 'VENUE', name: 'Elke Vermeulen', note: 'Kasteel Wijenburg · castle hall', phone: '+31 344 555 61 20', email: 'elke@kasteelwijenburg.nl' },
      { role: 'DJ', name: 'Daan Vermeer', note: 'Played 20:45 to 01:30', phone: '+31 6 14 82 30 77', email: 'daan@daanvermeer.nl' },
      { role: 'CATERING', name: 'Annelies de Jong · Bureau Banket', note: 'Seated dinner, five courses', phone: '+31 30 555 02 91', email: 'annelies@bureaubanket.nl' },
    ],
    shareUrl: 'rekordmatch.app/nora-wessel-2may',
    people: [
      { name: 'Nora Bosman', note: 'bride', phone: '+31 6 33 71 08 45', email: 'nora.bosman@gmail.com' },
      { name: 'Wessel Kramer', note: 'groom', phone: '+31 6 21 90 54 66', email: 'wessel.kramer@gmail.com' },
    ],
    musicHeading: 'THEIR MUSIC · ARCHIVED',
    playlists: [
      { title: 'Opening dance', preview: 'Make You Feel My Love · Adele', count: '1 SONG' },
      { title: 'Second & third song', preview: 'Valerie · then Sweet Disposition', count: '2 SONGS' },
      { title: 'Their top 20', preview: 'Blue Monday, Nightcall, Cola…', count: '20 SONGS' },
      { title: "Friends' top 20", preview: 'Titanium, Wonderwall, One More Time…', count: '20 SONGS' },
      { title: 'The never list', preview: 'Vlieger, Sweet Caroline', count: '2 SONGS' },
      { title: 'Must-plays, no matter what', preview: 'Bohemian Rhapsody, Waterloo', count: '2 SONGS' },
    ],
    schema: [
      { time: '13:00', what: 'Ceremony in the castle hall', who: 'Elke Vermeulen' },
      { time: '18:00', what: 'Seated dinner, five courses', who: 'Annelies de Jong' },
      { time: '20:45', what: 'Opening dance', who: 'Daan Vermeer' },
      { time: '01:30', what: 'Last song', who: 'Daan Vermeer' },
    ],
  },
  'femke-ruben': {
    id: 'femke-ruben',
    couple: 'Femke & Ruben',
    dateLine: '18 APRIL 2026 · PAST',
    summary: 'De Oude Tuinderij, Aalsmeer · 110 guests · archived',
    team: [
      { role: 'VENUE', name: 'Sanne de Groot', note: 'De Oude Tuinderij · glass house', phone: '+31 20 555 0184', email: 'sanne@oudetuinderij.nl' },
      { role: 'DJ', name: 'Yara Postma', note: 'Played 21:00 to 01:00', phone: '+31 6 27 55 91 02', email: 'yara@yarapostma.nl' },
      { role: 'CATERING', name: 'Milan Petrović · Fest & Food', note: 'Food trucks in the garden', phone: '+31 6 77 20 94 41', email: 'milan@festenfood.nl' },
    ],
    shareUrl: 'rekordmatch.app/femke-ruben-18april',
    people: [
      { name: 'Femke Dijkstra', note: 'bride', phone: '+31 6 47 12 88 30', email: 'femke.dijkstra@gmail.com' },
      { name: 'Ruben Hoogendoorn', note: 'groom', phone: '+31 6 55 03 26 71', email: 'ruben.hoogendoorn@gmail.com' },
    ],
    musicHeading: 'THEIR MUSIC · ARCHIVED',
    playlists: [
      { title: 'Opening dance', preview: 'Your Song · Elton John', count: '1 SONG' },
      { title: 'Second & third song', preview: "Move On Up · then Ain't Nobody", count: '2 SONGS' },
      { title: 'Their top 20', preview: 'Praise You, Rasputin, Toxic…', count: '18 SONGS' },
      { title: "Friends' top 20", preview: 'Zombie, Hey Ya!, Bad Guy…', count: '19 SONGS' },
      { title: 'The never list', preview: 'Cotton Eye Joe', count: '1 SONG' },
      { title: 'Must-plays, no matter what', preview: 'Tainted Love, Sandstorm', count: '2 SONGS' },
    ],
    schema: [
      { time: '14:30', what: 'Ceremony in the glass house', who: 'Sanne de Groot' },
      { time: '17:00', what: 'Food trucks open in the garden', who: 'Milan Petrović' },
      { time: '21:00', what: 'Opening dance', who: 'Yara Postma' },
      { time: '01:00', what: 'Last song', who: 'Yara Postma' },
    ],
  },
}
