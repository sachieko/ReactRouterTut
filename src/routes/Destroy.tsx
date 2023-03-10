import { redirect } from "react-router-dom";
import { deleteContact } from "../contactHelpers";
import { IdeleteParams } from "../interfaces";

export async function action({ params }: IdeleteParams) {
  await deleteContact(params.contactId as string);
  return redirect('/');
};