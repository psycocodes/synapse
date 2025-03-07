// utils/storageUtils.js
export const ROOT_PATH = '/root/';
export const SEP = '/';
export const NOTEBOOK_SUFFIX = '_notebooks';

export const keyForSubGroups = (path) => path;
export const keyForNotebooks = (path) => path + NOTEBOOK_SUFFIX;

export const getGroupPath = (currentPath, groupName) => keyForSubGroups(currentPath) + groupName + SEP;
export const getNotebookPath = (currentPath, notebookName) => keyForNotebooks(currentPath) + SEP + notebookName;


export const getPreviousPath = (path) => {
  const paths = path.split(SEP).filter(Boolean);
  paths.pop(); // Remove the last group
  return (paths.length ? (SEP + paths.join(SEP) + SEP) : ROOT_PATH);
};

export const namesOfItemsOfType = (items, type) =>
  items.filter((item) => item.type === type).map((item) => item.name);

export const createItem = (name, type) => ({ name, type });
