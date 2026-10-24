import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';
import Service from '../models/Service.js';

dotenv.config();

export const sampleServices = [
  {
    name: 'Bonafide Certificate',
    keywords: ['bonafide', 'bonafide certificate', 'bona fide', 'certificate'],
    visitRequired: 'MAYBE',
    onlineAvailable: true,
    documents: ['College ID', 'Student details'],
    procedure: [
      'Submit the certificate request',
      'Provide required student information',
      'Follow the instructions provided by the college',
    ],
    fees: 'To be verified',
    processingTime: 'To be verified',
    department: 'Student Section',
    officeLocation: 'To be verified',
    onlineApplicationUrl: '',
    conditions: ['Final requirement should be confirmed with the college'],
    description: 'Certificate confirming that the student is enrolled in the college.',
    lastVerified: null,
    verificationSource: 'Pending official college verification',
    status: 'sample',
  },
  {
    name: 'Exam Form',
    keywords: ['exam form', 'examination form', 'exam', 'examform'],
    visitRequired: 'MAYBE',
    onlineAvailable: true,
    documents: ['Student ID', 'Current semester details'],
    procedure: [
      'Open the exam form section',
      'Fill in the required details',
      'Submit the form before the deadline',
    ],
    fees: 'To be verified',
    processingTime: 'To be verified',
    department: 'Examination Section',
    officeLocation: 'To be verified',
    onlineApplicationUrl: '',
    conditions: ['Check the exam schedule and deadlines with the college'],
    description: 'Information related to exam form submission and required steps.',
    lastVerified: null,
    verificationSource: 'Pending official college verification',
    status: 'sample',
  },
  {
    name: 'Migration Certificate',
    keywords: ['migration certificate', 'migration', 'migration form'],
    visitRequired: 'YES',
    onlineAvailable: false,
    documents: ['Previous college records', 'Transfer details'],
    procedure: [
      'Apply for migration through the official college process',
      'Submit required documents',
      'Complete the final approval steps',
    ],
    fees: 'To be verified',
    processingTime: 'To be verified',
    department: 'Academic/Administration Section',
    officeLocation: 'To be verified',
    onlineApplicationUrl: '',
    conditions: ['Physical visit may be required depending on the process'],
    description: 'Certificate required when a student is transferring to another institution.',
    lastVerified: null,
    verificationSource: 'Pending official college verification',
    status: 'sample',
  },
  {
    name: 'Degree Certificate',
    keywords: ['degree certificate', 'degree', 'graduation certificate'],
    visitRequired: 'MAYBE',
    onlineAvailable: true,
    documents: ['Enrollment details', 'Academic records'],
    procedure: [
      'Submit degree certificate request',
      'Provide the required student records',
      'Follow the official process and collection instructions',
    ],
    fees: 'To be verified',
    processingTime: 'To be verified',
    department: 'Degree Section',
    officeLocation: 'To be verified',
    onlineApplicationUrl: '',
    conditions: ['Confirmation depends on the college certificate process'],
    description: 'Official certificate issued after successful completion of the academic program.',
    lastVerified: null,
    verificationSource: 'Pending official college verification',
    status: 'sample',
  },
  {
    name: 'Extra-Curricular Activity Certificate',
    keywords: ['extra curricular activity certificate', 'extra-curricular activity certificate', 'extra curricular', 'activity certificate'],
    visitRequired: 'MAYBE',
    onlineAvailable: true,
    documents: ['Student ID', 'Activity details'],
    procedure: [
      'Submit the activity certificate request',
      'Provide the relevant activity information',
      'Follow the applicable approval or collection steps',
    ],
    fees: 'To be verified',
    processingTime: 'To be verified',
    department: 'Student Activities Office',
    officeLocation: 'To be verified',
    onlineApplicationUrl: '',
    conditions: ['Requirement depends on the activity office process'],
    description: 'Certificate supporting student participation in extracurricular activities.',
    lastVerified: null,
    verificationSource: 'Pending official college verification',
    status: 'sample',
  },
];

export async function seedServices({ reset = true } = {}) {
  try {
    await connectDB();

    if (reset) {
      await Service.deleteMany({});
    }

    const existingCount = await Service.countDocuments();
    if (existingCount > 0 && !reset) {
      return existingCount;
    }

    const inserted = await Service.insertMany(sampleServices);
    console.log(`${inserted.length} sample services inserted.`);
    return inserted.length;
  } catch (error) {
    console.error('Seeding failed:', error.message);
    return 0;
  } finally {
    await disconnectDB();
  }
}

if (process.argv[1] && process.argv[1].includes('seed/services.js')) {
  seedServices();
}
