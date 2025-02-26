const Blog = require('./blog');
const ReadingList = require('./reading_list');
const User = require('./user');
const Session = require('./session');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' });
Blog.belongsToMany(User, { through: ReadingList, as: 'onReadingList' });

User.hasOne(Session);
Session.belongsTo(User);

module.exports = { Blog, User, ReadingList, Session };
