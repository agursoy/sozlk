'use strict';

const similarity = require('similarity')


/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async similar(ctx) {
    const word = ctx.request.body.word
    const meta1 = ctx.request.body.meta1
    const meta2 = ctx.request.body.meta2
    let similar = []

    if(meta1 && meta2) {
      const result = await strapi.query('dictionary').find({ meta_1: meta1.toUpperCase() , meta_2: meta2.toUpperCase() });

      for await (let item of result) {
        item.similarity = Math.round(similarity(word, item.word) * 100)
      }

      similar = await result.sort(function(a, b){
        return (a.similarity > b.similarity) ? -1 : 1;
      }).filter(function (a) {
        return a.similarity !== 100 && a.similarity > 50
      });
    }

    ctx.send(similar);
  },
};
