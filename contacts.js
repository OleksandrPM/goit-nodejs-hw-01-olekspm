import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

export default { listContacts, getContactById, removeContact, addContact };

const contactsPath = path.resolve("db", "contacts.json");

// Повертає масив контактів.
export async function listContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

// Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
export async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact || null;
}

// Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
export async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex(({ id }) => id === contactId);
  if (index !== -1) {
    const removedContact = contacts.splice(index, 1)[0];
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContact;
  } else {
    return null;
  }
}

// Повертає об'єкт доданого контакту.
// Зациклює при роботі із json в режимі dev без перевірки наявності контакту
export async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };

  if (!isContactPresent(contacts, newContact)) {
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } else {
    return null;
  }
}

function isContactPresent(contacts, contact) {
  const { name, email, phone } = contact;
  return contacts.find(
    (contact) =>
      contact.name === name &&
      contact.email === email &&
      contact.phone === phone
  )
    ? true
    : false;
}
