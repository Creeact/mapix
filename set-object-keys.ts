import RecursiveIterator from 'recursive-iterator';

export function setObjectKeys(obj: any, cachePath: string) {
  for (const { path, node } of Array.from(new RecursiveIterator(obj)) as any) {
    if (typeof node === 'object') {
      node['__mapixCachePath'] = { cachePath, path };
    }
  }
}

export function setCacheObjectValue(cachePath: string, path: [string], value: any) {

}

function setObjectValue(object: any, paths: string[], value: any, pathIndex: number = 0) {
  if (pathIndex === paths.length) {
    return { ...value, ...object };
  }

  const path = paths[pathIndex];

  return {
    ...object,
    [path]: setObjectValue(object[path], paths, value, pathIndex + 1)
  };
}

const obj = {
  x: 'x',
  subKey: {
    subKey2: {
      z: 'z',
    }
  }
};

setObjectKeys(obj, 'something.something.something');

console.log(JSON.stringify(obj, null, 2));

console.log(setObjectValue(obj, ['subKey'], {lala: 'lala'}));
