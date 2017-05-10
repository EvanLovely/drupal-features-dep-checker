#!/usr/bin/env node
'use strict';
const yaml = require('js-yaml');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const modulePath = path.join(process.cwd(), process.argv[2]);

const files = glob.sync(path.join(modulePath, '**/install/*.yml'));
const configFileNames = files.map(file => path.basename(file));

// console.log(files);
const deps = {};
files.forEach((file) => {
	try {
	  const doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
	  if (doc.dependencies && doc.dependencies.config && doc.dependencies.config.length > 0) {
	  	doc.dependencies.config.forEach(x => deps[x] = true);
	  }
	} catch (e) {
	  console.log(e);
	}
});

Object.keys(deps).forEach((dep) => {
	const filename = dep + '.yml';
	if (configFileNames.some(x => x === filename)) {
		// console.log('yep', filename);
	} else {
		console.log('Missing:', filename);
	}
});
// console.log(deps);

console.log('Done Checking Configs for Dependencies');
