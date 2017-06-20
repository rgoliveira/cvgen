#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const merge = require('merge');
const mustache = require('mustache');
const yaml = require('js-yaml');
const entities = require('html-entities').XmlEntities;

const CVBuilder = {
  build (templateFilename, outputFilename, ...yamlFilenames) {
    // parse data from the yaml files
    const jsonArr = yamlFilenames[0]
      .map((x) => yaml.load(fs.readFileSync(x)));
    // merge into one object
    const mergedJson = jsonArr
      .reduce((prev, curr) => merge(prev, curr), {});
    // parse the template
    const template = fs.readFileSync(templateFilename).toString();
    mustache.parse(template);

    // generate cv = render the data into the template through mustache
    const output = mustache.render(template, mergedJson);

    // js-yaml escapes some chars, so we gotta decode it here.
    // todo(rgo): is there a way to avoid this?
    const unescapedOutput = entities.decode(output);

    // write output file
    try {
      fs.writeFileSync(outputFilename, unescapedOutput);
      return unescapedOutput;
    } catch (e) {
      console.error('Error writing output file', e);
      return false;
    }
  }
}

module.exports = CVBuilder.build;

if (require.main === module) {
  const argv = process.argv;
  if (argv.length < 4) {
    relPath = path.relative(__dirname, __filename);
    console.error(`Usage: ${relPath} <template> <output> <yaml> [<yaml> ...]`);
  } else {
    CVBuilder.build(argv[2], argv[3], argv.slice(4));
  }
}
