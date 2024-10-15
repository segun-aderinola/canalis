// import axios from "axios";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createObjectCsvStringifier } from 'csv-writer';

dotenv.config();

export function generateCode(length: number) {
  var result = "";
  var characters = "123456789123456789123456789";
  var charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
export function generateDummyAccountNumber(): string {
  const prefix = "02";
  const randomDigits = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");
  return prefix + randomDigits;
}
export function maskPhoneNumber(phoneNumber: string) {
  
  const phoneStr = phoneNumber.toString();
  
  const visiblePart = phoneStr.slice(-4);
  
  const maskedPart = '*'.repeat(phoneStr.length - 4);
  
  return maskedPart + visiblePart;
}

export const generateToken = async () => {
  return crypto.randomBytes(20).toString("hex");
};
// jwt token
export const generateJwtToken = async (user: any) => {
  const secret_key: any = process.env.JWT_SECRET;
  const session = process.env.SESSION;
  const token = jwt.sign({ userId: user.id }, secret_key, { expiresIn: session });
  return token;
};

export async function exportCSVData(collectionName: string, headers: any, data: any) {
  const csvStringifier = createObjectCsvStringifier({
    header: headers,
  });

  const csvHeader = csvStringifier.getHeaderString();
  const csvRecords = csvStringifier.stringifyRecords(data);

  return csvHeader + csvRecords; // Combine header and records
}

export const getAgeByDate = (dateString: string) => {
  //console.log(dateString)
  console.log(dateString);
  const dob = new Date(dateString);
  console.log(dob);
  const currentDate = new Date();
  const birthYear = dob.getFullYear();
  const currentYear = currentDate.getFullYear();
  console.log(birthYear, currentYear);
  const age = currentYear - birthYear;
  return age;
};

export const getBirthYear = (dateString: string) => {
  const dob = new Date(dateString);
  return dob.getFullYear();
};

export function validateEmail(input_str: string) {
  var re = /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return re.test(input_str);
}

export function stringToSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function format_number(number: number, locale = "en-US") {
  return new Intl.NumberFormat(locale).format(number);
}
