// version from `meta.json` - first param
// version in bundle file - second param
export const compareVersion = (versionA: string, versionB: string) => {
  const versionsA = versionA.split(/\./g);
  const versionsB = versionB.split(/\./g);

  while (versionsA.length || versionsB.length) {
    const a = Number(versionsA.shift());
    const b = Number(versionsB.shift());

    if (a === b) continue;

    return a > b || isNaN(b);
  }

  return false;
};
