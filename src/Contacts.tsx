import localforage, { key } from "localforage";
import { matchSorter } from "match-sorter";
import { Icontact } from "./interfaces";


export async function getContacts(query: string) {
  try {
    await fakeNetwork(`getContacts:${query}`);
    const contactsJson: string | null = await localforage.getItem("contacts");
    let contacts: Icontact[] = typeof contactsJson === 'string' ? JSON.parse(contactsJson) : [];
    if (!contacts) contacts = [];
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
  const contact: Icontact = { id, createdAt: Date.now() };
  const contacts = await getContacts('');
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id: string) {
  try {
    await fakeNetwork(`contact:${id}`);
    const contactsJson: string | null = await localforage.getItem("contacts");
    const contacts: Icontact[] = typeof contactsJson === 'string' ? JSON.parse(contactsJson) : [];
    const contact = contacts.find(contact => contact.id === id);
    return contact ?? null;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}

export async function updateContact(id: number, updates: any) {
  try {
    await fakeNetwork('');
    const contactsJson: string | null = await localforage.getItem("contacts");
    const contacts: Icontact[] = typeof contactsJson === 'string' ? JSON.parse(contactsJson) : [];
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

export async function deleteContact(id: number) {
  try {
    const contactsJson: string | null = await localforage.getItem("contacts");
    const contacts: Icontact[] = typeof contactsJson === 'string' ? JSON.parse(contactsJson) : [];
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