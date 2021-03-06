'use strict';

const slugify = require('slugify');


/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  beforeSave: async model => {
    if (model.word) {
      model.slug = slugify(model.word, {
        replacement: '-',
        lower: true,
        strict: true,
        locale: 'tr',
      });
    }
  },
  beforeUpdate: async model => {
    if (model.getUpdate() && model.getUpdate().word) {
      model.update({
        slug: slugify(model.getUpdate().word, {
          replacement: '-',
          lower: true,
          strict: true,
          locale: 'tr',
        }),
      });
    }
  },
};
