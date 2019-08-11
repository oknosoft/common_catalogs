/**
 * Верхний уровень корректировки метаданных
 *
 * @module meta.patch.js
 *
 * Created by Evgeniy Malyarov on 18.05.2019.
 */

const include = [
  'cat.clrs',
  'cat.users',
];
const exclude = [];
const minimal = [];
const writable = [
  'cat.clrs',
];
const read_only = [];


module.exports = function(meta) {
  for(const cls in meta) {
    const mgrs = meta[cls];
    if(Array.isArray(mgrs)) {
      continue;
    }
    for(const name in mgrs) {
      if(!include.includes('*') && !include.includes(`${cls}.${name}`)) {
        delete mgrs[name];
      }
      else if(exclude.includes(`${cls}.${name}`)) {
        delete mgrs[name];
      }
      else if(minimal.includes(`${cls}.${name}`)) {
        for(const fld in mgrs[name].fields) {
          if(['parent', 'owner'].includes(fld)) continue;
          delete mgrs[name].fields[fld];
        }
        for(const fld in mgrs[name].tabular_sections) {
          delete mgrs[name].tabular_sections[fld];
        }
      }

      if(mgrs[name]) {
        if(/^doc/.test(mgrs[name].cachable)) {
          mgrs[name].original_cachable = mgrs[name].cachable;
          mgrs[name].cachable = 'ram';
        }

        delete mgrs[name].form;

        if(!writable.includes('*') && !writable.includes(`${cls}.${name}`)) {
          mgrs[name].read_only = true;
        }
        else if(read_only.includes(`${cls}.${name}`)) {
          mgrs[name].read_only = true;
        }
      }
    }
  }
}
