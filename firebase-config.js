/**
 * Caprecon Firebase Configuration
 * Firebase Backend Integration
 */

// Your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDCHsgCYceUBZjOWxIyoWph6DhL2iRUa6A",
    authDomain: "caprecon.firebaseapp.com",
    projectId: "caprecon",
    storageBucket: "caprecon.firebasestorage.app",
    messagingSenderId: "563583204772",
    appId: "1:563583204772:web:412b3f953406ce618ed531",
    measurementId: "G-RV31X7WRMR"
};

// Initialize Firebase when the script loads
let db = null;
let auth = null;
let storage = null;
let analytics = null;

// Check if Firebase is available and initialize
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();
        storage = firebase.storage();
        
        // Initialize Analytics if available
        if (firebase.analytics) {
            analytics = firebase.analytics();
        }
        
        console.log('Firebase initialized successfully!');
    } else {
        console.log('Firebase SDK not loaded - running in demo mode');
    }
} catch (error) {
    console.log('Firebase initialization error:', error);
}

/**
 * Caprecon Backend Service
 * Handles all data operations with Firebase
 */
const CapreconBackend = {
    
    // ============== BLOG POSTS ==============
    
    /**
     * Get all blog posts
     * @param {number} limit - Number of posts to retrieve
     * @returns {Promise<Array>} Array of blog posts
     */
    async getBlogPosts(limit = 10) {
        try {
            if (!db) return this.getDemoBlogPosts();
            
            const snapshot = await db.collection('blogPosts')
                .orderBy('date', 'desc')
                .limit(limit)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting blog posts:', error);
            return this.getDemoBlogPosts();
        }
    },
    
    /**
     * Get a single blog post by ID
     * @param {string} postId - Blog post ID
     * @returns {Promise<Object>} Blog post object
     */
    async getBlogPost(postId) {
        try {
            if (!db) return this.getDemoBlogPost(postId);
            
            const doc = await db.collection('blogPosts').doc(postId).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting blog post:', error);
            return this.getDemoBlogPost(postId);
        }
    },
    
    /**
     * Add a new blog post (admin only)
     * @param {Object} post - Blog post data
     * @returns {Promise<string>} Post ID
     */
    async addBlogPost(post) {
        try {
            if (!db) throw new Error('Firebase not initialized');
            
            const docRef = await db.collection('blogPosts').add({
                ...post,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Blog post added with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error adding blog post:', error);
            throw error;
        }
    },
    
    // ============== EVENTS ==============
    
    /**
     * Get all events
     * @param {string} type - 'upcoming' or 'past'
     * @returns {Promise<Array>} Array of events
     */
    async getEvents(type = 'upcoming') {
        try {
            if (!db) return this.getDemoEvents(type);
            
            const now = new Date().toISOString();
            const query = type === 'upcoming' 
                ? db.collection('events').where('date', '>=', now).orderBy('date', 'asc')
                : db.collection('events').where('date', '<', now).orderBy('date', 'desc');
            
            const snapshot = await query.limit(10).get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting events:', error);
            return this.getDemoEvents(type);
        }
    },
    
    /**
     * Register for an event
     * @param {string} eventId - Event ID
     * @param {Object} registration - Registration data
     * @returns {Promise<boolean>} Success status
     */
    async registerForEvent(eventId, registration) {
        try {
            if (!db) {
                console.log('Demo mode: Event registration', { eventId, registration });
                return true;
            }
            
            await db.collection('events').doc(eventId).collection('registrations').add({
                ...registration,
                registeredAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Error registering for event:', error);
            return false;
        }
    },
    
    // ============== NEWS ==============
    
    /**
     * Get all news articles
     * @param {string} category - News category filter
     * @returns {Promise<Array>} Array of news articles
     */
    async getNews(category = 'all') {
        try {
            if (!db) return this.getDemoNews(category);
            
            let query = db.collection('news').orderBy('date', 'desc').limit(10);
            if (category !== 'all') {
                query = query.where('category', '==', category);
            }
            
            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting news:', error);
            return this.getDemoNews(category);
        }
    },
    
    // ============== VOLUNTEERS ==============
    
    /**
     * Submit volunteer application
     * @param {Object} application - Volunteer application data
     * @returns {Promise<boolean>} Success status
     */
    async submitVolunteerApplication(application) {
        try {
            if (!db) {
                console.log('Demo mode: Volunteer application', application);
                await new Promise(resolve => setTimeout(resolve, 1500));
                return true;
            }
            
            await db.collection('volunteerApplications').add({
                ...application,
                status: 'pending',
                submittedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Volunteer application submitted successfully');
            return true;
        } catch (error) {
            console.error('Error submitting volunteer application:', error);
            return false;
        }
    },
    
    // ============== DONATIONS ==============
    
    /**
     * Record a donation
     * @param {Object} donation - Donation data
     * @returns {Promise<boolean>} Success status
     */
    async recordDonation(donation) {
        try {
            if (!db) {
                console.log('Demo mode: Donation recorded', donation);
                return true;
            }
            
            await db.collection('donations').add({
                ...donation,
                status: 'pending',
                donatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Donation recorded successfully');
            return true;
        } catch (error) {
            console.error('Error recording donation:', error);
            return false;
        }
    },
    
    /**
     * Get donation statistics
     * @returns {Promise<Object>} Donation stats
     */
    async getDonationStats() {
        try {
            if (!db) return this.getDemoDonationStats();
            
            const snapshot = await db.collection('donations').get();
            const donations = snapshot.docs.map(doc => doc.data());
            
            const total = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
            const count = donations.length;
            
            return { total, count };
        } catch (error) {
            console.error('Error getting donation stats:', error);
            return this.getDemoDonationStats();
        }
    },
    
    // ============== NEWSLETTER ==============
    
    /**
     * Subscribe to newsletter
     * @param {string} email - Subscriber email
     * @returns {Promise<boolean>} Success status
     */
    async subscribeNewsletter(email) {
        try {
            if (!db) {
                console.log('Demo mode: Newsletter subscription', email);
                return true;
            }
            
            // Check if email already exists
            const existing = await db.collection('newsletterSubscribers')
                .where('email', '==', email)
                .get();
            
            if (!existing.empty) {
                console.log('Email already subscribed');
                return true;
            }
            
            await db.collection('newsletterSubscribers').add({
                email,
                subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
                active: true
            });
            console.log('Newsletter subscription successful');
            return true;
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            return false;
        }
    },
    
    // ============== GALLERY ==============
    
    /**
     * Get gallery images
     * @param {string} category - Gallery category
     * @returns {Promise<Array>} Array of gallery images
     */
    async getGalleryImages(category = 'all') {
        try {
            if (!db) return this.getDemoGalleryImages();
            
            let query = db.collection('gallery').orderBy('uploadedAt', 'desc');
            if (category !== 'all') {
                query = query.where('category', '==', category);
            }
            
            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting gallery images:', error);
            return this.getDemoGalleryImages();
        }
    },
    
    /**
     * Upload gallery image
     * @param {File} file - Image file
     * @param {Object} metadata - Image metadata
     * @returns {Promise<string>} Image URL
     */
    async uploadGalleryImage(file, metadata) {
        try {
            if (!storage || !db) throw new Error('Firebase not initialized');
            
            // Upload to Storage
            const storageRef = storage.ref(`gallery/${Date.now()}_${file.name}`);
            await storageRef.put(file);
            const url = await storageRef.getDownloadURL();
            
            // Save metadata to Firestore
            await db.collection('gallery').add({
                ...metadata,
                url,
                uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    },
    
    // ============== CONTACT MESSAGES ==============
    
    /**
     * Submit contact message
     * @param {Object} message - Contact message data
     * @returns {Promise<boolean>} Success status
     */
    async submitContactMessage(message) {
        try {
            if (!db) {
                console.log('Demo mode: Contact message', message);
                return true;
            }
            
            await db.collection('contactMessages').add({
                ...message,
                status: 'unread',
                submittedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Contact message submitted successfully');
            return true;
        } catch (error) {
            console.error('Error submitting contact message:', error);
            return false;
        }
    },
    
    // ============== DEMO DATA (Fallback when Firebase is not available) ==============
    
    getDemoBlogPosts() {
        return [
            {
                id: '1',
                title: 'Empowering Communities Through Education: Our 2026 Vision',
                excerpt: 'As we step into 2026, Caprecon International Development Foundation remains committed to our mission...',
                content: 'Full content here...',
                image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
                category: 'Featured',
                date: '2026-03-01',
                author: 'Caprecon Team',
                readTime: '5 min read'
            },
            {
                id: '2',
                title: 'Breaking Barriers: Girls\' Education in Rural Africa',
                excerpt: 'Discover how our education programs are helping young girls overcome cultural barriers...',
                content: 'Full content here...',
                image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
                category: 'Education',
                date: '2026-02-25',
                author: 'Sarah Johnson',
                readTime: '7 min read'
            },
            {
                id: '3',
                title: 'Reconciliation in Conflict Zones: Success Stories',
                excerpt: 'Learn about our peace-building initiatives and how communities are healing...',
                content: 'Full content here...',
                image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
                category: 'Peace Building',
                date: '2026-02-18',
                author: 'Michael Osei',
                readTime: '6 min read'
            }
        ];
    },
    
    getDemoBlogPost(postId) {
        const posts = this.getDemoBlogPosts();
        return posts.find(p => p.id === postId) || posts[0];
    },
    
    getDemoEvents(type) {
        const events = [
            {
                id: '1',
                title: 'Annual Charity Gala 2026',
                description: 'Join us for our annual charity gala to raise funds for education programs.',
                date: '2026-03-15',
                time: '6:00 PM - 10:00 PM',
                location: 'Luton, UK',
                type: 'Fundraiser',
                image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80'
            },
            {
                id: '2',
                title: 'Community Leadership Workshop',
                description: 'A one-day workshop focused on developing leadership skills.',
                date: '2026-03-22',
                time: '9:00 AM - 4:00 PM',
                location: 'Jos, Nigeria',
                type: 'Workshop',
                image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80'
            }
        ];
        return type === 'upcoming' ? events : [];
    },
    
    getDemoNews(category) {
        const news = [
            {
                id: '1',
                title: 'Caprecon Reaches Milestone: 250,000 Lives Impacted',
                excerpt: 'We are thrilled to announce that Caprecon has officially impacted over 250,000 lives...',
                category: 'Programs',
                date: '2026-03-01',
                image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'
            },
            {
                id: '2',
                title: 'Strategic Partnership with UNICEF Announced',
                excerpt: 'We are excited to announce a new strategic partnership with UNICEF...',
                category: 'Partnerships',
                date: '2026-02-25',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'
            }
        ];
        return category === 'all' ? news : news.filter(n => n.category.toLowerCase() === category);
    },
    
    getDemoGalleryImages() {
        return [
            { id: '1', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80', caption: 'Community work' },
            { id: '2', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', caption: 'Education' },
            { id: '3', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80', caption: 'Volunteers' }
        ];
    },
    
    getDemoDonationStats() {
        return { total: 125000, count: 450 };
    }
};

// Make it globally available
window.CapreconBackend = CapreconBackend;
