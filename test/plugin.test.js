const expect = require('chai').expect;
const metalsmith = require('metalsmith');
const collections = require('metalsmith-collections');
const feed = require('../src/plugin');


describe('Initialization', () => {
  var metal;

  before(() => metal = metalsmith('test/fixtures'));

  it('should be a function', () => {
    expect(feed).to.be.a.function;
  });

  it('should return a function', () => {
    expect(feed({ collection: 'something' })).to.be.a.function;
  });

  it('should require collection name', () => {
    expect(feed).to.throw(Error);
  });

  it('should require collections to be configured', () => {
    metal._metadata = {};
    var call = feed({ collection: 'name' }).bind(null, [], metal, () => {});
    expect(call).to.throw(Error);
  });

  it('should throw error if collection doesnt exist', () => {
    metal._metadata.collections = {};
    var call = feed({ collection: 'posts' }).bind(null, [], metal, () => {});
    expect(call).to.throw(Error);
  });

  it('should not throw error if collection exist', () => {
    metal._metadata.collections = { articles: [] };
    var call = feed({ collection: 'articles' }).bind(null, [], metal, () => {});
    expect(call).not.to.throw(Error);
  });
});


describe('Generation', () => {
  var metalfeed = feedoptions => (
    metalsmith('test')
      .source('fixtures')
      .use(collections({ posts: '*.html' }))
      .use(feed(feedoptions))
  );

  it('should do nothing with files', done => {
    metalfeed({ collection: 'posts' }).build((err, files) => {
      for(var file in files){
        expect(files[file]).to.not.have.deep.property('author.name');
      }
      done();
    });
  });

  it('should set authors', done => {
    const options = {
      collection: 'posts',
      authors: {
        john: { name: 'John Lennon' },
        paul: { name: 'Paul McCartney' }
      }
    };

    metalfeed(options).build((err, files) => {
      expect(files['post1.html']).to.have.deep.property('author');
      expect(files['post1.html'].author).to.deep.equal({ name: 'John Lennon' });
      expect(files['post2.html']).to.have.deep.property('author');
      expect(files['post2.html'].author).to.deep.equal({ name: 'Paul McCartney' });
      done();
    });
  });

  it('should not set non existing author', done => {
    const options = {
      collection: 'posts',
      authors: {
        john: { name: 'John Lennon' }
      }
    };

    metalfeed(options).build((err, files) => {
      expect(files['post1.html']).to.have.deep.property('author');
      expect(files['post1.html'].author).to.deep.equal({ name: 'John Lennon' });
      expect(files['post2.html']).to.have.deep.property('author');
      expect(files['post2.html'].author).to.deep.equal('paul');
      done();
    });
  });
});
