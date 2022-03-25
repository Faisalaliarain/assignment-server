const _ = require('lodash');



const objectToCamelCase = module.exports.objectToCamelCase = (obj) => {
	return _.mapKeys(obj, (v, k) => _.camelCase(k));
};


module.exports.arrayOfObjectToCamelCase = (arr) => {
	return _.map(arr, (obj) => objectToCamelCase(obj));
};

module.exports.arrayOfObjectWithNestedDataObjectToCamelCase = (arr) => {
	return _.map(arr, (obj) => {
		let objCopy;
		if (obj.data) {
			objCopy = objectToCamelCase(obj);
			objCopy.data =	objectToCamelCase(obj.data);
			return objCopy;
		}

		objCopy = objectToCamelCase(obj);
		return objCopy;


	});
};

const objectToSnakeCase = module.exports.objectToSnakeCase = (obj) => {
	return _.mapKeys(obj, (v, k) => _.snakeCase(k));
};


module.exports.arrayOfObjectToSnakeCase = (arr) => {
	return _.map(arr, (obj) => objectToSnakeCase(obj));
};