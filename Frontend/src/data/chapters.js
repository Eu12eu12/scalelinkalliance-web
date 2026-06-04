// src/data/chapters.js
export const chapters = [
  {
    id: 'nyc',
    slug: 'new-york',
    name: 'New York City Chapter',
    city: 'New York',
    state: 'NY',
    region: 'northeast',
    address: '123 Madison Ave, New York, NY 10016',
    meeting: {
      day: 'Wednesday',
      time: '8:00 AM',
      type: 'In-Person',
      location: 'Midtown Manhattan'
    },
    members: {
      total: 24,
      capacity: 30,
      openSeats: 6
    },
    industries: {
      filled: ['Real Estate', 'Legal Services', 'IT Consulting', 'Marketing Agency', 'Financial Planning', 'Accounting'],
      open: ['Web Development', 'Graphic Design', 'Photography', 'Social Media Management', 'Copywriting', 'Business Coaching']
    },
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'chi',
    slug: 'chicago',
    name: 'Chicago Chapter',
    city: 'Chicago',
    state: 'IL',
    region: 'midwest',
    address: '200 N Michigan Ave, Chicago, IL 60601',
    meeting: {
      day: 'Tuesday',
      time: '7:30 AM',
      type: 'In-Person',
      location: 'The Loop'
    },
    members: {
      total: 18,
      capacity: 30,
      openSeats: 12
    },
    industries: {
      filled: ['Real Estate', 'Legal Services', 'Financial Planning', 'Marketing Agency'],
      open: ['Web Development', 'Graphic Design', 'IT Consulting', 'Photography', 'Social Media Management', 'Copywriting', 'Accounting', 'Business Coaching']
    },
    image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'sf',
    slug: 'san-francisco',
    name: 'San Francisco Chapter',
    city: 'San Francisco',
    state: 'CA',
    region: 'west',
    address: '1 Market St, San Francisco, CA 94105',
    meeting: {
      day: 'Thursday',
      time: '8:30 AM',
      type: 'Hybrid',
      location: 'Financial District'
    },
    members: {
      total: 26,
      capacity: 30,
      openSeats: 4
    },
    industries: {
      filled: ['Tech Startup', 'Venture Capital', 'Legal Services', 'IT Consulting', 'Marketing Agency', 'Financial Planning', 'Web Development', 'Graphic Design'],
      open: ['Photography', 'Social Media Management', 'Copywriting', 'Accounting', 'Business Coaching']
    },
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  }
];