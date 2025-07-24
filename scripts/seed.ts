

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create test users
  const users = [
    {
      email: 'john@doe.com',
      name: 'John Doe',
      title: 'Senior Quality Auditor',
      company: 'Quality Consulting Inc.',
      phone: '+1-555-0123'
    },
    {
      email: 'sarah.johnson@techcorp.com',
      name: 'Sarah Johnson',
      title: 'Quality Manager',
      company: 'TechCorp Solutions',
      phone: '+1-555-0456'
    },
    {
      email: 'michael.chen@safetyaudit.com',
      name: 'Michael Chen',
      title: 'OH&S Specialist',
      company: 'Safety Audit Services',
      phone: '+1-555-0789'
    }
  ];

  console.log('👥 Creating users...');
  const createdUsers = await Promise.all(
    users.map(userData =>
      prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData
      })
    )
  );

  // Create sample ISO 9001 audits
  console.log('📋 Creating ISO 9001 audits...');
  
  const iso9001Audit1 = await prisma.audit.create({
    data: {
      title: 'Annual ISO 9001 Quality Management System Audit',
      companyName: 'Manufacturing Excellence Corp',
      companyAddress: '123 Industrial Park Blvd, Manufacturing City, MC 12345',
      leadAuditorId: createdUsers[0].id,
      isoStandard: 'ISO9001',
      selectedSections: ['iso9001-section-4', 'iso9001-section-5', 'iso9001-section-8', 'iso9001-section-9'],
      customScope: false,
      status: 'IN_PROGRESS',
      completionPercentage: 65.5,
      overallScore: 78.2,
      interviewees: {
        create: [
          {
            name: 'Robert Smith',
            jobTitle: 'Quality Manager',
            department: 'Quality Assurance',
            email: 'robert.smith@manufacturing.com'
          },
          {
            name: 'Lisa Brown',
            jobTitle: 'Production Supervisor',
            department: 'Manufacturing',
            email: 'lisa.brown@manufacturing.com'
          },
          {
            name: 'David Wilson',
            jobTitle: 'Process Engineer',
            department: 'Engineering',
            email: 'david.wilson@manufacturing.com'
          }
        ]
      }
    }
  });

  const iso9001Audit2 = await prisma.audit.create({
    data: {
      title: 'ISO 9001 Surveillance Audit - Q3 2024',
      companyName: 'Service Solutions Ltd',
      companyAddress: '456 Business Center Dr, Service City, SC 67890',
      leadAuditorId: createdUsers[1].id,
      isoStandard: 'ISO9001',
      selectedSections: ['iso9001-section-4', 'iso9001-section-5', 'iso9001-section-6', 'iso9001-section-7', 'iso9001-section-8', 'iso9001-section-9', 'iso9001-section-10'],
      customScope: false,
      status: 'COMPLETED',
      completionPercentage: 100,
      overallScore: 92.1,
      dateCompleted: new Date('2024-09-15'),
      interviewees: {
        create: [
          {
            name: 'Jennifer Lee',
            jobTitle: 'Operations Manager',
            department: 'Operations',
            email: 'jennifer.lee@servicesolutions.com'
          },
          {
            name: 'Mark Taylor',
            jobTitle: 'Customer Service Manager',
            department: 'Customer Relations',
            email: 'mark.taylor@servicesolutions.com'
          }
        ]
      }
    }
  });

  // Create sample ISO 45001 audits
  console.log('🛡️ Creating ISO 45001 audits...');

  const iso45001Audit1 = await prisma.audit.create({
    data: {
      title: 'ISO 45001 OH&S Management System Implementation Audit',
      companyName: 'Heavy Industries Inc',
      companyAddress: '789 Industrial Complex Ave, Heavy City, HC 11223',
      leadAuditorId: createdUsers[2].id,
      isoStandard: 'ISO45001',
      selectedSections: ['iso45001-section-4', 'iso45001-section-5', 'iso45001-section-6', 'iso45001-section-8'],
      customScope: false,
      status: 'IN_PROGRESS',
      completionPercentage: 42.3,
      interviewees: {
        create: [
          {
            name: 'Patricia Davis',
            jobTitle: 'OH&S Manager',
            department: 'Health & Safety',
            email: 'patricia.davis@heavyindustries.com'
          },
          {
            name: 'James Rodriguez',
            jobTitle: 'Plant Manager',
            department: 'Operations',
            email: 'james.rodriguez@heavyindustries.com'
          },
          {
            name: 'Amanda White',
            jobTitle: 'Safety Representative',
            department: 'Health & Safety',
            email: 'amanda.white@heavyindustries.com'
          }
        ]
      }
    }
  });

  const iso45001Audit2 = await prisma.audit.create({
    data: {
      title: 'Construction Site OH&S Compliance Audit',
      companyName: 'BuildSafe Construction',
      companyAddress: '321 Construction Way, Build City, BC 33445',
      leadAuditorId: createdUsers[0].id,
      isoStandard: 'ISO45001',
      selectedSections: ['iso45001-section-5', 'iso45001-section-6', 'iso45001-section-8', 'iso45001-section-9', 'iso45001-section-10'],
      customScope: true,
      status: 'COMPLETED',
      completionPercentage: 100,
      overallScore: 85.7,
      dateCompleted: new Date('2024-10-22'),
      interviewees: {
        create: [
          {
            name: 'Kevin Johnson',
            jobTitle: 'Site Safety Officer',
            department: 'Health & Safety',
            email: 'kevin.johnson@buildsafe.com'
          },
          {
            name: 'Rachel Green',
            jobTitle: 'Project Manager',
            department: 'Operations',
            email: 'rachel.green@buildsafe.com'
          }
        ]
      }
    }
  });

  const iso9001Audit3 = await prisma.audit.create({
    data: {
      title: 'Technology Company Quality System Review',
      companyName: 'InnovateTech Solutions',
      companyAddress: '555 Tech Park Lane, Innovation Valley, IV 55667',
      leadAuditorId: createdUsers[1].id,
      isoStandard: 'ISO9001',
      selectedSections: ['iso9001-section-4', 'iso9001-section-7', 'iso9001-section-8', 'iso9001-section-9'],
      customScope: false,
      status: 'DRAFT',
      completionPercentage: 0,
      interviewees: {
        create: [
          {
            name: 'Thomas Anderson',
            jobTitle: 'CTO',
            department: 'Technology',
            email: 'thomas.anderson@innovatetech.com'
          },
          {
            name: 'Helen Parker',
            jobTitle: 'Quality Assurance Lead',
            department: 'Engineering',
            email: 'helen.parker@innovatetech.com'
          }
        ]
      }
    }
  });

  // Create sample findings for completed audits
  console.log('📝 Creating sample findings...');

  // Sample findings for ISO 9001 completed audit
  await prisma.auditFinding.createMany({
    data: [
      {
        auditId: iso9001Audit2.id,
        questionId: 'q4-1',
        score: 'COMPLIANT',
        notes: 'Organization has thoroughly documented internal and external issues in strategic planning documents. Regular environmental scanning is conducted quarterly.',
        evidenceNotes: 'Reviewed: Strategic Plan 2024, SWOT Analysis, Stakeholder Register, Environmental Scan Reports Q1-Q3 2024'
      },
      {
        auditId: iso9001Audit2.id,
        questionId: 'q4-3',
        score: 'COMPLIANT',
        notes: 'Comprehensive stakeholder mapping completed with clear identification of interested parties and their requirements.',
        evidenceNotes: 'Reviewed: Stakeholder Matrix, Customer Requirements Documentation, Regulatory Requirements Register'
      },
      {
        auditId: iso9001Audit2.id,
        questionId: 'q5-1',
        score: 'MINOR_NC',
        notes: 'Top management demonstrates leadership but resource allocation for quality initiatives could be improved. Some delayed approvals noted.',
        evidenceNotes: 'Interviews with CEO, Quality Manager. Reviewed: Management Review Minutes, Budget Allocations, Project Approval Records'
      }
    ]
  });

  // Sample findings for ISO 45001 completed audit
  await prisma.auditFinding.createMany({
    data: [
      {
        auditId: iso45001Audit2.id,
        questionId: 'iso45001-q5-1',
        score: 'COMPLIANT',
        notes: 'Top management demonstrates strong commitment to OH&S with visible leadership and adequate resource provision.',
        evidenceNotes: 'Reviewed: OH&S Policy, Management Review Records, Resource Allocation Documents. Interviews with Site Manager, Safety Officer'
      },
      {
        auditId: iso45001Audit2.id,
        questionId: 'iso45001-q6-2',
        score: 'COMPLIANT',
        notes: 'Comprehensive hazard identification process in place with worker participation. Regular risk assessments conducted.',
        evidenceNotes: 'Reviewed: Hazard Identification Procedure, Risk Assessment Reports, Job Safety Analyses, Worker Consultation Records'
      },
      {
        auditId: iso45001Audit2.id,
        questionId: 'iso45001-q5-4',
        score: 'MAJOR_NC',
        notes: 'Worker consultation process exists but participation is limited. Some workers report not being adequately consulted on safety matters.',
        evidenceNotes: 'Worker interviews, Safety Committee Minutes, Consultation Records. Gap identified in systematic worker participation'
      }
    ]
  });

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${createdUsers.length} users`);
  console.log(`   - 5 audits (3 ISO 9001, 2 ISO 45001)`);
  console.log(`   - Multiple interviewees and findings`);
  console.log(`   - Test account: john@doe.com / johndoe123`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
