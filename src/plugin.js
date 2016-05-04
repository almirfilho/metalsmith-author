const _ = require('lodash');


const defaults = {
  authors: {},
  metadataFrom: 'authors'
};


module.exports = options => {
  options = options || {};
  if(!options.collection) throw new Error('`collection` option is required.');

  return function(files, metalsmith, done){
    var metadata = metalsmith.metadata();

    if(!metadata.collections)
      throw new Error('there are no collections configured - see metalsmith-collections plugin.');

    if(!(options.collection in metadata.collections))
      throw new Error(`the collection '${options.collection}' does not exist.`);

    const metadataFrom = options.metadataFrom || defaults.metadataFrom;
    var authors = options.authors || get(metadata, metadataFrom) || defaults.authors;

    if(!(authors instanceof Object))
      throw new Error(`the 'authors' option must be an object.`);

    metadata.collections[options.collection].forEach(file => {
      if(file.author in authors) file.author = authors[file.author];
    });

    if(!metadata.authors) metadata.authors = authors;
    done();
  };
};

// returns value at path from obj, or undefined
const get = (obj, path) => _.head(_.at(obj, path));
