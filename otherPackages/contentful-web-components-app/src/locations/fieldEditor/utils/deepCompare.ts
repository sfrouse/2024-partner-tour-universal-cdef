



// export default function isDeepEqual (object1: {[key:string]: any}, object2: {[key:string]: any}) {
//   const objKeys1 = Object.keys(object1);
//   const objKeys2 = Object.keys(object2);

//   if (objKeys1.length !== objKeys2.length) return false;

//   for (var key of objKeys1) {
//     const value1 = object1[key];
//     const value2 = object2[key];

//     const isObjects = isObject(value1) && isObject(value2);

//     if ((isObjects && !isDeepEqual(value1, value2)) ||
//       (!isObjects && value1 !== value2)
//     ) {
//       return false;
//     }
//   }
//   return true;
// };

// const isObject = (object: any) => {
//   return object != null && typeof object === "object";
// };

export default function isDeepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  // ===== ARRAY ==========================================
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if(obj1.length !== obj2.length) {
      // cons ole.log('different lengths', obj1, obj2);
      return false;
    }
    return obj1.every((elem, index) => {
      return isDeepEqual(elem, obj2[index]);
    })
  }

  // ===== OBJECT ==========================================
  if(typeof obj1 === "object" && typeof obj2 === "object" && obj1 !== null && obj2 !== null) {
    if(Array.isArray(obj1) || Array.isArray(obj2)) {
      // con sole.log('one is an array', Array.isArray(obj1), Array.isArray(obj2));
      return false;
    }
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if(keys1.length !== keys2.length || !keys1.every(key => keys2.includes(key))) {
      // cons ole.log('keys are different', keys1, keys2, obj1, obj2);
      return false;
    }
    for(let key in obj1) {
       let isEqual = isDeepEqual(obj1[key], obj2[key])
       if (!isEqual) {
        // cons ole.log('keys values are different', obj1[key], obj2[key]);
        return false;
      }
    }
    return true;
  }
  // con sole.log('not sure', obj1, obj2);
  return false;
}

/*
export default function isDeepEqual(o: any, p: any)
{
    var i,
        keysO = Object.keys(o).sort(),
        keysP = Object.keys(p).sort();
    if (keysO.length !== keysP.length) {
      console.log('differnt amount of keys');
      return false;//not the same nr of keys
    }
    if (keysO.join('') !== keysP.join('')) {
      console.log('differnt keys');
      return false;//different keys
    }
    for (i=0;i<keysO.length;++i)
    {
        if (o[keysO[i]] instanceof Array)
        {
            if (!(p[keysO[i]] instanceof Array)) {
              console.log('not an array');
              return false;
            }
            //if (compareObjects(o[keysO[i]], p[keysO[i]] === false) return false
            //would work, too, and perhaps is a better fit, still, this is easy, too
            if (p[keysO[i]].sort().join('') !== o[keysO[i]].sort().join('')) {
              console.log('differnt arrat keys');
              return false;
            }
        }
        else if (o[keysO[i]] instanceof Date)
        {
            if (!(p[keysO[i]] instanceof Date)) {
              console.log('not a date');
              return false;
            }
            if ((''+o[keysO[i]]) !== (''+p[keysO[i]])) {
              console.log('not same date');
              return false;
            }
        }
        else if (o[keysO[i]] instanceof Function)
        {
            if (!(p[keysO[i]] instanceof Function))
                return false;
            //ignore functions, or check them regardless?
        }
        else if (o[keysO[i]] instanceof Object)
        {
            if (!(p[keysO[i]] instanceof Object))
                return false;
            if (o[keysO[i]] === o)
            {//self reference?
                if (p[keysO[i]] !== p)
                    return false;
            }
            else if (isDeepEqual(o[keysO[i]], p[keysO[i]]) === false)
                return false;//WARNING: does not deal with circular refs other than ^^
        }
        if (o[keysO[i]] !== p[keysO[i]])//change !== to != for loose comparison
            return false;//not the same value
    }
    return true;
}

*/