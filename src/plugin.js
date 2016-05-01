const defaults = {
  authors: {}
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

    const authors = options.authors || defaults.authors;

    metadata.collections[options.collection].forEach(file => {
      if(file.author in authors) file.author = authors[file.author];
    });

    done();
  };
};
