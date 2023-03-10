import localforage, { key } from "localforage";
import { matchSorter } from "match-sorter";
import { Icontact } from "./interfaces";

export async function getContacts(query?: string) {
  try {
    await fakeNetwork(`getContacts:${query}`);
    let contacts= await localforage.getItem("contacts") as Icontact[];
    if (query) {
      contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
    }
    return contacts;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return [];
  }
}

export async function createContact() {
  await fakeNetwork('');
  const id = Math.random().toString(36).substring(2, 9);
  const contact: Icontact = { 
    id,
    createdAt: Date.now(),
    first: 'No',
    last: 'Name',
    avatar: "https://placekitten.com/g/200/200",
    twitter: "your_handle",
    notes: "Some notes",
    favorite: true, 
  };
  const contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id: string) {
  try {
    await fakeNetwork(`contact:${id}`);
    const contacts= await localforage.getItem("contacts") as Icontact[];
    const contact = contacts.find(contact => contact.id === id);
    return contact ?? null;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}

export async function updateContact(id: string, updates: any) {
  try {
    await fakeNetwork('');
    const contacts= await localforage.getItem("contacts") as Icontact[];
    let contact = contacts.find(contact => contact.id === id.toString());
    if (!contact) throw new Error("No contact found for " + id.toString());
    Object.assign(contact, updates);
    await set(contacts);
    return contact;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}

export async function deleteContact(id: string) {
  try {
    const contacts= await localforage.getItem("contacts") as Icontact[];
    const index = contacts.findIndex(contact => contact.id === id.toString());
    if (index > -1) {
      contacts.splice(index, 1);
      await set(contacts);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return false;
  }
}

function set(contacts: Icontact[]) {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen

interface fakeCache {
  [key: string]: boolean;
}

let fakeCache: fakeCache = {};

async function fakeNetwork(key: string) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}