const expect = require('chai').expect;
const metalsmith = require('metalsmith');
const collections = require('metalsmith-collections');
const author = require('../src/plugin');


describe('Initialization', () => {
  var metal;

  before(() => metal = metalsmith('test/fixtures'));

  it('should be a function', () => {
    expect(author).to.be.a.function;
  });

  it('should return a function', () => {
    expect(author({ collection: 'something' })).to.be.a.function;
  });

  it('should require collection name', () => {
    expect(author).to.throw(Error);
  });

  it('should require collections to be configured', () => {
    metal._metadata = {};
    const call = author({ collection: 'name' }).bind(null, [], metal, () => {});
    expect(call).to.throw(Error);
  });

  it('should throw error if collection doesnt exist', () => {
    metal._metadata.collections = {};
    const call = author({ collection: 'posts' }).bind(null, [], metal, () => {});
    expect(call).to.throw(Error);
  });

  it('should not throw error if collection exist', () => {
    metal._metadata.collections = { articles: [] };
    const call = author({ collection: 'articles' }).bind(null, [], metal, () => {});
    expect(call).not.to.throw(Error);
  });

  it('should throw error if authors option is not an object', () => {
    metal._metadata.collections = { posts: [] };
    const options = { collection: 'posts', authors: 'not an object' };
    const call = author(options).bind(null, [], metal, () => {});
    expect(call).to.throw(Error);
  });
});


describe('Generation', () => {
  var metalpipeline = authoroptions => (
    metalsmith('test')
      .source('fixtures')
      .use(collections({ posts: '*.html' }))
      .use(author(authoroptions))
  );

  it('should do nothing with files', done => {
    metalpipeline({ collection: 'posts' }).build((err, files) => {
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

    metalpipeline(options).build((err, files) => {
      expect(files['post1.html']).to.have.property('author').to.deep.equal({ name: 'John Lennon' });
      expect(files['post2.html']).to.have.property('author').to.deep.equal({ name: 'Paul McCartney' });
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

    metalpipeline(options).build((err, files) => {
      expect(files['post1.html']).to.have.property('author').to.deep.equal({ name: 'John Lennon' });
      expect(files['post2.html']).to.have.property('author').to.equal('paul');
      done();
    });
  });

  it('should set authors in metalsmith global metadata', done => {
    var metadata;
    const options = {
      collection: 'posts',
      authors: { john: 'John Lennon' }
    };

    metalpipeline(options).use((files, metal, metaldone) => {
      metadata = metal.metadata();
      metaldone();
    }).build((err, files) => {
      expect(metadata).to.have.property('collections');
      expect(metadata).to.have.property('authors').to.deep.equal({ john: 'John Lennon' });
      done();
    });
  });
});
