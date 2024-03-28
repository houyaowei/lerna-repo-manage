var Types = {
    'NULL': '[object Null]',
    'STRING': '[object String]',
    'UNDEFINED': '[object Undefined]',
    'NUMBER': '[object Number]',
    'OBJECT': '[object Object]',
    'ARRAY': '[object Array]',
    'FUNCTION': '[object Function]',
    'DATE':'[object Date]',
    'BOOLEAN': '[object Boolean]',
    'ARGUMENTS': '[object Arguments]',
    'MAP': '[object Map]',
    'WEAKMAP': '[object WeakMap]',
    'WEAKSET': '[object WeakSet]',
    'SET': '[object Set]',
    'SYMBOL':'[object Symbol]',
    'REG': '[object RegExp]'
};

/**
 * typeof 为object的，但是不包含null
 * @param value
 * @returns {boolean}
 */
function isObjectLike(value) {
  return typeof value === 'object' && null !== value
}

/**
 * js中原始属性或者方法
 */
const _objectProto = Object.prototype;
const _hasOwnProperty = _objectProto.hasOwnProperty;
const _toString = _objectProto.toString;

const getTag =(value)=> {
    if (value == null) {
        return value === undefined ? Types.UNDEFINED : Types.NULL
    }
    return _toString.call(value)
};

/**
 * 验证基本类型
 */
/**
 * 判断是字符串
 * 需要注意的是，如果含有反义字符"\"并且是非末尾的时候，indexof的时候服务索引该字符
 * @param str
 * @returns {boolean}
 */
const isString = (str) => {
  if (!str) {
    return false
  }
  const type = typeof str;
  return type == 'string' ||  getTag(str) === Types.STRING
};
const isNumber = (value) => {
  if (!value) {
    return false
  }
  const type = typeof value;

  return type=='number' || Number(value) ||  getTag(value) === Types.NUMBER
};
const isArray = (arr) => {
  if (!arr) {
    return false
  }
  const type = typeof arr;

  return type =='object' && (Array.isArray(arr) ||  getTag(arr) === Types.ARRAY)
};
const isNull = (value) => {
  const type = typeof value;
  return type =='object' && ( getTag(value) === Types.NULL)
};
const isFunction = (fun) => {
  if (!fun) {
    return false
  }
  const type = typeof fun;
  return type =='function' && ( getTag(fun) === Types.FUNCTION)
};
const isObject = (value) => {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function')
};
/**
 * 是Date实例或者是标准的Date字符串'2022-1-21 12:24:11'
 */
const isDate = (value) => {
  if (isString(value)) {
    const d = new Date(value);
    return d instanceof Date && !isNaN(d.getTime()) ? true:false
  }
  return isObjectLike(value) && getTag(value) === Types.DATE
};
const isBoolean = (value) => {
  return value === true || value === false ||
    (isObjectLike(value) && getTag(value) == Types.BOOLEAN)
};
const isUndefined = (value) => {
  return value === undefined || getTag(value) === Types.UNDEFINED
};

/**
 * 最大值，最小值，最大安全整数，最小安全整数 参考
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number
 * @param value
 * @returns {boolean}
 */

function isLength(value) {
  return typeof value === 'number' &&
    value > -1 && value <= Number.MAX_SAFE_INTEGER
}

/**
 * typeof 为object的，但是不包含null
 * @param value
 * @returns {boolean}
 */
function isArrayLike(value) {
  return value != null && typeof value !== 'function' && isLength(value.length)
}

/**
 * 用来校验 Int8Array，UInt8Array等类型。具体请见：
 * https://developer.mozilla.org/zh-CN/docs/Web/API/ArrayBufferView
 * @type {RegExp}
 */

const regTypedTag = /^\[object (?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)Array\]$/;
function isTypedArray(value) {
  return isObjectLike(value) && regTypedTag.test(getTag(value))
}

/**
 * 用来判断函数参数
 * @param value
 * @returns {boolean}
 */
function isArguments(value) {
  return isObjectLike(value) && getTag(value) == Types.ARGUMENTS
}

function isPrototype(value) {
  const _constructor = value && value.constructor;
  const proto = (typeof _constructor === 'function' && _constructor.prototype) || _objectProto;

  return value === proto
}

const isEmpty = function(value) {
  if(value === null) {
    return true
  }
  if (isArrayLike(value)) {
    if (isArray(value) || typeof value === 'string' || isTypedArray(value) || isArguments(value)) {
      return !value.length
    }
  }
  //map和set。weakMap和weakSet没有size字段，不判断
  if (getTag(value) === Types.MAP || getTag(value) === Types.SET) {
    return !value.size
  }
  //如果传入的是对象的prototype
  if (isPrototype(value)) {
    return !Object.keys(value).length
  }
  if (Object.keys(value).length === 0) {
    return true
  }
  //判断普通对象
  for (let k in value) {
    if (k){
      if (_hasOwnProperty.call(value,k)) {
        return false
      }
    }
    return true
  }
};

const isMap = function (value) {
  return isObjectLike(value) && getTag(value) == Types.MAP
};

const isSet = function (value) {
  return isObjectLike(value) && getTag(value) == Types.SET
};

const isError = function (value) {
  return isObjectLike(value) && value instanceof Error
};

function isSymbol(value) {
  const type = typeof value;
  return type == 'symbol' || (isObjectLike(value) && getTag(value) == Types.SYMBOL)
}

function isRegExp(value) {
  return isObjectLike(value) && getTag(value) == Types.REG
}

const isKeyExist = function (value, key) {
  if(value === null) {
    return false
  }
  //map和set。weakMap和weakSet没有size字段，不判断
  if (getTag(value) === Types.MAP || getTag(value) === Types.SET) {
    return value.has(key)
  }
  //prototype和普通对象做统一处理
  if (isPrototype(value) || isObject(value) ) {
    return value[key] !== undefined ? true: false
  }
  if (Object.keys(value).length === 0) {
    return false
  }
};

function isWeakMap(value) {
  return isObjectLike(value) && getTag(value) == Types.WEAKMAP
}

function isWeakSet(value) {
  return isObjectLike(value) && getTag(value) == Types.WEAKSET
}

/**
 * 判断三种情况：
 * 1、Object构造方法创建的对象，如：Object.create
 * 2、带有[[prototype]],即对象实例
 * 3、null
 */


function isPlainObject(value) {
  //不是对象
  if (!isObjectLike(value) || !(getTag(value) === Types.OBJECT)) {
    return false
  }
  // Object.create(null)
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto
}

/**
 * node type
 * 详情见：https://developer.mozilla.org/zh-CN/docs/Web/API/Node
 */
var nodeType = {
  'ELEMENT_NODE' : 1,
  'ATTRIBUTE_NODE' : 2,
  'TEXT_NODE' : 3,
  'CDATA_SECTION_NODE' : 4,
  'COMMENT_NODE': 8,
  'DOCUMENT_NODE': 9,
  'DOCUMENT_TYPE_NODE': 10,
  'DOCUMENT_FRAGMENT_NODE': 11
};

//判断节点
const isElement = function (value) {
  return isObjectLike(value) && isPlainObject(value) && value.nodeType == nodeType.ELEMENT_NODE
};

/**
 * 
 * 判断两个对象的值是否相同
 */

function isObjectEqual(obj1, obj2) {
  let isObj = (isObject(obj1) && isObject(obj2));
  if (!isObj) {
    return false;
  }
  let _keys1 = Object.keys(obj1);
  let _key2 = Object.keys(obj2);
  //如果长度不相等直接返回false
  if (_keys1.length !== _key2.length) {
    return false;
  }

  for (const key in obj1) {
    if (obj2.hasOwnProperty.call(obj2, key)) {
      let obj1Type = _toString.call(obj1[key]);
      let obj2Type = _toString.call(obj2[key]);
      if(obj1Type === Types.OBJECT || obj2Type === Types.OBJECT) {
        if(!isObjectEqual(obj1[key], obj2[key])) {
          return false;
        }
      } else if (obj1[key] !== obj2[key]) {
        return false;
      }
    } else {
      return false;
    }
  }
  return true; 
}

export { isArray, isArrayLike, isBoolean, isDate, isElement, isEmpty, isObjectEqual as isEqual, isError, isFunction, isKeyExist, isMap, isNull, isNumber, isObject, isRegExp, isSet, isString, isSymbol, isUndefined, isWeakMap, isWeakSet };
