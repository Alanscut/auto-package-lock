function notExist(str) {
  return str === undefined || str === "";
}

function struct_length(struct) {
  let num = 0;
  for (const structKey in struct) {
    num++;
  }
  return num;
}

function struct_delete(struct, name) {
  let temp = {};
  for (const key in struct) {
    if (key !== name) {
      temp[key] = struct[key];
    }
  }
  return temp;
}

exports.notExist = notExist;
exports.struct_length = struct_length;
exports.struct_delete = struct_delete;
