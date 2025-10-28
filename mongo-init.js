db.createUser({
  user: "admin",
  pwd: "password123",
  roles: [
    {
      role: "readWrite",
      db: "portfolio3d"
    }
  ]
});

db = db.getSiblingDB('portfolio3d');

// Create collections and initial data if needed
db.createCollection('users');
db.createCollection('blogs');
db.createCollection('projects');
db.createCollection('courses');
db.createCollection('contacts');

print('✅ MongoDB initialized successfully');