import { randomBytes, randomInt } from 'crypto';

export interface AccountData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export function buildAccountData(email: string): AccountData {
  return {
    firstName: 'Auto',
    lastName: 'Tester',
    email,
    phone: `980${randomInt(1_000_000, 9_999_999)}`, // 980 prefix is accepted; the rest is random so reruns don't collide
    password: `Qa@${randomBytes(4).toString('hex')}9`,
  };
}

export interface AgencyData {
  name: string;
  role: string;
  email: string;
  website: string;
  address: string;
  region: string;
}

export function buildAgencyData(email: string): AgencyData {
  const id = `${Date.now().toString(36)}${randomBytes(2).toString('hex')}`;
  return {
    name: `Auto Agency ${id}`,
    role: 'Manager',
    email,
    website: 'www.example.com',
    address: 'Kathmandu, Nepal',
    region: 'Nepal',
  };
}

export interface ExperienceData {
  studentsPerYear: string;
  focusArea: string;
  successMetrics: string;
}

export function buildExperienceData(): ExperienceData {
  return {
    studentsPerYear: '50',
    focusArea: 'Undergraduate admissions',
    successMetrics: '80',
  };
}

export interface VerificationData {
  registrationNumber: string;
  country: string;
}

export function buildVerificationData(): VerificationData {
  return {
    registrationNumber: `REG-${Date.now().toString(36)}${randomBytes(2).toString('hex')}`.toUpperCase(),
    country: 'Australia',
  };
}

// A tiny PDF made in memory, so no file needs to live in the repo
export const sampleDocument = {
  name: 'business-registration.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF'),
};