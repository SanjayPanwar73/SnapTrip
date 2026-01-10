const sampleUsers = [
  {
    username: "traveler_jane",
    email: "jane.doe@example.com",
    favorites: []
  },
  {
    username: "adventure_mike",
    email: "mike.adventure@example.com",
    favorites: []
  },
  {
    username: "wanderlust_sarah",
    email: "sarah.wander@example.com",
    favorites: []
  },
  {
    username: "globetrotter_tom",
    email: "tom.globetrotter@example.com",
    favorites: []
  },
  {
    username: "explorer_lisa",
    email: "lisa.explorer@example.com",
    favorites: []
  },
  {
    username: "backpacker_alex",
    email: "alex.backpacker@example.com",
    favorites: []
  },
  {
    username: "luxury_traveler",
    email: "luxury.traveler@example.com",
    favorites: []
  },
  {
    username: "nature_lover",
    email: "nature.lover@example.com",
    favorites: []
  },
  {
    username: "city_breaker",
    email: "city.breaker@example.com",
    favorites: []
  },
  {
    username: "beach_bum",
    email: "beach.bum@example.com",
    favorites: []
  },
  {
    username: "mountain_climber",
    email: "mountain.climber@example.com",
    favorites: []
  },
  {
    username: "cultural_explorer",
    email: "cultural.explorer@example.com",
    favorites: []
  }
];

const sampleReviews = [
  {
    rating: 5,
    comment: "Absolutely stunning location! The views were breathtaking and the host was incredibly welcoming. Would definitely recommend to anyone visiting."
  },
  {
    rating: 4,
    comment: "Great place to stay. Clean, comfortable, and in a perfect location. Only minor issue was the WiFi connection, but otherwise excellent."
  },
  {
    rating: 5,
    comment: "Exceeded all expectations! The property was even better than the photos suggested. Perfect for a relaxing getaway."
  },
  {
    rating: 3,
    comment: "Decent accommodation but not quite what I expected. The location is good but could use some maintenance updates."
  },
  {
    rating: 5,
    comment: "Amazing experience! The host went above and beyond to make our stay special. Highly recommend!"
  },
  {
    rating: 4,
    comment: "Beautiful property with great amenities. The only downside was that it was a bit far from the city center, but the peace and quiet made up for it."
  },
  {
    rating: 5,
    comment: "Perfect getaway spot! Everything was exactly as described and more. Will definitely be back."
  },
  {
    rating: 4,
    comment: "Very comfortable and well-maintained. Great value for money. The host was responsive and helpful throughout our stay."
  },
  {
    rating: 5,
    comment: "Incredible location and stunning views. The property was immaculate and had everything we needed for a perfect vacation."
  },
  {
    rating: 3,
    comment: "Average experience. The place was okay but didn't live up to the hype. Would look elsewhere next time."
  },
  {
    rating: 5,
    comment: "Outstanding! The attention to detail and the hospitality were exceptional. One of the best stays we've had."
  },
  {
    rating: 4,
    comment: "Lovely property in a great location. Clean, comfortable, and well-equipped. Would stay again."
  },
  {
    rating: 5,
    comment: "Fantastic! The host was amazing and the property was exactly as advertised. Perfect for our family vacation."
  },
  {
    rating: 4,
    comment: "Good value and comfortable stay. The location was convenient and the property was clean. Would stay again."
  },
  {
    rating: 5,
    comment: "Exceptional experience! The views, the amenities, and the service were all top-notch. Highly recommended."
  }
];

const sampleNewsletterSubscribers = [
  { email: "newsletter1@example.com" },
  { email: "newsletter2@example.com" },
  { email: "newsletter3@example.com" },
  { email: "newsletter4@example.com" },
  { email: "newsletter5@example.com" },
  { email: "newsletter6@example.com" },
  { email: "newsletter7@example.com" },
  { email: "newsletter8@example.com" },
  { email: "newsletter9@example.com" },
  { email: "newsletter10@example.com" },
  { email: "newsletter11@example.com" },
  { email: "newsletter12@example.com" },
  { email: "newsletter13@example.com" },
  { email: "newsletter14@example.com" },
  { email: "newsletter15@example.com" },
  { email: "newsletter16@example.com" },
  { email: "newsletter17@example.com" },
  { email: "newsletter18@example.com" },
  { email: "newsletter19@example.com" },
  { email: "newsletter20@example.com" }
];

const sampleContacts = [
  {
    name: "John Smith",
    email: "john.smith@example.com",
    subject: "Booking Inquiry",
    message: "Hi, I'm interested in booking the Beachfront Cottage for next month. Could you please provide more details about availability and pricing?"
  },
  {
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    subject: "Partnership Opportunity",
    message: "Hello, I'm representing a travel agency and would like to discuss potential partnership opportunities with SnapTrip."
  },
  {
    name: "David Johnson",
    email: "david.johnson@example.com",
    subject: "Technical Issue",
    message: "I'm having trouble accessing my account. The login page keeps showing an error. Could you help me resolve this?"
  },
  {
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    subject: "Feedback",
    message: "I wanted to share my positive experience with the Mountain Retreat listing. The host was amazing and the property was perfect!"
  },
  {
    name: "Robert Brown",
    email: "robert.brown@example.com",
    subject: "Cancellation Policy",
    message: "I need to cancel my upcoming reservation. Could you please explain the cancellation policy and refund process?"
  },
  {
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    subject: "Feature Request",
    message: "Would it be possible to add a wishlist feature to save favorite listings for later? That would be very helpful."
  },
  {
    name: "Michael Davis",
    email: "michael.davis@example.com",
    subject: "General Inquiry",
    message: "I'm new to SnapTrip and would like to know more about how the platform works and what makes it different from other booking sites."
  },
  {
    name: "Sarah Miller",
    email: "sarah.miller@example.com",
    subject: "Host Application",
    message: "I'm interested in becoming a host on SnapTrip. Could you provide information about the application process and requirements?"
  }
];

const sampleFeedback = [
  {
    name: "Alice Cooper",
    email: "alice.cooper@example.com",
    rating: 5,
    feedback: "SnapTrip has completely changed how I travel! The platform is user-friendly and the listings are always accurate. Keep up the great work!"
  },
  {
    name: "Bob Wilson",
    email: "bob.wilson@example.com",
    rating: 4,
    feedback: "Great platform overall. Love the variety of listings and the ease of booking. Would love to see more filtering options though."
  },
  {
    name: "Carol Davis",
    email: "carol.davis@example.com",
    rating: 5,
    feedback: "Outstanding service! The customer support team was incredibly helpful when I had questions about my booking. Highly recommend!"
  },
  {
    name: "Daniel Lee",
    email: "daniel.lee@example.com",
    rating: 3,
    feedback: "Decent platform but could use some improvements in the mobile app. The website works well though."
  },
  {
    name: "Eva Martinez",
    email: "eva.martinez@example.com",
    rating: 5,
    feedback: "Love SnapTrip! Found amazing places I never would have discovered otherwise. The community aspect is fantastic."
  },
  {
    name: "Frank Johnson",
    email: "frank.johnson@example.com",
    rating: 4,
    feedback: "Good platform with great selection. The booking process is smooth and the hosts are generally very responsive."
  },
  {
    name: "Grace Taylor",
    email: "grace.taylor@example.com",
    rating: 5,
    feedback: "SnapTrip exceeded my expectations! The quality of listings and the overall experience has been wonderful."
  },
  {
    name: "Henry Brown",
    email: "henry.brown@example.com",
    rating: 4,
    feedback: "Solid platform with good variety. Would appreciate more detailed host profiles and verification badges."
  },
  {
    name: "Ivy Chen",
    email: "ivy.chen@example.com",
    rating: 5,
    feedback: "Fantastic platform! The attention to detail and the quality of service is impressive. Will definitely use again."
  },
  {
    name: "Jack Wilson",
    email: "jack.wilson@example.com",
    rating: 3,
    feedback: "Average experience. The platform works but feels a bit generic compared to competitors. Could use more unique features."
  }
];

const sampleCategories = [
  {
    name: "Hotels",
    icon: "fa-solid fa-hotel",
    isActive: true
  },
  {
    name: "Restaurants",
    icon: "fa-solid fa-utensils",
    isActive: true
  },
  {
    name: "Attractions",
    icon: "fa-solid fa-landmark",
    isActive: true
  },
  {
    name: "Beaches",
    icon: "fa-solid fa-water",
    isActive: true
  },
  {
    name: "Mountains",
    icon: "fa-solid fa-mountain",
    isActive: true
  },
  {
    name: "Cities",
    icon: "fa-solid fa-city",
    isActive: true
  },
  {
    name: "Villages",
    icon: "fa-solid fa-tree",
    isActive: true
  },
  {
    name: "Adventure",
    icon: "fa-solid fa-person-hiking",
    isActive: true
  },
  {
    name: "Relaxation",
    icon: "fa-solid fa-spa",
    isActive: true
  },
  {
    name: "Nightlife",
    icon: "fa-solid fa-champagne-glasses",
    isActive: true
  }
];

module.exports = {
  users: sampleUsers,
  reviews: sampleReviews,
  categories: sampleCategories,
  newsletterSubscribers: sampleNewsletterSubscribers,
  contacts: sampleContacts,
  feedback: sampleFeedback
};
