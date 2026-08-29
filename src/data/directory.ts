/**
 * The vendor directory.
 *
 * `catering` is transcribed from screen 1b of the mock. The other three tabs are
 * not drawn in the mock, which states "Works the same for photographers,
 * locations and DJs", so they reuse the same shape and the people the mock
 * already names elsewhere (Merel Jansen, Karin Smit, Sanne de Groot, ...).
 */

export type Contact = { name: string; role: string; phone: string; email: string }

export type Vendor = {
  id: string
  name: string
  place: string
  blurb: string
  contacts: Contact[]
}

export type DirectoryTab = {
  key: string
  nav: string
  title: string
  subtitle: string
  search: string
  add: string
  note: string
  noteLink: string
  vendors: Vendor[]
}

export const directory: DirectoryTab[] = [
  {
    key: 'catering',
    nav: 'Catering',
    title: 'Catering.',
    subtitle: 'Eight caterers you work with, and who to call at each.',
    search: 'Search a name or dish…',
    add: '+ Add caterer',
    note: 'Works the same for photographers, locations and DJs.',
    noteLink: 'Switch tabs on the left.',
    vendors: [
      {
        id: 'smaakmakers',
        name: 'Smaakmakers Catering',
        place: 'AMSTERDAM',
        blurb: 'Shared dining, long tables. Vegetarian first. Booked 6 times.',
        contacts: [
          { name: 'Jasper Vos', role: 'OWNER · QUOTES AND MENUS', phone: '+31 6 21 44 87 03', email: 'jasper@smaakmakers.nl' },
          { name: 'Petra Willems', role: 'DAY LEAD · ON SITE', phone: '+31 6 58 09 12 76', email: 'petra@smaakmakers.nl' },
        ],
      },
      {
        id: 'bureau-banket',
        name: 'Bureau Banket',
        place: 'UTRECHT',
        blurb: 'Classic seated dinners, strong wine list. Booked 4 times.',
        contacts: [
          { name: 'Annelies de Jong', role: 'SALES · FIRST CONTACT', phone: '+31 30 555 02 91', email: 'annelies@bureaubanket.nl' },
          { name: 'Koen Bakema', role: 'HEAD CHEF · ALLERGIES', phone: '+31 6 40 33 18 25', email: 'koen@bureaubanket.nl' },
        ],
      },
      {
        id: 'fest-food',
        name: 'Fest & Food',
        place: 'ROTTERDAM',
        blurb: 'Food trucks and street food, great for outdoor venues. Booked twice.',
        contacts: [
          { name: 'Milan Petrović', role: 'OWNER · EVERYTHING', phone: '+31 6 77 20 94 41', email: 'milan@festenfood.nl' },
        ],
      },
    ],
  },
  {
    key: 'photographers',
    nav: 'Photographers',
    title: 'Photographers.',
    subtitle: 'Six photographers you work with, and how they shoot a day.',
    search: 'Search a name or style…',
    add: '+ Add photographer',
    note: 'Works the same for catering, locations and DJs.',
    noteLink: 'Switch tabs on the left.',
    vendors: [
      {
        id: 'merel-jansen',
        name: 'Merel Jansen',
        place: 'HAARLEM',
        blurb: 'Documentary style, works alone. Stays until the first dance. Booked 9 times.',
        contacts: [
          { name: 'Merel Jansen', role: 'PHOTOGRAPHER · EVERYTHING', phone: '+31 6 22 70 45 18', email: 'merel@mereljansen.nl' },
        ],
      },
      {
        id: 'studio-noord',
        name: 'Studio Noord',
        place: 'GRONINGEN',
        blurb: 'Two shooters, posed portraits and a same-day preview. Booked 5 times.',
        contacts: [
          { name: 'Bram Hoekstra', role: 'LEAD · PLANNING AND QUOTES', phone: '+31 50 555 41 08', email: 'bram@studionoord.nl' },
          { name: 'Iris Peeters', role: 'SECOND SHOOTER · ON SITE', phone: '+31 6 31 90 62 14', email: 'iris@studionoord.nl' },
        ],
      },
      {
        id: 'lumen-fotografie',
        name: 'Lumen Fotografie',
        place: 'EINDHOVEN',
        blurb: 'Film and digital mixed, low light specialist. Booked twice.',
        contacts: [
          { name: 'Sepp Aarts', role: 'OWNER · EVERYTHING', phone: '+31 6 48 12 77 39', email: 'sepp@lumenfotografie.nl' },
        ],
      },
    ],
  },
  {
    key: 'locations',
    nav: 'Locations',
    title: 'Locations.',
    subtitle: 'The venues you keep coming back to, and who holds the keys.',
    search: 'Search a venue or town…',
    add: '+ Add location',
    note: 'Works the same for catering, photographers and DJs.',
    noteLink: 'Switch tabs on the left.',
    vendors: [
      {
        id: 'oude-tuinderij',
        name: 'De Oude Tuinderij',
        place: 'AALSMEER',
        blurb: 'Glass house and garden, fits 140. Rain plan indoors. Booked 7 times.',
        contacts: [
          { name: 'Sanne de Groot', role: 'VENUE MANAGER · DAY OF', phone: '+31 20 555 0184', email: 'sanne@oudetuinderij.nl' },
          { name: 'Hugo Terpstra', role: 'BOOKINGS · CONTRACTS', phone: '+31 20 555 0190', email: 'hugo@oudetuinderij.nl' },
        ],
      },
      {
        id: 'strandpaviljoen-zuid',
        name: 'Strandpaviljoen Zuid',
        place: 'BLOEMENDAAL',
        blurb: 'Beach venue, fits 180. Hard stop on music at 01:00. Booked 3 times.',
        contacts: [
          { name: 'Karin Smit', role: 'OWNER · EVERYTHING', phone: '+31 23 555 07 22', email: 'karin@strandpaviljoenzuid.nl' },
        ],
      },
      {
        id: 'landgoed-ter-hooge',
        name: 'Landgoed Ter Hooge',
        place: 'MIDDELBURG',
        blurb: 'Estate with a chapel, fits 110. Ceremony and party in one place. Booked twice.',
        contacts: [
          { name: 'Wouter Roelofs', role: 'ESTATE MANAGER · EVERYTHING', phone: '+31 118 555 26 40', email: 'wouter@terhooge.nl' },
        ],
      },
    ],
  },
  {
    key: 'djs',
    nav: 'DJs',
    title: 'DJs.',
    subtitle: 'The DJs you trust with the floor, and what they play best.',
    search: 'Search a name or genre…',
    add: '+ Add DJ',
    note: 'Works the same for catering, photographers and locations.',
    noteLink: 'Switch tabs on the left.',
    vendors: [
      {
        id: 'daan-vermeer',
        name: 'Daan Vermeer',
        place: 'AMSTERDAM',
        blurb: 'Disco into house, reads a room well. Brings his own booth. Booked 11 times.',
        contacts: [
          { name: 'Daan Vermeer', role: 'DJ · EVERYTHING', phone: '+31 6 14 82 30 77', email: 'daan@daanvermeer.nl' },
        ],
      },
      {
        id: 'yara-postma',
        name: 'Yara Postma',
        place: 'UTRECHT',
        blurb: 'Soul, funk and eighties. Good with a mixed age crowd. Booked 6 times.',
        contacts: [
          { name: 'Yara Postma', role: 'DJ · EVERYTHING', phone: '+31 6 27 55 91 02', email: 'yara@yarapostma.nl' },
        ],
      },
      {
        id: 'ravi-sandhu',
        name: 'Ravi Sandhu',
        place: 'DEN HAAG',
        blurb: 'Late night techno, also plays dinner sets. Books out early. Booked 4 times.',
        contacts: [
          { name: 'Ravi Sandhu', role: 'DJ · EVERYTHING', phone: '+31 6 36 40 18 93', email: 'ravi@ravisandhu.nl' },
        ],
      },
    ],
  },
]

export const directoryFooter = 'EVERY CONTACT HERE CAN BE ASSIGNED TO A WEDDING IN ONE TAP'

/** Which directory tab fills each slot on the new wedding screen. */
export const tabFor = (key: string) => directory.find((d) => d.key === key)!
