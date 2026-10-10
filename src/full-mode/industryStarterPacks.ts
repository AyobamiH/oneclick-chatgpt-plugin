/**
 * Industry Starter Packs
 * Pre-defined configurations for different business types
 * Provides vocabulary, trust markers, CTAs, layouts, and must-have sections
 */

export interface IndustryStarterPack {
  id: string;
  name: string;
  description: string;
  headlines: string[];
  subheadlines: string[];
  ctas: string[];
  trustMarkers: string[];
  mustHaveSections: string[];
  vocabularyTerms: string[];
  layoutTendency: 'minimal' | 'corporate' | 'creative' | 'premium' | 'local';
  colorTendency: 'warm' | 'cool' | 'neutral' | 'bold' | 'muted';
  icon: string;
}

export const INDUSTRY_STARTER_PACKS: IndustryStarterPack[] = [
  {
    id: 'consultant',
    name: 'Consultant / Advisor',
    description: 'Business consultants, coaches, strategists',
    headlines: [
      'Clarity, Strategy, Results.',
      'Helping You Build What Matters.',
      'Transform Your Business, Transform Your Life.',
    ],
    subheadlines: [
      'Expert guidance to help you reach your goals faster.',
      'Proven strategies tailored to your unique challenges.',
      'Partner with an expert who understands your industry.',
    ],
    ctas: ['Book a Discovery Call', 'Schedule Your Free Consultation', 'Get Started Today'],
    trustMarkers: ['Years of Experience', 'Clients Served', 'Success Rate', 'Industry Certifications'],
    mustHaveSections: ['hero', 'services', 'case-studies', 'about', 'testimonials', 'cta', 'contact'],
    vocabularyTerms: ['strategy', 'growth', 'transformation', 'results', 'partnership', 'expertise'],
    layoutTendency: 'corporate',
    colorTendency: 'neutral',
    icon: 'Briefcase',
  },
  {
    id: 'salon',
    name: 'Salon / Beauty',
    description: 'Hair salons, spas, beauty services',
    headlines: [
      'Look Good. Feel Amazing.',
      'Where Beauty Meets Expertise.',
      'Your Best Self Starts Here.',
    ],
    subheadlines: [
      'Relax, refresh, and leave feeling fabulous.',
      'Expert stylists dedicated to bringing out your best.',
      'A sanctuary for self-care and transformation.',
    ],
    ctas: ['Book Your Appointment', 'View Our Services', 'Get Your Glow On'],
    trustMarkers: ['Years in Business', 'Happy Clients', '5-Star Reviews', 'Award-Winning Stylists'],
    mustHaveSections: ['hero', 'gallery', 'services', 'pricing', 'testimonials', 'team', 'booking', 'contact'],
    vocabularyTerms: ['beauty', 'style', 'transformation', 'relaxation', 'expertise', 'luxury'],
    layoutTendency: 'creative',
    colorTendency: 'warm',
    icon: 'Scissors',
  },
  {
    id: 'coach',
    name: 'Coach / Mentor',
    description: 'Life coaches, fitness trainers, mentors',
    headlines: [
      'Become Who You Were Meant to Be.',
      'Unlock Your Full Potential.',
      'Your Journey to Success Starts Now.',
    ],
    subheadlines: [
      'Personalized coaching to help you break through barriers.',
      'Transform challenges into opportunities for growth.',
      'Guidance and accountability to achieve your dreams.',
    ],
    ctas: ['Start Your Journey', 'Book a Free Session', 'Transform Your Life'],
    trustMarkers: ['Lives Changed', 'Success Stories', 'Certified Coach', 'Years Coaching'],
    mustHaveSections: ['hero', 'transformation', 'programs', 'testimonials', 'about', 'faq', 'cta'],
    vocabularyTerms: ['transformation', 'growth', 'potential', 'journey', 'breakthrough', 'empowerment'],
    layoutTendency: 'creative',
    colorTendency: 'bold',
    icon: 'Target',
  },
  {
    id: 'restaurant',
    name: 'Restaurant / Cafe',
    description: 'Restaurants, cafes, food service',
    headlines: [
      'Where Every Meal Tells a Story.',
      'Taste the Difference.',
      'Fresh. Local. Delicious.',
    ],
    subheadlines: [
      'A culinary experience crafted with passion.',
      'Fresh ingredients, unforgettable flavors.',
      'Your neighborhood gathering place.',
    ],
    ctas: ['View Our Menu', 'Reserve a Table', 'Order Online'],
    trustMarkers: ['Years Serving', 'Local Ingredients', 'TripAdvisor Rating', 'Happy Customers'],
    mustHaveSections: ['hero', 'menu', 'gallery', 'about', 'location', 'hours', 'reservation', 'contact'],
    vocabularyTerms: ['fresh', 'local', 'authentic', 'crafted', 'experience', 'flavor'],
    layoutTendency: 'creative',
    colorTendency: 'warm',
    icon: 'UtensilsCrossed',
  },
  {
    id: 'tradesperson',
    name: 'Tradesperson / Contractor',
    description: 'Plumbers, electricians, builders, contractors',
    headlines: [
      'Quality Work You Can Trust.',
      'Your Local Experts.',
      'Professional Service, Every Time.',
    ],
    subheadlines: [
      'Licensed, insured, and dedicated to your satisfaction.',
      'Fast, reliable service when you need it most.',
      'Trusted by homeowners throughout the area.',
    ],
    ctas: ['Get a Free Quote', 'Call Now', 'Schedule Service'],
    trustMarkers: ['Years Experience', 'Jobs Completed', 'Licensed & Insured', '5-Star Reviews'],
    mustHaveSections: ['hero', 'services', 'service-areas', 'testimonials', 'gallery', 'about', 'contact'],
    vocabularyTerms: ['reliable', 'professional', 'licensed', 'quality', 'trusted', 'local'],
    layoutTendency: 'local',
    colorTendency: 'cool',
    icon: 'Wrench',
  },
  {
    id: 'designer',
    name: 'Designer / Creative',
    description: 'Graphic designers, web designers, creatives',
    headlines: [
      'Design That Makes an Impact.',
      'Where Creativity Meets Strategy.',
      'Bringing Your Vision to Life.',
    ],
    subheadlines: [
      'Beautiful design that drives real results.',
      'Creative solutions tailored to your brand.',
      'Making your ideas look amazing.',
    ],
    ctas: ['View My Work', 'Start a Project', 'Let\'s Create Together'],
    trustMarkers: ['Projects Completed', 'Happy Clients', 'Awards Won', 'Years of Experience'],
    mustHaveSections: ['hero', 'portfolio', 'services', 'process', 'testimonials', 'about', 'contact'],
    vocabularyTerms: ['creative', 'design', 'brand', 'visual', 'innovative', 'aesthetic'],
    layoutTendency: 'creative',
    colorTendency: 'bold',
    icon: 'Palette',
  },
  {
    id: 'healthcare',
    name: 'Healthcare / Wellness',
    description: 'Doctors, therapists, wellness practitioners',
    headlines: [
      'Your Health, Our Priority.',
      'Compassionate Care You Deserve.',
      'Wellness Starts Here.',
    ],
    subheadlines: [
      'Dedicated to improving your quality of life.',
      'Expert care in a comfortable environment.',
      'Personalized treatment plans for lasting results.',
    ],
    ctas: ['Book an Appointment', 'Learn More', 'Contact Us Today'],
    trustMarkers: ['Years of Practice', 'Patients Served', 'Board Certified', 'Insurance Accepted'],
    mustHaveSections: ['hero', 'services', 'team', 'testimonials', 'about', 'insurance', 'contact'],
    vocabularyTerms: ['care', 'wellness', 'health', 'compassionate', 'professional', 'healing'],
    layoutTendency: 'corporate',
    colorTendency: 'cool',
    icon: 'Heart',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce / Retail',
    description: 'Online stores, retail businesses',
    headlines: [
      'Shop the Best, Skip the Rest.',
      'Quality Products, Fair Prices.',
      'Discover Something Special.',
    ],
    subheadlines: [
      'Curated products you\'ll love.',
      'Fast shipping, easy returns, exceptional service.',
      'Find exactly what you\'re looking for.',
    ],
    ctas: ['Shop Now', 'Browse Collection', 'Get Your Discount'],
    trustMarkers: ['Happy Customers', 'Products Sold', 'Fast Shipping', 'Easy Returns'],
    mustHaveSections: ['hero', 'featured-products', 'categories', 'testimonials', 'about', 'faq', 'newsletter'],
    vocabularyTerms: ['quality', 'selection', 'value', 'exclusive', 'curated', 'discover'],
    layoutTendency: 'creative',
    colorTendency: 'bold',
    icon: 'ShoppingBag',
  },
  {
    id: 'agency',
    name: 'Agency / Studio',
    description: 'Marketing agencies, digital studios',
    headlines: [
      'Results That Speak for Themselves.',
      'Your Growth Partner.',
      'Strategy. Creativity. Results.',
    ],
    subheadlines: [
      'Data-driven strategies that deliver real ROI.',
      'A full-service team dedicated to your success.',
      'From concept to execution, we\'ve got you covered.',
    ],
    ctas: ['Start Your Project', 'Get a Proposal', 'Let\'s Talk Growth'],
    trustMarkers: ['Clients Served', 'Revenue Generated', 'Awards Won', 'Case Studies'],
    mustHaveSections: ['hero', 'services', 'case-studies', 'team', 'testimonials', 'about', 'contact'],
    vocabularyTerms: ['strategy', 'growth', 'results', 'creative', 'partnership', 'performance'],
    layoutTendency: 'corporate',
    colorTendency: 'neutral',
    icon: 'Rocket',
  },
  {
    id: 'realestate',
    name: 'Real Estate',
    description: 'Real estate agents, brokers, property management',
    headlines: [
      'Find Your Dream Home.',
      'Your Trusted Property Partner.',
      'Where Home Meets Heart.',
    ],
    subheadlines: [
      'Expert guidance through every step of your property journey.',
      'Local market expertise delivering exceptional results.',
      'Making home buying and selling seamless and stress-free.',
    ],
    ctas: ['View Listings', 'Schedule a Showing', 'Get a Free Valuation'],
    trustMarkers: ['Properties Sold', 'Years Experience', 'Happy Families', 'Market Value Delivered'],
    mustHaveSections: ['hero', 'featured-listings', 'services', 'areas-served', 'testimonials', 'about', 'contact'],
    vocabularyTerms: ['property', 'home', 'investment', 'market', 'value', 'community'],
    layoutTendency: 'corporate',
    colorTendency: 'neutral',
    icon: 'Home',
  },
  {
    id: 'legal',
    name: 'Legal Services',
    description: 'Law firms, attorneys, legal consultants',
    headlines: [
      'Justice. Integrity. Results.',
      'Your Legal Advocate.',
      'Protecting What Matters Most.',
    ],
    subheadlines: [
      'Experienced attorneys fighting for your rights.',
      'Trusted legal counsel for individuals and businesses.',
      'Compassionate representation when you need it most.',
    ],
    ctas: ['Free Consultation', 'Contact Our Firm', 'Review Your Case'],
    trustMarkers: ['Cases Won', 'Years of Practice', 'Client Satisfaction', 'Bar Certifications'],
    mustHaveSections: ['hero', 'practice-areas', 'attorneys', 'case-results', 'testimonials', 'about', 'contact'],
    vocabularyTerms: ['justice', 'advocacy', 'rights', 'representation', 'counsel', 'experience'],
    layoutTendency: 'corporate',
    colorTendency: 'cool',
    icon: 'Scale',
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Schools, tutoring services, online courses',
    headlines: [
      'Unlock Your Potential.',
      'Education That Inspires.',
      'Learn. Grow. Succeed.',
    ],
    subheadlines: [
      'Expert instruction tailored to your learning style.',
      'Building knowledge and confidence for a brighter future.',
      'Where curiosity meets opportunity.',
    ],
    ctas: ['Enroll Now', 'View Courses', 'Start Your Journey'],
    trustMarkers: ['Students Taught', 'Success Rate', 'Qualified Instructors', 'Programs Offered'],
    mustHaveSections: ['hero', 'programs', 'courses', 'instructors', 'testimonials', 'about', 'enrollment', 'contact'],
    vocabularyTerms: ['learning', 'growth', 'knowledge', 'skills', 'success', 'future'],
    layoutTendency: 'corporate',
    colorTendency: 'cool',
    icon: 'GraduationCap',
  },
  {
    id: 'fitness',
    name: 'Fitness / Gym',
    description: 'Gyms, personal trainers, fitness studios',
    headlines: [
      'Transform Your Body, Transform Your Life.',
      'Stronger Every Day.',
      'Your Fitness Journey Starts Here.',
    ],
    subheadlines: [
      'Expert trainers committed to your goals.',
      'State-of-the-art facilities and personalized programs.',
      'Join a community that motivates and inspires.',
    ],
    ctas: ['Start Free Trial', 'Join Now', 'Book a Session'],
    trustMarkers: ['Members Transformed', 'Expert Trainers', 'Classes Weekly', '5-Star Reviews'],
    mustHaveSections: ['hero', 'programs', 'classes', 'trainers', 'facilities', 'testimonials', 'pricing', 'contact'],
    vocabularyTerms: ['strength', 'transformation', 'health', 'energy', 'community', 'results'],
    layoutTendency: 'creative',
    colorTendency: 'bold',
    icon: 'Dumbbell',
  },
  {
    id: 'hospitality',
    name: 'Hospitality / Hotels',
    description: 'Hotels, B&Bs, resorts, vacation rentals',
    headlines: [
      'Your Home Away From Home.',
      'Experience Unforgettable Stays.',
      'Where Comfort Meets Adventure.',
    ],
    subheadlines: [
      'Exceptional hospitality in the heart of the city.',
      'Creating memories that last a lifetime.',
      'Relax, unwind, and let us take care of you.',
    ],
    ctas: ['Book Your Stay', 'Check Availability', 'View Rooms'],
    trustMarkers: ['Guest Reviews', 'TripAdvisor Rating', 'Years Hosting', 'Return Guests'],
    mustHaveSections: ['hero', 'rooms', 'amenities', 'gallery', 'testimonials', 'location', 'booking', 'contact'],
    vocabularyTerms: ['comfort', 'hospitality', 'experience', 'luxury', 'relaxation', 'getaway'],
    layoutTendency: 'premium',
    colorTendency: 'warm',
    icon: 'Hotel',
  },
  {
    id: 'nonprofit',
    name: 'Non-Profit / Charity',
    description: 'Charities, NGOs, foundations, community organizations',
    headlines: [
      'Making a Difference, Together.',
      'Join the Movement for Change.',
      'Every Action Creates Impact.',
    ],
    subheadlines: [
      'Your support changes lives in our community.',
      'Transparent, accountable, and mission-driven.',
      'Together, we can create lasting change.',
    ],
    ctas: ['Donate Now', 'Get Involved', 'Learn Our Mission'],
    trustMarkers: ['Lives Impacted', 'Funds Raised', 'Volunteers', 'Programs Running'],
    mustHaveSections: ['hero', 'mission', 'impact', 'programs', 'team', 'testimonials', 'donate', 'volunteer', 'contact'],
    vocabularyTerms: ['impact', 'community', 'change', 'support', 'mission', 'together'],
    layoutTendency: 'creative',
    colorTendency: 'warm',
    icon: 'Heart',
  },
  {
    id: 'technology',
    name: 'Technology / SaaS',
    description: 'Software companies, tech startups, SaaS products',
    headlines: [
      'The Future of Work, Today.',
      'Simplify. Automate. Scale.',
      'Technology That Works for You.',
    ],
    subheadlines: [
      'Powerful tools built for modern teams.',
      'Streamline your workflow with intelligent automation.',
      'Join thousands of companies transforming their operations.',
    ],
    ctas: ['Start Free Trial', 'Request Demo', 'See Pricing'],
    trustMarkers: ['Active Users', 'Uptime', 'Integrations', 'Enterprise Customers'],
    mustHaveSections: ['hero', 'features', 'integrations', 'pricing', 'testimonials', 'security', 'faq', 'contact'],
    vocabularyTerms: ['innovation', 'automation', 'scale', 'efficiency', 'integration', 'platform'],
    layoutTendency: 'corporate',
    colorTendency: 'cool',
    icon: 'Laptop',
  },
  {
    id: 'photography',
    name: 'Photography',
    description: 'Photographers, videographers, visual storytellers',
    headlines: [
      'Capturing Moments That Matter.',
      'Your Story, Beautifully Told.',
      'Art Through the Lens.',
    ],
    subheadlines: [
      'Professional photography that captures your essence.',
      'Timeless images you\'ll cherish forever.',
      'Creating visual stories with passion and expertise.',
    ],
    ctas: ['View Portfolio', 'Book a Session', 'Get a Quote'],
    trustMarkers: ['Sessions Completed', 'Happy Clients', 'Years Experience', 'Awards Won'],
    mustHaveSections: ['hero', 'portfolio', 'services', 'packages', 'about', 'testimonials', 'booking', 'contact'],
    vocabularyTerms: ['capture', 'moments', 'storytelling', 'artistic', 'timeless', 'memories'],
    layoutTendency: 'creative',
    colorTendency: 'neutral',
    icon: 'Camera',
  },
  {
    id: 'petservices',
    name: 'Pet Services',
    description: 'Pet grooming, boarding, veterinary, pet stores',
    headlines: [
      'Because Your Pet Deserves the Best.',
      'Happy Pets, Happy Families.',
      'Where Tails Wag and Purrs Abound.',
    ],
    subheadlines: [
      'Professional pet care with love and expertise.',
      'Trusted by pet parents throughout the community.',
      'Your fur baby is in the best hands.',
    ],
    ctas: ['Book Appointment', 'Meet Our Team', 'View Services'],
    trustMarkers: ['Pets Cared For', 'Years Experience', '5-Star Reviews', 'Certified Staff'],
    mustHaveSections: ['hero', 'services', 'team', 'gallery', 'testimonials', 'pricing', 'booking', 'contact'],
    vocabularyTerms: ['care', 'love', 'pets', 'family', 'trusted', 'professional'],
    layoutTendency: 'creative',
    colorTendency: 'warm',
    icon: 'PawPrint',
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Auto repair, dealerships, detailing, car services',
    headlines: [
      'Keeping You on the Road.',
      'Expert Auto Care You Can Trust.',
      'Your Vehicle Deserves the Best.',
    ],
    subheadlines: [
      'Factory-trained technicians using quality parts.',
      'Honest service at fair prices since day one.',
      'From routine maintenance to complex repairs.',
    ],
    ctas: ['Schedule Service', 'Get a Quote', 'View Inventory'],
    trustMarkers: ['Vehicles Serviced', 'Years in Business', 'Certified Technicians', 'Warranty on Work'],
    mustHaveSections: ['hero', 'services', 'inventory', 'specials', 'testimonials', 'about', 'contact'],
    vocabularyTerms: ['reliable', 'expert', 'quality', 'certified', 'service', 'trust'],
    layoutTendency: 'local',
    colorTendency: 'cool',
    icon: 'Car',
  },
  {
    id: 'construction',
    name: 'Construction / Building',
    description: 'General contractors, builders, renovation specialists',
    headlines: [
      'Building Dreams, One Project at a Time.',
      'Quality Construction, Lasting Results.',
      'From Vision to Reality.',
    ],
    subheadlines: [
      'Expert craftsmanship and attention to detail.',
      'On time, on budget, built to last.',
      'Trusted builders serving the community for decades.',
    ],
    ctas: ['Get Free Estimate', 'View Our Projects', 'Start Your Build'],
    trustMarkers: ['Projects Completed', 'Years Experience', 'Licensed & Bonded', 'Client Satisfaction'],
    mustHaveSections: ['hero', 'services', 'projects', 'process', 'testimonials', 'about', 'contact'],
    vocabularyTerms: ['quality', 'craftsmanship', 'build', 'reliable', 'expertise', 'vision'],
    layoutTendency: 'local',
    colorTendency: 'neutral',
    icon: 'HardHat',
  },
  {
    id: 'financial',
    name: 'Financial Services',
    description: 'Accountants, financial advisors, insurance, banking',
    headlines: [
      'Securing Your Financial Future.',
      'Smart Money, Smarter Decisions.',
      'Your Wealth, Our Expertise.',
    ],
    subheadlines: [
      'Personalized financial strategies for every stage of life.',
      'Trusted advisors helping you grow and protect your assets.',
      'Clear guidance through complex financial decisions.',
    ],
    ctas: ['Schedule Consultation', 'Review Your Plan', 'Get Started'],
    trustMarkers: ['Assets Managed', 'Years Experience', 'Client Retention', 'Certified Advisors'],
    mustHaveSections: ['hero', 'services', 'approach', 'team', 'testimonials', 'resources', 'contact'],
    vocabularyTerms: ['wealth', 'security', 'planning', 'growth', 'trust', 'expertise'],
    layoutTendency: 'corporate',
    colorTendency: 'cool',
    icon: 'LineChart',
  },
  {
    id: 'events',
    name: 'Event Planning',
    description: 'Wedding planners, event coordinators, party services',
    headlines: [
      'Creating Unforgettable Moments.',
      'Your Perfect Event, Our Passion.',
      'Dream Events, Flawlessly Executed.',
    ],
    subheadlines: [
      'Full-service event planning tailored to your vision.',
      'From intimate gatherings to grand celebrations.',
      'Let us handle the details while you enjoy the moment.',
    ],
    ctas: ['Start Planning', 'View Portfolio', 'Get a Quote'],
    trustMarkers: ['Events Planned', 'Happy Couples', 'Years Experience', 'Vendor Partners'],
    mustHaveSections: ['hero', 'services', 'portfolio', 'packages', 'testimonials', 'process', 'contact'],
    vocabularyTerms: ['celebration', 'memorable', 'elegant', 'seamless', 'vision', 'perfect'],
    layoutTendency: 'creative',
    colorTendency: 'warm',
    icon: 'PartyPopper',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing / Industrial',
    description: 'Manufacturers, industrial services, B2B suppliers',
    headlines: [
      'Precision. Quality. Delivered.',
      'Engineering Excellence Since Day One.',
      'Your Production Partner.',
    ],
    subheadlines: [
      'Advanced manufacturing capabilities for demanding industries.',
      'ISO certified processes ensuring consistent quality.',
      'From prototype to production, we deliver.',
    ],
    ctas: ['Request Quote', 'View Capabilities', 'Contact Sales'],
    trustMarkers: ['Parts Produced', 'ISO Certified', 'Industries Served', 'On-Time Delivery'],
    mustHaveSections: ['hero', 'capabilities', 'industries', 'quality', 'certifications', 'case-studies', 'contact'],
    vocabularyTerms: ['precision', 'quality', 'engineering', 'production', 'reliable', 'certified'],
    layoutTendency: 'corporate',
    colorTendency: 'neutral',
    icon: 'Factory',
  },
  {
    id: 'foodbeverage',
    name: 'Food & Beverage',
    description: 'Breweries, bakeries, food producers, specialty foods',
    headlines: [
      'Crafted with Passion, Savored with Joy.',
      'Taste the Difference Quality Makes.',
      'From Our Kitchen to Your Table.',
    ],
    subheadlines: [
      'Small-batch creations made with premium ingredients.',
      'Artisanal products crafted with care and tradition.',
      'Every bite tells our story.',
    ],
    ctas: ['Shop Now', 'Find Near You', 'Order Online'],
    trustMarkers: ['Products Sold', 'Local Ingredients', 'Awards Won', 'Happy Customers'],
    mustHaveSections: ['hero', 'products', 'story', 'process', 'locations', 'testimonials', 'shop', 'contact'],
    vocabularyTerms: ['artisanal', 'crafted', 'quality', 'fresh', 'passion', 'tradition'],
    layoutTendency: 'creative',
    colorTendency: 'warm',
    icon: 'Cookie',
  },
  {
    id: 'beautycosmetics',
    name: 'Beauty & Cosmetics',
    description: 'Beauty brands, skincare, cosmetics companies',
    headlines: [
      'Beauty That Empowers.',
      'Reveal Your Natural Radiance.',
      'Clean Beauty, Real Results.',
    ],
    subheadlines: [
      'Science-backed formulas for visible results.',
      'Cruelty-free products that deliver.',
      'Your skin deserves better.',
    ],
    ctas: ['Shop Collection', 'Take Skin Quiz', 'Find Your Shade'],
    trustMarkers: ['Products Sold', 'Customer Reviews', 'Clean Ingredients', 'Cruelty-Free'],
    mustHaveSections: ['hero', 'products', 'ingredients', 'results', 'testimonials', 'about', 'shop'],
    vocabularyTerms: ['beauty', 'radiance', 'clean', 'natural', 'results', 'glow'],
    layoutTendency: 'premium',
    colorTendency: 'muted',
    icon: 'Sparkles',
  },
  {
    id: 'homeservices',
    name: 'Home Services',
    description: 'Cleaning, landscaping, home maintenance, security',
    headlines: [
      'Your Home, Our Priority.',
      'Professional Care for Your Castle.',
      'Making Homes Shine.',
    ],
    subheadlines: [
      'Reliable service you can count on every time.',
      'Background-checked professionals you can trust.',
      'Reclaim your time with our expert team.',
    ],
    ctas: ['Get Free Quote', 'Book Service', 'See Our Work'],
    trustMarkers: ['Homes Served', 'Years Experience', 'Satisfaction Guaranteed', 'Licensed & Insured'],
    mustHaveSections: ['hero', 'services', 'areas', 'pricing', 'testimonials', 'about', 'booking', 'contact'],
    vocabularyTerms: ['reliable', 'professional', 'trusted', 'quality', 'care', 'home'],
    layoutTendency: 'local',
    colorTendency: 'cool',
    icon: 'Home',
  },
  {
    id: 'sports',
    name: 'Sports & Recreation',
    description: 'Sports facilities, recreation centers, athletic clubs',
    headlines: [
      'Play Hard, Live Well.',
      'Where Champions Are Made.',
      'Your Athletic Journey Starts Here.',
    ],
    subheadlines: [
      'World-class facilities for athletes of all levels.',
      'Programs designed to help you reach your peak.',
      'Join a community that celebrates achievement.',
    ],
    ctas: ['Join Now', 'View Programs', 'Book a Court'],
    trustMarkers: ['Members', 'Programs Offered', 'Facilities', 'Champions Trained'],
    mustHaveSections: ['hero', 'programs', 'facilities', 'membership', 'events', 'testimonials', 'contact'],
    vocabularyTerms: ['athletic', 'performance', 'community', 'excellence', 'training', 'achievement'],
    layoutTendency: 'creative',
    colorTendency: 'bold',
    icon: 'Trophy',
  },
  {
    id: 'travel',
    name: 'Travel & Tourism',
    description: 'Travel agencies, tour operators, tourism boards',
    headlines: [
      'Adventures Await.',
      'Discover Your Next Journey.',
      'Travel Beyond Boundaries.',
    ],
    subheadlines: [
      'Curated experiences that create lasting memories.',
      'Expert travel planning for unforgettable adventures.',
      'Your dream destination is closer than you think.',
    ],
    ctas: ['Explore Trips', 'Plan Your Journey', 'Get Inspired'],
    trustMarkers: ['Travelers Served', 'Destinations', 'Years Experience', 'TripAdvisor Rating'],
    mustHaveSections: ['hero', 'destinations', 'packages', 'experiences', 'testimonials', 'about', 'booking', 'contact'],
    vocabularyTerms: ['adventure', 'discover', 'explore', 'journey', 'experience', 'wanderlust'],
    layoutTendency: 'creative',
    colorTendency: 'bold',
    icon: 'Plane',
  },
  {
    id: 'entertainment',
    name: 'Entertainment / Media',
    description: 'Production companies, music, film, streaming, gaming',
    headlines: [
      'Stories That Move You.',
      'Entertainment Redefined.',
      'Creating Moments of Magic.',
    ],
    subheadlines: [
      'Award-winning content that captivates audiences.',
      'Where creativity meets cutting-edge technology.',
      'Bringing extraordinary experiences to life.',
    ],
    ctas: ['Watch Now', 'Explore Content', 'Join the Experience'],
    trustMarkers: ['Viewers', 'Awards Won', 'Productions', 'Global Reach'],
    mustHaveSections: ['hero', 'featured', 'catalog', 'about', 'news', 'subscribe', 'contact'],
    vocabularyTerms: ['entertainment', 'creative', 'storytelling', 'experience', 'content', 'innovative'],
    layoutTendency: 'creative',
    colorTendency: 'bold',
    icon: 'Film',
  },
  {
    id: 'other',
    name: 'Other / General',
    description: 'Any other business type',
    headlines: [
      'Welcome to Our World.',
      'Excellence in Everything We Do.',
      'Your Success is Our Mission.',
    ],
    subheadlines: [
      'Dedicated to providing the best service possible.',
      'Quality and reliability you can count on.',
      'Let us help you achieve your goals.',
    ],
    ctas: ['Get Started', 'Learn More', 'Contact Us'],
    trustMarkers: ['Years in Business', 'Happy Clients', 'Quality Guaranteed', 'Trusted Service'],
    mustHaveSections: ['hero', 'services', 'about', 'testimonials', 'contact'],
    vocabularyTerms: ['quality', 'service', 'trust', 'excellence', 'reliable', 'professional'],
    layoutTendency: 'minimal',
    colorTendency: 'neutral',
    icon: 'Building',
  },
];

/**
 * Get industry starter pack by ID
 */
export function getIndustryPackById(id: string): IndustryStarterPack | undefined {
  return INDUSTRY_STARTER_PACKS.find(pack => pack.id === id);
}

/**
 * Get industry starter pack by business type (fuzzy match)
 */
export function getIndustryPackByType(businessType: string): IndustryStarterPack {
  const normalizedType = businessType.toLowerCase();

  // Direct ID match first
  const directMatch = INDUSTRY_STARTER_PACKS.find(pack => pack.id === normalizedType);
  if (directMatch) return directMatch;

  // Prefer the specific fitness phrase over the general education keyword.
  if (normalizedType.includes('personal train')) return INDUSTRY_STARTER_PACKS.find(pack => pack.id === 'fitness')!;

  // Fuzzy matching based on keywords
  const keywordMap: Record<string, string> = {
    // Consultant
    'consult': 'consultant', 'advisor': 'consultant', 'strategy': 'consultant',
    // Salon
    'salon': 'salon', 'hair': 'salon', 'spa': 'salon', 'nail': 'salon',
    // Coach
    'coach': 'coach', 'mentor': 'coach', 'life': 'coach',
    // Restaurant
    'restaurant': 'restaurant', 'cafe': 'restaurant', 'catering': 'restaurant', 'bar': 'restaurant', 'dining': 'restaurant',
    // Tradesperson
    'plumber': 'tradesperson', 'electrician': 'tradesperson', 'handyman': 'tradesperson', 'roofing': 'tradesperson', 'hvac': 'tradesperson',
    // Designer
    'graphic': 'designer', 'web design': 'designer', 'brand': 'designer', 'ux': 'designer', 'ui': 'designer',
    // Healthcare
    'doctor': 'healthcare', 'medical': 'healthcare', 'therapy': 'healthcare', 'dental': 'healthcare', 'physio': 'healthcare', 'clinic': 'healthcare',
    // E-commerce
    'ecommerce': 'ecommerce', 'online store': 'ecommerce', 'retail': 'ecommerce', 'products': 'ecommerce',
    // Agency
    'agency': 'agency', 'marketing': 'agency', 'digital agency': 'agency', 'advertising': 'agency',
    // Real Estate
    'real estate': 'realestate', 'property': 'realestate', 'realtor': 'realestate', 'broker': 'realestate', 'housing': 'realestate',
    // Legal
    'legal': 'legal', 'law': 'legal', 'attorney': 'legal', 'lawyer': 'legal', 'solicitor': 'legal',
    // Education
    'education': 'education', 'school': 'education', 'tutor': 'education', 'course': 'education', 'training': 'education', 'teaching': 'education',
    // Fitness
    'fitness': 'fitness', 'gym': 'fitness', 'workout': 'fitness', 'exercise': 'fitness', 'personal training': 'fitness',
    // Hospitality
    'hotel': 'hospitality', 'b&b': 'hospitality', 'resort': 'hospitality', 'accommodation': 'hospitality', 'inn': 'hospitality', 'lodge': 'hospitality',
    // Non-Profit
    'nonprofit': 'nonprofit', 'non-profit': 'nonprofit', 'charity': 'nonprofit', 'foundation': 'nonprofit', 'ngo': 'nonprofit', 'organization': 'nonprofit',
    // Technology
    'tech': 'technology', 'software': 'technology', 'saas': 'technology', 'app': 'technology', 'startup': 'technology', 'it': 'technology',
    // Photography
    'photo': 'photography', 'photographer': 'photography', 'videograph': 'photography', 'portrait': 'photography', 'wedding photo': 'photography',
    // Pet Services
    'pet': 'petservices', 'dog': 'petservices', 'cat': 'petservices', 'grooming': 'petservices', 'veterinary': 'petservices', 'vet': 'petservices',
    // Automotive
    'auto': 'automotive', 'car': 'automotive', 'vehicle': 'automotive', 'mechanic': 'automotive', 'dealership': 'automotive', 'detailing': 'automotive',
    // Construction
    'construction': 'construction', 'builder': 'construction', 'contractor': 'construction', 'renovation': 'construction', 'remodel': 'construction',
    // Financial
    'finance': 'financial', 'financial': 'financial', 'accountant': 'financial', 'accounting': 'financial', 'insurance': 'financial', 'investment': 'financial', 'banking': 'financial',
    // Events
    'event': 'events', 'wedding': 'events', 'party': 'events', 'planner': 'events', 'coordination': 'events', 'celebration': 'events',
    // Manufacturing
    'manufacturing': 'manufacturing', 'factory': 'manufacturing', 'industrial': 'manufacturing', 'production': 'manufacturing', 'supplier': 'manufacturing',
    // Food & Beverage
    'brewery': 'foodbeverage', 'bakery': 'foodbeverage', 'food producer': 'foodbeverage', 'winery': 'foodbeverage', 'distillery': 'foodbeverage',
    // Beauty & Cosmetics
    'cosmetic': 'beautycosmetics', 'skincare': 'beautycosmetics', 'makeup': 'beautycosmetics', 'beauty brand': 'beautycosmetics',
    // Home Services
    'cleaning': 'homeservices', 'landscaping': 'homeservices', 'lawn': 'homeservices', 'home maintenance': 'homeservices', 'security': 'homeservices', 'pest': 'homeservices',
    // Sports & Recreation
    'sports': 'sports', 'athletic': 'sports', 'recreation': 'sports', 'club': 'sports', 'league': 'sports',
    // Travel & Tourism
    'travel': 'travel', 'tourism': 'travel', 'tour': 'travel', 'vacation': 'travel', 'adventure': 'travel',
    // Entertainment
    'entertainment': 'entertainment', 'media': 'entertainment', 'film': 'entertainment', 'music': 'entertainment', 'gaming': 'entertainment', 'streaming': 'entertainment',
  };

  for (const [keyword, packId] of Object.entries(keywordMap)) {
    if (normalizedType.includes(keyword)) {
      const pack = INDUSTRY_STARTER_PACKS.find(p => p.id === packId);
      if (pack) return pack;
    }
  }

  // Default to 'other' if no match
  return INDUSTRY_STARTER_PACKS.find(pack => pack.id === 'other')!;
}

/**
 * Get all industry starter packs
 */
export function getAllIndustryPacks(): IndustryStarterPack[] {
  return INDUSTRY_STARTER_PACKS;
}
